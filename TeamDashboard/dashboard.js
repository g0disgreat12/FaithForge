const API_URL = 'https://ffg-activity-tracker.faithforgegaming.workers.dev/api/team-activity';
const TIMEZONE = 'America/New_York';
const FIRST_QUARTER = 2026 * 4 + 3;
const ROLES = {
  stream_team: 'Stream Team', staff: 'Staff', moderator: 'Moderator',
  biblical_lead: 'Biblical Lead', channel_lead: 'Channel Lead',
};
const LABELS = {all: 'All roles', ...ROLES};
const number = new Intl.NumberFormat('en-US', {maximumFractionDigits: 1});
const easternDate = new Intl.DateTimeFormat('en-CA', {
  timeZone: TIMEZONE, year: 'numeric', month: '2-digit', day: '2-digit',
});
const dayLabel = new Intl.DateTimeFormat('en-US', {timeZone: 'UTC', month: 'short', day: 'numeric'});
const timeLabel = new Intl.DateTimeFormat('en-US', {
  timeZone: TIMEZONE, month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZoneName: 'short',
});
const el = id => document.getElementById(id);
const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const activityFields = ['messages', 'voice_ms', 'shared_voice_ms', 'active_days', 'active_weeks', 'text_days', 'voice_days'];

function today() {
  const parts = Object.fromEntries(easternDate.formatToParts(new Date()).map(part => [part.type, part.value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
}

function calendarQuarter(day) {
  return Number(day.slice(0, 4)) * 4 + Math.floor((Number(day.slice(5, 7)) - 1) / 3);
}

function quarterId(serial) {
  return `${Math.floor(serial / 4)}-Q${serial % 4 + 1}`;
}

function quarterLabel(id) {
  return `${id.slice(5)} ${id.slice(0, 4)}`;
}

function quarterStart(id) {
  const month = (Number(id.at(-1)) - 1) * 3 + 1;
  return `${id.slice(0, 4)}-${String(month).padStart(2, '0')}-01`;
}

function dayText(day) {
  return dayLabel.format(new Date(`${day}T12:00:00Z`));
}

function timeText(value) {
  return value && Number.isFinite(Date.parse(value)) ? timeLabel.format(new Date(value)) : '—';
}

function duration(ms) {
  if (!ms) return '0 min';
  if (ms < 6000) return '<0.1 min';
  const minutes = ms / 60_000;
  if (minutes < 60) return `${number.format(minutes)} min`;
  const rounded = Math.round(minutes);
  return `${number.format(Math.floor(rounded / 60))}h ${rounded % 60}m`;
}

function escapeHtml(value) {
  const entities = {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'};
  return String(value ?? '').replace(/[&<>"']/g, char => entities[char]);
}

let currentQuarter = calendarQuarter(today());
let quarter = quarterId(currentQuarter);
let role = 'all';
let viewingCode = '';
let report = null;
let roster = null;
let pending = false;
let problem = '';
let request = null;

function setQuarterOptions() {
  el('quarter').innerHTML = '';
  for (let serial = currentQuarter + 1; serial >= Math.min(FIRST_QUARTER, currentQuarter); serial--) {
    const id = quarterId(serial);
    const suffix = serial > currentQuarter ? ' · Upcoming' : serial === currentQuarter ? ' · Current' : '';
    el('quarter').add(new Option(quarterLabel(id) + suffix, id));
  }
  el('quarter').value = quarter;
}

function populateRoles() {
  el('roleFilters').innerHTML = Object.entries(LABELS).map(([key, label]) =>
    `<button class="role-button role-${key}" type="button" data-role="${key}" aria-pressed="false">
      <span class="role-dot" aria-hidden="true"></span><span>${label}</span><span class="role-count" aria-hidden="true">—</span>
    </button>`).join('');
}

function coverageFor(value) {
  if (!value) return {available: false};
  if (!value.tracking_started_at) return {available: false, message: 'The tracker has not started collecting activity.'};
  const parts = Object.fromEntries(easternDate.formatToParts(new Date(value.tracking_started_at)).map(part => [part.type, part.value]));
  const trackedFrom = `${parts.year}-${parts.month}-${parts.day}`;
  if (value.to < trackedFrom) return {available: false, message: 'This quarter ended before tracking began.'};
  if (value.to < value.retained_from) return {available: false, message: 'This quarter has aged out of the 400-day history. Check an exported report.'};
  if (!value.roster_ready) return {available: false, message: 'The tracker is syncing the Discord roster. Refresh in a moment.'};
  const start = [value.from, value.retained_from, trackedFrom].sort().at(-1);
  return {available: true, start, partial: start > value.from};
}

function renderConnection(coverage) {
  let label = 'Locked';
  let state = '';
  let message = 'Unlock reports to see recorded activity.';
  let coverageState = '';
  if (quarterStart(quarter) > today()) {
    label = 'Upcoming';
    message = `${quarterLabel(quarter)} begins ${dayText(quarterStart(quarter))}, ${quarter.slice(0, 4)}. Its totals start fresh on that date.`;
  } else if (pending) {
    label = 'Loading';
    message = `Loading ${LABELS[role]} for ${quarterLabel(quarter)}…`;
  } else if (report) {
    if (report.collector.connected) {
      label = 'Tracker connected';
      state = 'live';
    } else {
      label = report.collector.enabled ? 'Tracker disconnected' : 'Tracker stopped';
      state = 'warning';
    }
    if (!coverage.available) message = coverage.message;
    else {
      const range = `${dayText(coverage.start)}–${dayText(report.to)}, ${quarter.slice(0, 4)}`;
      message = `${coverage.partial ? 'Partial quarter. ' : ''}Recorded dates ${range}. Updated ${timeText(report.generated_at)}.`;
      if (coverage.partial) coverageState = 'partial';
      if (report.voice_totals_through) message += ` Voice through ${timeText(report.voice_totals_through)}.`;
      if (report.coverage_gaps.length) message += ` ${report.coverage_gaps.length}${report.coverage_gaps_truncated ? '+' : ''} voice gaps excluded.`;
      if (report.collector.missing_roles.length) {
        message += ` Missing Discord roles: ${report.collector.missing_roles.map(key => ROLES[key] ?? key).join(', ')}.`;
      }
    }
  }
  if (problem) {
    label = report ? 'Refresh needed' : 'Unavailable';
    state = 'warning';
    coverageState = 'error';
    message = report ? `${message} ${problem} Showing the last loaded report.` : problem;
  }
  el('connection').textContent = label;
  el('connection').dataset.state = state;
  el('coverage').textContent = message;
  el('coverage').dataset.state = coverageState;
}

function renderRoster() {
  const counts = Object.fromEntries((roster?.roles ?? []).map(entry => [entry.key, entry.current_count]));
  counts.all = roster?.current_count;
  for (const button of el('roleFilters').querySelectorAll('button')) {
    const key = button.dataset.role;
    button.setAttribute('aria-pressed', String(key === role));
    button.querySelector('.role-count').textContent = counts[key] == null ? '—' : number.format(counts[key]);
  }
  el('rosterTotal').textContent = roster ? number.format(roster.current_count) : '—';
  el('roleSummary').innerHTML = Object.entries(ROLES).map(([key, label]) => {
    const count = counts[key];
    const percent = count == null ? 0 : 100 * count / Math.max(1, counts.all);
    return `<div class="roster-line role-${key}"><span>${label}</span>
      <span class="roster-meter" aria-hidden="true"><i style="--fill:${percent}%"></i></span>
      <strong>${count == null ? '—' : number.format(count)}</strong></div>`;
  }).join('');
}

function renderTotals(available) {
  const rows = available ? report.rows : [];
  const totals = rows.reduce((out, row) => ({
    messages: out.messages + row.messages,
    shared: out.shared + row.shared_voice_ms,
    voice: out.voice + row.voice_ms,
    active: out.active + Number(row.active_days > 0),
  }), {messages: 0, shared: 0, voice: 0, active: 0});
  el('peopleTotal').textContent = available ? number.format(rows.length) : '—';
  el('messageTotal').textContent = available ? number.format(totals.messages) : '—';
  el('sharedTotal').textContent = available ? duration(totals.shared) : '—';
  el('voiceTotal').textContent = available ? duration(totals.voice) : '—';
  el('activeCount').textContent = available ? `${number.format(totals.active)} with active days` : 'Active members this quarter';
}

function renderChart() {
  const container = el('chart');
  const coverage = coverageFor(report);
  const key = el('chartMetric').value;
  el('chartMetric').disabled = !coverage.available;
  el('chartRange').textContent = coverage.available ? `${dayText(coverage.start)}–${dayText(report.to)} · Eastern time` : 'Selected quarter';
  if (!coverage.available) {
    container.className = 'chart-empty';
    container.textContent = viewingCode ? 'Daily figures appear when the report is available.' : 'Unlock to see the daily activity chart.';
    return;
  }
  const totals = new Map();
  for (const row of report.daily) totals.set(row.day, (totals.get(row.day) ?? 0) + row[key]);
  const series = [];
  const end = Date.parse(report.to + 'T12:00:00Z');
  for (let ms = Date.parse(coverage.start + 'T12:00:00Z'); ms <= end; ms += 86_400_000) {
    const day = new Date(ms).toISOString().slice(0, 10);
    series.push({day, value: totals.get(day) ?? 0});
  }
  const voice = key === 'shared_voice_ms';
  const units = voice ? 60_000 : 1;
  const peak = Math.max(0, ...series.map(day => day.value));
  const top = Math.max(2, Math.ceil(peak / (units * 2)) * 2) * units;
  const metric = voice ? 'shared voice' : 'messages';
  const bars = series.map(({day, value}) => `<div class="plot-bar${value === 0 ? ' zero' : ''}"
    style="--height:${value / top * 100}%" title="${escapeHtml(`${dayText(day)} · ${voice ? duration(value) : number.format(value)} ${metric}`)}"></div>`).join('');
  container.className = '';
  container.innerHTML = `<div class="plot" role="img" aria-label="Daily ${metric} for ${LABELS[role]}, peak ${escapeHtml(voice ? duration(peak) : number.format(peak))}">
    <div class="plot-ticks" aria-hidden="true"><span>${number.format(top / units)}${voice ? 'm' : ''}</span><span>${number.format(top / units / 2)}</span><span>0</span></div>
    <div class="plot-bars" aria-hidden="true" style="--day-count:${series.length}">${bars}</div>
  </div><div class="plot-days"><span>${dayText(coverage.start)}</span><span>${dayText(report.to)}</span></div>`;
}

function visibleRows() {
  if (!coverageFor(report).available) return [];
  const search = el('personSearch').value.trim().toLocaleLowerCase('en-US');
  const filter = el('activityFilter').value;
  const sort = el('sortPeople').value;
  return report.rows.filter(row => {
    const terms = [row.display_name, row.user_id, ...row.current_roles.map(key => ROLES[key]), ...row.recorded_roles.map(key => ROLES[key])];
    return terms.join(' ').toLocaleLowerCase('en-US').includes(search) &&
      (filter === 'all' || (filter === 'active' ? row.active_days > 0 : row.active_days === 0));
  }).sort((left, right) => {
    const byName = left.display_name.localeCompare(right.display_name);
    if (sort === 'name') return byName;
    if (sort === 'last_activity_at') return (right.last_activity_at ?? '').localeCompare(left.last_activity_at ?? '') || byName;
    return right[sort] - left[sort] || byName;
  });
}

function tags(roles) {
  return roles.filter(key => Object.hasOwn(ROLES, key)).map(key =>
    `<span class="role-tag role-${key}"><span class="role-dot" aria-hidden="true"></span>${ROLES[key]}</span>`).join('');
}

function renderPeople() {
  const available = coverageFor(report).available;
  const rows = visibleRows();
  for (const id of ['personSearch', 'activityFilter', 'sortPeople']) el(id).disabled = !available;
  el('peopleNote').textContent = available ? `${rows.length} of ${report.rows.length} people · ${LABELS[role]}` : 'Quarterly activity and current roles';
  el('peopleTable').hidden = rows.length === 0;
  el('peopleEmpty').hidden = rows.length !== 0;
  el('peopleEmpty').textContent = available
    ? (report.rows.length ? 'No people match these filters.' : 'No members or recorded activity for this role and quarter.')
    : (viewingCode ? 'The roster appears when the report is available.' : 'Unlock reports to view the roster.');
  el('export').disabled = rows.length === 0;
  el('peopleRows').innerHTML = rows.map(row => {
    const initials = row.display_name.trim().split(/\s+/u).slice(0, 2).map(word => Array.from(word)[0] ?? '').join('').toLocaleUpperCase('en-US');
    let roleTags = tags(row.current_roles);
    if (!row.present_in_server) roleTags += '<span class="history-tag">Left server</span>';
    else if (!row.current_roles.length || (role !== 'all' && !row.current_roles.includes(role))) {
      roleTags += '<span class="history-tag">Previous role</span>';
    }
    return `<tr>
      <td><button class="person-button" type="button" data-person="${row.user_id}" aria-haspopup="dialog">
        <span class="initials" aria-hidden="true">${escapeHtml(initials || 'FF')}</span><span class="person-name">${escapeHtml(row.display_name)}</span>
      </button><div class="person-roles">${roleTags}</div></td>
      <td data-label="Messages">${number.format(row.messages)}</td>
      <td data-label="Shared voice" class="value-gold">${escapeHtml(duration(row.shared_voice_ms))}</td>
      <td data-label="Total voice">${escapeHtml(duration(row.voice_ms))}</td>
      <td data-label="Active days">${row.active_days}</td>
      <td data-label="Active weeks">${row.active_weeks}</td>
      <td data-label="Last activity"${row.last_activity_at ? '' : ' class="no-value"'}>${escapeHtml(timeText(row.last_activity_at))}</td>
    </tr>`;
  }).join('');
}

function render() {
  const coverage = coverageFor(report);
  el('scopeTitle').textContent = LABELS[role];
  el('accessPanel').hidden = Boolean(viewingCode);
  el('lock').hidden = !viewingCode;
  el('refresh').disabled = !viewingCode || pending || quarterStart(quarter) > today();
  renderConnection(coverage);
  renderRoster();
  renderTotals(coverage.available);
  renderChart();
  renderPeople();
}

function showPerson(id) {
  const row = report?.rows.find(entry => entry.user_id === id);
  if (!row || !coverageFor(report).available) return;
  el('detailName').textContent = row.display_name;
  el('detailQuarter').textContent = `${quarterLabel(quarter)} · ${LABELS[role]}`;
  const values = [
    ['Messages', number.format(row.messages)], ['Shared voice', duration(row.shared_voice_ms)],
    ['Total voice', duration(row.voice_ms)], ['Active days', row.active_days],
    ['Active weeks', row.active_weeks], ['Text days', row.text_days],
  ];
  const days = report.daily.filter(entry => entry.user_id === id).sort((a, b) => b.day.localeCompare(a.day));
  const history = days.length ? `<table class="detail-table">
    <thead><tr><th scope="col">Date</th><th scope="col">Messages</th><th scope="col">Shared voice</th></tr></thead>
    <tbody>${days.map(day => `<tr><td>${dayText(day.day)}</td><td>${number.format(day.messages)}</td><td>${escapeHtml(duration(day.shared_voice_ms))}</td></tr>`).join('')}</tbody>
  </table>` : '<p class="detail-meta">No daily activity was recorded for this period.</p>';
  el('detailBody').innerHTML = `
    <div class="dialog-roles">${tags(row.current_roles) || '<span class="history-tag">No current tracked role</span>'}</div>
    <p class="detail-meta">Last counted activity ${escapeHtml(timeText(row.last_activity_at))} · ${row.voice_days} shared voice days</p>
    <div class="detail-metrics">${values.map(([label, value]) => `<div class="detail-metric"><span>${label}</span><strong>${escapeHtml(value)}</strong></div>`).join('')}</div>
    <h3>Recorded days</h3>${history}`;
  el('personDetail').showModal();
}

function validateReport(value, wantedQuarter, wantedRole) {
  const numeric = fields => fields.every(field => Number.isFinite(field) && field >= 0);
  if (!value || value.quarter !== wantedQuarter || value.role !== wantedRole ||
      !datePattern.test(value.from) || !datePattern.test(value.to) || !datePattern.test(value.retained_from) ||
      (value.tracking_started_at !== null && !Number.isFinite(Date.parse(value.tracking_started_at))) ||
      !Array.isArray(value.rows) || !Array.isArray(value.daily) || !Array.isArray(value.roles) ||
      !Array.isArray(value.coverage_gaps) || !Array.isArray(value.collector?.missing_roles) ||
      !numeric([value.current_count]) || !value.roles.every(entry => Object.hasOwn(ROLES, entry.key) && numeric([entry.current_count]))) {
    throw new Error('The tracker returned an unexpected report.');
  }
  const ids = new Set();
  for (const row of value.rows) {
    if (!/^\d{16,22}$/.test(row.user_id) || ids.has(row.user_id) || typeof row.display_name !== 'string' ||
        !Array.isArray(row.current_roles) || !Array.isArray(row.recorded_roles) || !numeric(activityFields.map(key => row[key]))) {
      throw new Error('The tracker returned an invalid member record.');
    }
    ids.add(row.user_id);
  }
  for (const day of value.daily) {
    if (!ids.has(day.user_id) || !datePattern.test(day.day) || day.day < value.from || day.day > value.to ||
        !numeric([day.messages, day.shared_voice_ms, day.voice_ms])) throw new Error('The tracker returned invalid daily figures.');
  }
  return value;
}

async function loadReport() {
  request?.abort();
  request = null;
  pending = false;
  problem = '';
  if (report && (report.quarter !== quarter || report.role !== role)) report = null;
  if (!viewingCode || quarterStart(quarter) > today()) { render(); return; }

  const controller = new AbortController();
  const wantedQuarter = quarter;
  const wantedRole = role;
  request = controller;
  pending = true;
  render();
  const timeout = setTimeout(() => controller.abort(), 15_000);
  try {
    const query = new URLSearchParams({quarter: wantedQuarter, role: wantedRole});
    const response = await fetch(`${API_URL}?${query}`, {
      headers: {Authorization: `Bearer ${viewingCode}`}, signal: controller.signal,
      credentials: 'omit', redirect: 'error', cache: 'no-store',
    });
    if (request !== controller) return;
    if (response.status === 401) {
      viewingCode = ''; report = null; roster = null;
      clearPerson();
      throw new Error('That viewing code was not accepted. Use the same code as CreatorDashboard.');
    }
    if (response.status === 404) throw new Error('Install the Team Dashboard update on your Cloudflare tracker, then refresh.');
    if (response.status === 503) throw new Error('The tracker could not return a report. Check its deployment and CREATOR_DASHBOARD_KEY secret.');
    if (!response.ok) throw new Error(`The tracker returned an error (${response.status}).`);
    const nextReport = validateReport(await response.json(), wantedQuarter, wantedRole);
    if (request !== controller) return;
    report = nextReport;
    roster = report.roster_ready ? report : null;
  } catch (error) {
    if (request !== controller) return;
    if (error.name === 'AbortError') problem = 'The tracker took too long to respond. Try Refresh.';
    else if (error instanceof TypeError) problem = 'The team report could not connect. Install the Team Dashboard update on your Cloudflare tracker, then refresh.';
    else problem = error.message;
  } finally {
    clearTimeout(timeout);
    if (request === controller) {
      request = null;
      pending = false;
      render();
    }
  }
}

function lockReports() {
  request?.abort();
  request = null;
  viewingCode = ''; report = null; roster = null; pending = false; problem = '';
  el('viewingCode').value = '';
  el('personSearch').value = '';
  clearPerson();
  render();
}

function clearPerson() {
  el('detailName').textContent = '';
  el('detailBody').innerHTML = '';
  if (el('personDetail').open) el('personDetail').close();
}

function csvCell(value) {
  let text = String(value ?? '');
  if (/^[\s\uFEFF]*[=+@-]/u.test(text) || /^[\t\r\n]/.test(text) || /^\d{16,22}$/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}

function exportReport() {
  const rows = visibleRows();
  if (!rows.length) return;
  const coverage = coverageFor(report);
  const header = ['quarter', 'role_filter', 'discord_user_id', 'name', 'current_roles', 'roles_at_activity', 'present_in_server',
    'messages', 'shared_voice_minutes', 'total_voice_minutes', 'active_days', 'active_weeks', 'text_days', 'shared_voice_days',
    'last_activity_in_quarter', 'recorded_from', 'recorded_through', 'partial_quarter', 'voice_gap_count', 'generated_at'];
  const data = rows.map(row => [quarter, LABELS[role], row.user_id, row.display_name,
    row.current_roles.map(key => ROLES[key]).join(' / '), row.recorded_roles.map(key => ROLES[key]).join(' / '), row.present_in_server,
    row.messages, (row.shared_voice_ms / 60_000).toFixed(2), (row.voice_ms / 60_000).toFixed(2),
    row.active_days, row.active_weeks, row.text_days, row.voice_days, row.last_activity_at,
    coverage.start, report.to, coverage.partial, report.coverage_gaps.length, report.generated_at]);
  const csv = [header, ...data].map(row => row.map(csvCell).join(',')).join('\r\n');
  const href = URL.createObjectURL(new Blob(['\uFEFF', csv], {type: 'text/csv;charset=utf-8'}));
  const link = document.createElement('a');
  link.href = href;
  link.download = `FFG-Team-${quarter}-${role}.csv`;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(href), 1000);
}

function checkQuarter() {
  const next = calendarQuarter(today());
  if (next === currentQuarter) return false;
  const followsCurrent = quarter === quarterId(currentQuarter);
  currentQuarter = next;
  if (followsCurrent) quarter = quarterId(next);
  setQuarterOptions();
  return followsCurrent;
}

populateRoles();
setQuarterOptions();
el('roleFilters').addEventListener('click', event => {
  const button = event.target.closest('button[data-role]');
  if (!button || button.dataset.role === role) return;
  role = button.dataset.role;
  loadReport();
});
el('quarter').addEventListener('change', event => { quarter = event.target.value; loadReport(); });
el('unlockForm').addEventListener('submit', event => {
  event.preventDefault();
  const entered = el('viewingCode').value.trim();
  if (entered.length < 32) {
    problem = 'Enter the full creator viewing code.';
    render();
    return;
  }
  viewingCode = entered;
  el('viewingCode').value = '';
  loadReport();
});
el('lock').addEventListener('click', () => { lockReports(); el('viewingCode').focus(); });
el('refresh').addEventListener('click', () => { checkQuarter(); loadReport(); });
el('export').addEventListener('click', exportReport);
el('chartMetric').addEventListener('change', renderChart);
el('personSearch').addEventListener('input', renderPeople);
el('activityFilter').addEventListener('change', renderPeople);
el('sortPeople').addEventListener('change', renderPeople);
el('peopleRows').addEventListener('click', event => {
  const button = event.target.closest('button[data-person]');
  if (button) showPerson(button.dataset.person);
});
window.addEventListener('pagehide', lockReports);
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && (checkQuarter() || viewingCode)) loadReport();
});
setInterval(() => { if (!document.hidden && checkQuarter()) loadReport(); }, 60_000);
setInterval(() => { if (!document.hidden && viewingCode && !pending) { checkQuarter(); loadReport(); } }, 300_000);
render();
