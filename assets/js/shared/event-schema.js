/*
 * Shared event metadata, version 1.
 * Keep this block identical in communityapi.txt and siterender.txt.
 * Only search metadata uses these helpers; calendar display/filtering is unchanged.
 */
function buildFaithForgeEventSchema(event) {
  const pageUrl = "https://faithforgegaming.com/Events/";
  const schemaUrl = "https://schema.org/";
  const text = value => String(value ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;/gi, "'")
    .replace(/\s+/g, " ").trim();
  const httpUrl = value => {
    if (typeof value !== "string" || !value.trim()) return null;
    try {
      const url = new URL(value);
      return ["https:", "http:"].includes(url.protocol) ? url.href : null;
    } catch { return null; }
  };

  const name = text(event.title) || "FaithForge Gaming Event";
  const start = event.startDateTime || event.start || event.startDate;
  let end = event.endDateTime || event.end || event.endDate;
  // Google Calendar's all-day end date is exclusive; schema dates are inclusive.
  if (event.allDay && /^\d{4}-\d{2}-\d{2}$/.test(end || "") && end > start) {
    const endTime = Date.parse(end + "T00:00:00Z");
    if (Number.isFinite(endTime)) end = new Date(endTime - 86400000).toISOString().slice(0, 10);
  }
  const eventUrl = httpUrl(event.eventUrl) || pageUrl;
  // Stable across Home, Events, and filtered lists, even without a calendar ID.
  const identity = event.eventId || [eventUrl, start || "", name].join("|");
  const result = {
    "@type": "Event",
    "@id": pageUrl + "#" + encodeURIComponent(identity),
    name,
    description: text(event.descriptionHtml || event.description)
      .replace(/https?:\/\/\S+/gi, "").replace(/\s+/g, " ").trim().slice(0, 500)
      || `${name}, hosted by FaithForge Gaming.`,
    ...(start ? { startDate: start } : {}),
    ...(end ? { endDate: end } : {}),
    organizer: {
      "@type": "Organization",
      "@id": "https://faithforgegaming.com/#organization",
      name: "FaithForge Gaming",
      url: "https://faithforgegaming.com/"
    },
    url: eventUrl
  };

  const statuses = {
    confirmed: "EventScheduled", scheduled: "EventScheduled",
    cancelled: "EventCancelled", canceled: "EventCancelled",
    postponed: "EventPostponed", rescheduled: "EventRescheduled",
    movedonline: "EventMovedOnline"
  };
  const suppliedStatus = String(event.eventStatus || event.status || "confirmed")
    .replace(/^https?:\/\/schema\.org\//, "").replace(/^Event/, "").toLowerCase();
  if (statuses[suppliedStatus]) result.eventStatus = schemaUrl + statuses[suppliedStatus];
  const previousStart = event.previousStartDate;
  if (previousStart && suppliedStatus === "rescheduled") result.previousStartDate = previousStart;

  const location = text(event.location);
  const locationUrls = (location.match(/https?:\/\/[^\s<>|]+/gi) || [])
    .map(value => httpUrl(value.replace(/[),;.!]+$/, ""))).filter(Boolean);
  const isOnlineUrl = value => {
    try {
      return /(^|\.)(discord\.gg|discord\.com|twitch\.tv|youtube\.com|youtu\.be|zoom\.us|meet\.google\.com|teams\.microsoft\.com|rumble\.com)$/.test(new URL(value).hostname);
    } catch { return false; }
  };
  const onlineUrl = httpUrl(event.hangoutLink) || locationUrls.find(isOnlineUrl)
    || (isOnlineUrl(eventUrl) ? eventUrl : null);
  const onlineLabel = /\b(discord|twitch|youtube|zoom|online|virtual|livestream)\b/i.test(location);
  const prefix = location.match(/^(online|virtual|in[ -]person|offline|hybrid)\s*:\s*/i);
  const modeValue = String(event.eventAttendanceMode || event.attendanceMode || prefix?.[1] || "")
    .replace(/^https?:\/\/schema\.org\//, "").replace(/EventAttendanceMode$/, "").toLowerCase();
  const explicitMode = {
    online: "Online", virtual: "Online", offline: "Offline",
    "in-person": "Offline", "in person": "Offline", mixed: "Mixed", hybrid: "Mixed"
  }[modeValue];
  const mode = explicitMode || ((onlineUrl || onlineLabel) ? "Online" : null);
  const locationName = location.replace(/^(online|virtual|in[ -]person|offline|hybrid)\s*:\s*/i, "").trim();
  const virtualLocation = {
    "@type": "VirtualLocation",
    url: onlineUrl || locationUrls[0]
      || (/\bdiscord\b/i.test(location) ? "https://discord.gg/bAQrudk5a9" : eventUrl)
  };

  if (mode === "Online") {
    result.eventAttendanceMode = schemaUrl + "OnlineEventAttendanceMode";
    result.location = virtualLocation;
  } else if (mode === "Offline") {
    result.eventAttendanceMode = schemaUrl + "OfflineEventAttendanceMode";
    if (locationName) result.location = { "@type": "Place", name: locationName };
  } else if (mode === "Mixed") {
    result.eventAttendanceMode = schemaUrl + "MixedEventAttendanceMode";
    const placeName = locationName.split("|")[0].trim();
    result.location = [
      ...(placeName && !httpUrl(placeName) ? [{ "@type": "Place", name: placeName }] : []),
      virtualLocation
    ];
  } else if (location) {
    // A community/venue name alone does not establish a physical address or mode.
    result.location = location;
  }
  return result;
}

function mergeFaithForgeEventGraph(structuredData, events) {
  const eventNodes = events.map(buildFaithForgeEventSchema);
  const graph = Array.isArray(structuredData?.["@graph"]) ? structuredData["@graph"] : [];
  return {
    "@context": "https://schema.org",
    "@graph": [
      ...graph.filter(node => node["@type"] !== "Event").map(node =>
        node["@id"] === "https://faithforgegaming.com/Events/#webpage"
          ? { ...node, mainEntity: eventNodes.map(event => ({ "@id": event["@id"] })) }
          : node
      ),
      ...eventNodes
    ]
  };
}
/* End shared event metadata. */
