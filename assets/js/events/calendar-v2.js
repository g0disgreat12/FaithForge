const COMMUNITY_API =
    "https://faithforge-community-api.faithforgegaming.workers.dev/community";

  const SERVER_RENDERED_EVENTS_URL =
    "https://faithforge-community-api.faithforgegaming.workers.dev/events-html";

  const SERVER_RENDERED_EVENTS_SCHEMA_URL =
    "https://faithforge-community-api.faithforgegaming.workers.dev/events-schema";

  const EVENTS_CACHE_KEY =
    "faithforge_events_page_cache_v4";

  const EVENTS_CACHE_DURATION =
    5 * 60 * 1000;

  const MAX_EVENTS =
    24;

  const EVENT_EXPIRY_GRACE_MS =
    5 * 60 * 1000;

  const DISCORD_URL =
    "https://discord.gg/bAQrudk5a9";

  const DEFAULT_CALENDAR_URL =
    "https://calendar.google.com/calendar/embed?src=3ca24c7d932a2bdb0aa72b09710f915c6e3ca12bd13d30235b35f41ded97c522%40group.calendar.google.com&ctz=America%2FNew_York";

  let allEvents = [];
  let activeEventFilter = "all";
  let activeSearchTerm = "";
  let nextEventCountdownTimer = null;

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function stripHtml(value) {
    return String(value ?? "")
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")
      .replace(/\s+/g, " ")
      .trim();
  }

  function truncateText(
    value,
    maximumLength = 220
  ) {
    const text =
      stripHtml(value);

    if (
      text.length <=
      maximumLength
    ) {
      return text;
    }

    return (
      `${text
        .slice(0, maximumLength)
        .trim()}…`
    );
  }

  function safeExternalUrl(
    value,
    fallback = "#"
  ) {
    try {
      const url =
        new URL(
          value,
          window.location.origin
        );

      if (
        url.protocol === "https:" ||
        url.protocol === "http:"
      ) {
        return url.href;
      }

      return fallback;
    } catch {
      return fallback;
    }
  }

  function formatNumber(value) {
    const number =
      Number(value);

    return Number.isFinite(number)
      ? new Intl.NumberFormat(
          "en-US"
        ).format(number)
      : "—";
  }

  function getEventStartValue(event) {
    return (
      event?.startDateTime ||
      event?.start ||
      event?.startDate ||
      null
    );
  }

  function getEventEndValue(event) {
    return (
      event?.endDateTime ||
      event?.end ||
      event?.endDate ||
      null
    );
  }

  function getEventDate(event) {
    const rawStart =
      getEventStartValue(event);

    if (!rawStart) {
      return null;
    }

    const value =
      event?.allDay &&
      /^\d{4}-\d{2}-\d{2}$/.test(
        rawStart
      )
        ? `${rawStart}T12:00:00`
        : rawStart;

    const date =
      new Date(value);

    return Number.isNaN(
      date.getTime()
    )
      ? null
      : date;
  }

  function getEventEndDate(event) {
    const rawEnd =
      getEventEndValue(event);

    if (!rawEnd) {
      return null;
    }

    const value =
      event?.allDay &&
      /^\d{4}-\d{2}-\d{2}$/.test(
        rawEnd
      )
        ? `${rawEnd}T12:00:00`
        : rawEnd;

    const date =
      new Date(value);

    return Number.isNaN(
      date.getTime()
    )
      ? null
      : date;
  }

  function prepareUpcomingEvents(
    events,
    maximum
  ) {
    const now =
      Date.now();

    return (
      Array.isArray(events)
        ? events
        : []
    )
      .filter(event => {
        const start =
          getEventDate(event);

        const end =
          getEventEndDate(event);

        if (!start) {
          return false;
        }

        /*
         * Keep an event while it is upcoming or currently happening.
         * The grace period prevents minor clock differences between
         * Cloudflare, the API, and the browser from hiding an event early.
         */
        const comparisonTime =
          end?.getTime() ||
          start.getTime();

        return (
          comparisonTime >=
          now -
            EVENT_EXPIRY_GRACE_MS
        );
      })
      .sort(
        (left, right) =>
          getEventDate(left) -
          getEventDate(right)
      )
      .slice(
        0,
        maximum
      );
  }

  function hasServerRenderedEvents() {
    const eventsMain =
      document.getElementById(
        "eventsMain"
      );

    return (
      eventsMain?.dataset
        .faithforgeServerRender ===
        "events-complete" &&
      Boolean(
        document.querySelector(
          "#eventsGrid .event-card"
        )
      )
    );
  }

  function formatEventDateParts(event) {
    const date =
      getEventDate(event);

    if (!date) {
      return {
        month: "TBD",
        day: "—",
        weekday: "Date TBD"
      };
    }

    return {
      month:
        new Intl.DateTimeFormat(
          "en-US",
          {
            month: "short",
            timeZone:
              "America/New_York"
          }
        ).format(date),

      day:
        new Intl.DateTimeFormat(
          "en-US",
          {
            day: "numeric",
            timeZone:
              "America/New_York"
          }
        ).format(date),

      weekday:
        new Intl.DateTimeFormat(
          "en-US",
          {
            weekday: "short",
            timeZone:
              "America/New_York"
          }
        ).format(date)
    };
  }

  function formatEventTime(event) {
    const startDate =
      getEventDate(event);

    if (!startDate) {
      return (
        "Date and time to be announced"
      );
    }

    if (event?.allDay) {
      return new Intl.DateTimeFormat(
        "en-US",
        {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
          timeZone:
            "America/New_York"
        }
      ).format(startDate);
    }

    const endDate =
      getEventEndDate(event);

    const dateText =
      new Intl.DateTimeFormat(
        "en-US",
        {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
          timeZone:
            "America/New_York"
        }
      ).format(startDate);

    const startTime =
      new Intl.DateTimeFormat(
        "en-US",
        {
          hour: "numeric",
          minute: "2-digit",
          timeZone:
            "America/New_York"
        }
      ).format(startDate);

    if (!endDate) {
      return (
        `${dateText} • ${startTime} ET`
      );
    }

    const sameDate =
      new Intl.DateTimeFormat(
        "en-CA",
        {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          timeZone:
            "America/New_York"
        }
      ).format(startDate) ===
      new Intl.DateTimeFormat(
        "en-CA",
        {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          timeZone:
            "America/New_York"
        }
      ).format(endDate);

    if (!sameDate) {
      return (
        `${dateText} • ${startTime} ET`
      );
    }

    const endTime =
      new Intl.DateTimeFormat(
        "en-US",
        {
          hour: "numeric",
          minute: "2-digit",
          timeZone:
            "America/New_York"
        }
      ).format(endDate);

    return (
      `${dateText} • ` +
      `${startTime}–${endTime} ET`
    );
  }

  function formatApiUpdateDate(value) {
    if (!value) {
      return "";
    }

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "";
    }

    return new Intl.DateTimeFormat(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        timeZone:
          "America/New_York",
        timeZoneName: "short"
      }
    ).format(date);
  }

  /*
   * Event categories are determined ONLY from event.title.
   * Description and location do not affect categorization.
   * The first matching category wins.
   */

  function getEventCategory(event) {
    const eventTitle =
      String(event?.title || "")
        .trim()
        .toLowerCase();

    /*
     * Bible & Faith — Purple
     */
    if (
      /bible|scripture|devotion|prayer|worship|faith study|bible study|church|study/i.test(
        eventTitle
      )
    ) {
      return {
        key: "faith",
        label: "Bible & Faith"
      };
    }

    /*
     * Raid Train — Orange
     */
    if (
      /raid\s*train|raidtrain/i.test(
        eventTitle
      )
    ) {
      return {
        key: "raid-train",
        label: "Raid Train"
      };
    }

    /*
     * Podcast — Blue
     */
    if (
      /podcast/i.test(
        eventTitle
      )
    ) {
      return {
        key: "podcast",
        label: "Podcast"
      };
    }

    /*
     * Gaming — Green
     */
    if (
      /game night|gaming night|gaming|game event/i.test(
        eventTitle
      )
    ) {
      return {
        key: "gaming",
        label: "Gaming"
      };
    }

    /*
     * Tournament — Gold
     */
    if (
      /tournament|championship|competition|contest/i.test(
        eventTitle
      )
    ) {
      return {
        key: "tournament",
        label: "Tournament"
      };
    }

    /*
     * D&D — Pink
     */
    if (
      /d\s*&\s*d|\bdnd\b/i.test(
        eventTitle
      )
    ) {
      return {
        key: "dnd",
        label: "D&D"
      };
    }

    /*
     * Partnership — Light Blue
     */
    if (
      /partnership|blessing boat|backcountryhope|partner/i.test(
        eventTitle
      )
    ) {
      return {
        key: "partnership",
        label: "Partnership"
      };
    }

    /*
     * Live — Red
     */
    if (
      /\brumble\b|\bstreamer\b|\bstreaming\b|\blivestream\b|\blive stream\b|\bcreator\b|\bstream\b|\btwitch\b|\byoutube\b/i.test(
        eventTitle
      )
    ) {
      return {
        key: "live",
        label: "Live"
      };
    }

    /*
     * Men's/Women's — Tan
     */
    if (
      /\bmen\b|\bwomen\b|\bmens\b|\bmen's\b|\bwomens\b|\bwomen's\b|\bladies\b|\bguys\b/i.test(
        eventTitle
      )
    ) {
      return {
        key: "men-women",
        label: "Men's/Women's"
      };
    }

    /*
     * Community — Gray
     */
    return {
      key: "community",
      label: "Community"
    };
  }

  function getCachedEventsData() {
    try {
      const cached =
        JSON.parse(
          localStorage.getItem(
            EVENTS_CACHE_KEY
          )
        );

      if (
        !cached ||
        !cached.savedAt ||
        !cached.data
      ) {
        return null;
      }

      if (
        Date.now() -
        cached.savedAt >
        EVENTS_CACHE_DURATION
      ) {
        return null;
      }

      return cached.data;
    } catch {
      return null;
    }
  }

  function saveEventsData(data) {
    try {
      localStorage.setItem(
        EVENTS_CACHE_KEY,
        JSON.stringify({
          savedAt: Date.now(),
          data
        })
      );
    } catch {
      /*
       * Local storage may be unavailable.
       */
    }
  }

  function renderNextEvent(event) {
    const container =
      document.getElementById(
        "nextEventContainer"
      );

    clearInterval(
      nextEventCountdownTimer
    );

    if (!event) {
      container.innerHTML = `
        <div class="next-event-empty">
          No upcoming events are currently listed.
          Join the Discord for new event announcements and reminders.
        </div>
      `;

      return;
    }

    const dateParts =
      formatEventDateParts(event);

    const category =
      getEventCategory(event);

    const eventUrl =
      safeExternalUrl(
        event.eventUrl,
        "/Events/"
      );

    const location =
      stripHtml(event.location) ||
      "Online through the FaithForge Gaming community";

    const description =
      truncateText(
        event.description,
        400
      ) ||
      "Join FaithForge Gaming for this upcoming community event.";

    container.innerHTML = `
      <article class="next-event-card">
        <div class="next-event-date">
          <span class="next-event-month">
            ${escapeHtml(dateParts.month)}
          </span>

          <span class="next-event-day">
            ${escapeHtml(dateParts.day)}
          </span>

          <span class="next-event-weekday">
            ${escapeHtml(dateParts.weekday)}
          </span>
        </div>

        <div class="next-event-content">
          <span
            class="next-event-label ${escapeHtml(category.key)}"
          >
            Next Event • ${escapeHtml(category.label)}
          </span>

          <h2 id="nextEventHeading">
            ${escapeHtml(
              event.title ||
              "FaithForge Gaming Event"
            )}
          </h2>

          <p class="next-event-time">
            ${escapeHtml(
              formatEventTime(event)
            )}
          </p>

          <p class="next-event-location">
            ${escapeHtml(location)}
          </p>

          <p class="next-event-description">
            ${escapeHtml(description)}
          </p>

          <div
            class="next-event-countdown"
            id="nextEventCountdown"
            aria-live="polite"
          ></div>

          <div class="next-event-actions">
            <a
              class="event-action-button"
              href="${escapeHtml(eventUrl)}"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Calendar Event
            </a>

            <a
              class="event-action-button secondary"
              href="${escapeHtml(DISCORD_URL)}"
              target="_blank"
              rel="noopener noreferrer"
            >
              Join the Discord
            </a>
          </div>
        </div>
      </article>
    `;

    startNextEventCountdown(event);
  }

  function startNextEventCountdown(event) {
    const countdownElement =
      document.getElementById(
        "nextEventCountdown"
      );

    const startDate =
      getEventDate(event);

    const endDate =
      getEventEndDate(event);

    if (
      !countdownElement ||
      !startDate
    ) {
      return;
    }

    function updateCountdown() {
      const now =
        Date.now();

      const startTime =
        startDate.getTime();

      const endTime =
        endDate?.getTime() ||
        null;

      if (
        now >= startTime &&
        (
          !endTime ||
          now < endTime
        )
      ) {
        countdownElement.textContent =
          "This event is happening now.";

        return;
      }

      if (
        endTime &&
        now >= endTime
      ) {
        countdownElement.textContent =
          "This event has ended.";

        return;
      }

      const difference =
        startTime - now;

      if (difference <= 0) {
        countdownElement.textContent =
          "Starting soon.";

        return;
      }

      const totalMinutes =
        Math.floor(
          difference / 60000
        );

      const days =
        Math.floor(
          totalMinutes / 1440
        );

      const hours =
        Math.floor(
          (
            totalMinutes %
            1440
          ) / 60
        );

      const minutes =
        totalMinutes % 60;

      const pieces = [];

      if (days > 0) {
        pieces.push(
          `${days} ${
            days === 1
              ? "day"
              : "days"
          }`
        );
      }

      if (
        hours > 0 ||
        days > 0
      ) {
        pieces.push(
          `${hours} ${
            hours === 1
              ? "hour"
              : "hours"
          }`
        );
      }

      if (days === 0) {
        pieces.push(
          `${minutes} ${
            minutes === 1
              ? "minute"
              : "minutes"
          }`
        );
      }

      countdownElement.textContent =
        `Starts in ${pieces.join(", ")}.`;
    }

    updateCountdown();

    nextEventCountdownTimer =
      setInterval(
        updateCountdown,
        30000
      );
  }

  /*
   * The category filter uses getEventCategory(), which only
   * reads event.title.
   *
   * The normal text search below still searches the event title,
   * description, location, and category label.
   */

  function eventMatchesFilters(event) {
    const category =
      getEventCategory(event);

    const matchesCategory =
      activeEventFilter === "all" ||
      category.key ===
      activeEventFilter;

    if (!matchesCategory) {
      return false;
    }

    if (!activeSearchTerm) {
      return true;
    }

    const searchableText =
      [
        event.title,
        event.description,
        event.location,
        category.label
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

    return searchableText.includes(
      activeSearchTerm
    );
  }

  function renderEventCards() {
    const grid =
      document.getElementById(
        "eventsGrid"
      );

    const resultCount =
      document.getElementById(
        "eventsResultCount"
      );

    const filteredEvents =
      allEvents.filter(
        eventMatchesFilters
      );

    resultCount.textContent =
      `${formatNumber(
        filteredEvents.length
      )} ${
        filteredEvents.length === 1
          ? "event"
          : "events"
      } shown`;

    if (!filteredEvents.length) {
      grid.innerHTML = `
        <div class="events-empty-state">
          No events matched the selected category or search.
          Try clearing the search or selecting All Events.
        </div>
      `;

      return;
    }

    grid.innerHTML =
      filteredEvents
        .map(event => {
          const dateParts =
            formatEventDateParts(event);

          const category =
            getEventCategory(event);

          const eventUrl =
            safeExternalUrl(
              event.eventUrl,
              "/Events/"
            );

          const location =
            stripHtml(
              event.location
            ) ||
            "Online through FaithForge Gaming";

          const description =
            truncateText(
              event.description,
              230
            ) ||
            "Join FaithForge Gaming for this upcoming community event.";

          return `
            <article class="event-card">
              <div class="event-card-top">
                <div class="event-card-date">
                  <span class="event-card-month">
                    ${escapeHtml(dateParts.month)}
                  </span>

                  <span class="event-card-day">
                    ${escapeHtml(dateParts.day)}
                  </span>

                  <span class="event-card-weekday">
                    ${escapeHtml(dateParts.weekday)}
                  </span>
                </div>

                <div>
                  <span
                    class="event-category ${escapeHtml(category.key)}"
                  >
                    ${escapeHtml(category.label)}
                  </span>

                  <h3>
                    ${escapeHtml(
                      event.title ||
                      "FaithForge Gaming Event"
                    )}
                  </h3>

                  <p class="event-card-time">
                    ${escapeHtml(
                      formatEventTime(event)
                    )}
                  </p>

                  <p class="event-card-location">
                    ${escapeHtml(location)}
                  </p>
                </div>
              </div>

              <p class="event-card-description">
                ${escapeHtml(description)}
              </p>

              <div class="event-card-actions">
                <a
                  class="event-action-button"
                  href="${escapeHtml(eventUrl)}"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Details
                </a>

                <a
                  class="event-action-button secondary"
                  href="${escapeHtml(DISCORD_URL)}"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Join Discord
                </a>
              </div>
            </article>
          `;
        })
        .join("");
  }

  function updateEventStructuredData(events) {
    if (typeof buildFaithForgeEventSchema !== "function") return;
    const eventGraph = events.slice(0, MAX_EVENTS).map(buildFaithForgeEventSchema);

    let schema =
      document.getElementById(
        "serverEventsSchema"
      );

    if (!schema) {
      schema =
        document.createElement(
          "script"
        );

      schema.type =
        "application/ld+json";

      schema.id =
        "serverEventsSchema";

      document.head.appendChild(
        schema
      );
    }

    schema.textContent =
      JSON.stringify({
        "@context":
          "https://schema.org",

        "@graph":
          eventGraph
      });
  }

  function displayEventsData(data) {
    const calendar =
      data?.calendar || {};

    const rawEvents =
      Array.isArray(
        calendar.upcomingEvents
      )
        ? calendar.upcomingEvents
        : [];

    allEvents =
      prepareUpcomingEvents(
        rawEvents,
        MAX_EVENTS
      );

    document.getElementById(
      "eventsLoadedCount"
    ).textContent =
      formatNumber(
        allEvents.length
      );

    const fullCalendarButton =
      document.getElementById(
        "openFullCalendarButton"
      );

    fullCalendarButton.href =
      safeExternalUrl(
        calendar.calendarUrl,
        DEFAULT_CALENDAR_URL
      );

    renderNextEvent(
      allEvents[0] ||
      null
    );

    renderEventCards();

    updateEventStructuredData(
      allEvents
    );

    const updateStatus =
      document.getElementById(
        "eventsUpdateStatus"
      );

    if (data.updatedAt) {
      updateStatus.textContent =
        "Calendar information updates automatically every hour. " +
        `Last checked ${formatApiUpdateDate(
          data.updatedAt
        )}.`;
    } else {
      updateStatus.textContent =
        "Calendar information updates automatically every hour.";
    }
  }

  function displayEventsError(error) {
    console.error(
      "FaithForge events API error:",
      error
    );

    document.getElementById(
      "eventsLoadedCount"
    ).textContent =
      "—";

    document.getElementById(
      "eventsResultCount"
    ).textContent =
      "Events unavailable";

    document.getElementById(
      "nextEventContainer"
    ).innerHTML = `
      <div class="next-event-empty">
        The next event could not be loaded right now.
        Open the full Google Calendar or join Discord for current announcements.
      </div>
    `;

    document.getElementById(
      "eventsGrid"
    ).innerHTML = `
      <div class="events-error-state">
        We could not reach the FaithForge calendar feed.
        Please try again shortly or use the Open Full Calendar button.
      </div>
    `;

    document.getElementById(
      "eventsUpdateStatus"
    ).textContent =
      "The live calendar feed is temporarily unavailable.";
  }

  async function loadFaithForgeEvents() {
    const cachedData =
      getCachedEventsData();

    if (cachedData) {
      displayEventsData(
        cachedData
      );
    }

    try {
      const response =
        await fetch(
          COMMUNITY_API,
          {
            cache: "no-store"
          }
        );

      const data =
        await response.json();

      if (
        !response.ok ||
        data.success === false
      ) {
        throw new Error(
          data.error ||
          data.message ||
          "Unable to load the FaithForge calendar."
        );
      }

      saveEventsData(data);

      displayEventsData(data);
    } catch (error) {
      if (
        !cachedData &&
        !hasServerRenderedEvents()
      ) {
        displayEventsError(
          error
        );
      } else {
        console.error(
          "Fresh events request failed; existing event content remains visible:",
          error
        );
      }
    }
  }

  const searchInput =
    document.getElementById(
      "eventsSearchInput"
    );

  const clearButton =
    document.getElementById(
      "eventsClearButton"
    );

  searchInput.addEventListener(
    "input",
    event => {
      activeSearchTerm =
        String(
          event.target.value ||
          ""
        )
          .trim()
          .toLowerCase();

      renderEventCards();
    }
  );

  clearButton.addEventListener(
    "click",
    () => {
      searchInput.value =
        "";

      activeSearchTerm =
        "";

      activeEventFilter =
        "all";

      document
        .querySelectorAll(
          ".events-filter-button"
        )
        .forEach(button => {
          button.classList.toggle(
            "active",
            button.dataset.filter ===
            "all"
          );
        });

      renderEventCards();

      searchInput.focus();
    }
  );

  document
    .querySelectorAll(
      ".events-filter-button"
    )
    .forEach(button => {
      button.addEventListener(
        "click",
        () => {
          activeEventFilter =
            button.dataset.filter ||
            "all";

          document
            .querySelectorAll(
              ".events-filter-button"
            )
            .forEach(
              otherButton => {
                otherButton.classList.toggle(
                  "active",
                  otherButton ===
                  button
                );
              }
            );

          renderEventCards();
        }
      );
    });

  document.addEventListener(
    "DOMContentLoaded",
    loadFaithForgeEvents
  );
