(() => {
  const BSB_API_BASE =
    "https://bible.helloao.org/api/BSB";

  const BOOKS = [
    ["GEN", "Genesis", ["genesis", "gen"]],
    ["EXO", "Exodus", ["exodus", "exod", "exo"]],
    ["LEV", "Leviticus", ["leviticus", "lev"]],
    ["NUM", "Numbers", ["numbers", "num"]],
    ["DEU", "Deuteronomy", ["deuteronomy", "deut", "deu"]],
    ["JOS", "Joshua", ["joshua", "josh", "jos"]],
    ["JDG", "Judges", ["judges", "judg", "jdg"]],
    ["RUT", "Ruth", ["ruth", "rut"]],
    ["1SA", "1 Samuel", ["1 samuel", "1samuel", "1 sam", "1sam"]],
    ["2SA", "2 Samuel", ["2 samuel", "2samuel", "2 sam", "2sam"]],
    ["1KI", "1 Kings", ["1 kings", "1kings", "1 kgs", "1kgs"]],
    ["2KI", "2 Kings", ["2 kings", "2kings", "2 kgs", "2kgs"]],
    ["1CH", "1 Chronicles", ["1 chronicles", "1chronicles", "1 chron", "1chron", "1 chr", "1chr"]],
    ["2CH", "2 Chronicles", ["2 chronicles", "2chronicles", "2 chron", "2chron", "2 chr", "2chr"]],
    ["EZR", "Ezra", ["ezra", "ezr"]],
    ["NEH", "Nehemiah", ["nehemiah", "neh"]],
    ["EST", "Esther", ["esther", "est"]],
    ["JOB", "Job", ["job"]],
    ["PSA", "Psalm", ["psalms", "psalm", "ps", "psa"]],
    ["PRO", "Proverbs", ["proverbs", "prov", "pro"]],
    ["ECC", "Ecclesiastes", ["ecclesiastes", "eccl", "ecc"]],
    ["SNG", "Song of Songs", ["song of songs", "song of solomon", "song", "sos", "sng"]],
    ["ISA", "Isaiah", ["isaiah", "isa"]],
    ["JER", "Jeremiah", ["jeremiah", "jer"]],
    ["LAM", "Lamentations", ["lamentations", "lam"]],
    ["EZK", "Ezekiel", ["ezekiel", "ezek", "ezk"]],
    ["DAN", "Daniel", ["daniel", "dan"]],
    ["HOS", "Hosea", ["hosea", "hos"]],
    ["JOL", "Joel", ["joel", "jol"]],
    ["AMO", "Amos", ["amos", "amo"]],
    ["OBA", "Obadiah", ["obadiah", "obad", "oba"]],
    ["JON", "Jonah", ["jonah", "jon"]],
    ["MIC", "Micah", ["micah", "mic"]],
    ["NAM", "Nahum", ["nahum", "nah", "nam"]],
    ["HAB", "Habakkuk", ["habakkuk", "hab"]],
    ["ZEP", "Zephaniah", ["zephaniah", "zeph", "zep"]],
    ["HAG", "Haggai", ["haggai", "hag"]],
    ["ZEC", "Zechariah", ["zechariah", "zech", "zec"]],
    ["MAL", "Malachi", ["malachi", "mal"]],
    ["MAT", "Matthew", ["matthew", "matt", "mat", "mt"]],
    ["MRK", "Mark", ["mark", "mrk", "mk"]],
    ["LUK", "Luke", ["luke", "luk", "lk"]],
    ["JHN", "John", ["john", "jhn", "jn"]],
    ["ACT", "Acts", ["acts", "act"]],
    ["ROM", "Romans", ["romans", "rom"]],
    ["1CO", "1 Corinthians", ["1 corinthians", "1corinthians", "1 cor", "1cor"]],
    ["2CO", "2 Corinthians", ["2 corinthians", "2corinthians", "2 cor", "2cor"]],
    ["GAL", "Galatians", ["galatians", "gal"]],
    ["EPH", "Ephesians", ["ephesians", "eph"]],
    ["PHP", "Philippians", ["philippians", "phil", "php"]],
    ["COL", "Colossians", ["colossians", "col"]],
    ["1TH", "1 Thessalonians", ["1 thessalonians", "1thessalonians", "1 thess", "1thess"]],
    ["2TH", "2 Thessalonians", ["2 thessalonians", "2thessalonians", "2 thess", "2thess"]],
    ["1TI", "1 Timothy", ["1 timothy", "1timothy", "1 tim", "1tim"]],
    ["2TI", "2 Timothy", ["2 timothy", "2timothy", "2 tim", "2tim"]],
    ["TIT", "Titus", ["titus", "tit"]],
    ["PHM", "Philemon", ["philemon", "phlm", "phm"]],
    ["HEB", "Hebrews", ["hebrews", "heb"]],
    ["JAS", "James", ["james", "jas", "jam"]],
    ["1PE", "1 Peter", ["1 peter", "1peter", "1 pet", "1pet"]],
    ["2PE", "2 Peter", ["2 peter", "2peter", "2 pet", "2pet"]],
    ["1JN", "1 John", ["1 john", "1john", "1 jn"]],
    ["2JN", "2 John", ["2 john", "2john", "2 jn"]],
    ["3JN", "3 John", ["3 john", "3john", "3 jn"]],
    ["JUD", "Jude", ["jude", "jud"]],
    ["REV", "Revelation", ["revelation", "rev"]]
  ];

  const BOOK_NAMES =
    Object.fromEntries(
      BOOKS.map(([id, name]) => [id, name])
    );

  const BOOK_ALIASES =
    Object.fromEntries(
      BOOKS.flatMap(([id, name, aliases]) =>
        aliases.map(alias => [alias, id])
      )
    );

  const chapterCache =
    new Map();

  const searchInput =
    document.getElementById("homeVerseSearch");

  const lookupButton =
    document.getElementById("homeLookupBtn");

  const backdrop =
    document.getElementById("bibleBackdrop");

  const modalTitle =
    document.getElementById("bibleModalTitle");

  const verseBody =
    document.getElementById("bibleBody");

  const closeButton =
    document.getElementById("bibleCloseBtn");

  const viewChapterButton =
    document.getElementById("viewChapterBtn");

  const copyReferenceButton =
    document.getElementById("copyRefBtn");

  const copyPassageButton =
    document.getElementById("copyPassageBtn");

  let activeParsed =
    null;

  let activeReferenceText =
    "";

  let activePassageText =
    "";

  function normalizeInput(input) {
    return String(input || "")
      .replace(/[–—]/g, "-")
      .replace(/\./g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function parseReference(input) {
    const normalized =
      normalizeInput(input);

    const lower =
      normalized.toLowerCase();

    const aliases =
      Object.keys(BOOK_ALIASES)
        .sort((left, right) =>
          right.length - left.length
        );

    const alias =
      aliases.find(name =>
        lower === name ||
        lower.startsWith(`${name} `)
      );

    if (!alias) {
      throw new Error(
        "Could not recognize the Bible book. Try Romans 10:9-10."
      );
    }

    const bookId =
      BOOK_ALIASES[alias];

    const rest =
      normalized.slice(alias.length).trim();

    const match =
      rest.match(/^(\d+)\s*:\s*(.+)$/);

    if (!match) {
      throw new Error(
        "Use a chapter and verse, such as John 3:16."
      );
    }

    const chapter =
      Number(match[1]);

    const verseSpec =
      match[2].replace(/\s+/g, "");

    const selected =
      new Set();

    verseSpec.split(",").forEach(part => {
      if (!part) {
        return;
      }

      if (part.includes("-")) {
        const [start, end] =
          part.split("-").map(Number);

        if (
          !start ||
          !end ||
          end < start
        ) {
          throw new Error(
            "The verse range is not valid."
          );
        }

        for (
          let verse = start;
          verse <= end;
          verse++
        ) {
          selected.add(verse);
        }
      } else {
        const verse =
          Number(part);

        if (!verse) {
          throw new Error(
            "The verse number is not valid."
          );
        }

        selected.add(verse);
      }
    });

    if (!selected.size) {
      throw new Error(
        "No verses were found in that reference."
      );
    }

    return {
      bookId,
      chapter,
      selected,
      canonical:
        `${BOOK_NAMES[bookId]} ${chapter}:${verseSpec}`,
      chapterReference:
        `${BOOK_NAMES[bookId]} ${chapter}`
    };
  }

  function flattenVerseContent(
    content,
    plainText = false
  ) {
    return content.map(piece => {
      if (typeof piece === "string") {
        return plainText
          ? piece
          : escapeHtml(piece);
      }

      if (
        piece &&
        typeof piece.text === "string"
      ) {
        return plainText
          ? piece.text
          : escapeHtml(piece.text);
      }

      if (piece?.lineBreak) {
        return plainText
          ? "\n"
          : "<br>";
      }

      if (piece?.heading) {
        return plainText
          ? `${piece.heading} `
          : `<strong>${escapeHtml(piece.heading)}</strong> `;
      }

      return "";
    })
    .join("")
    .replace(/\s+/g, " ")
    .trim();
  }

  async function fetchChapter(
    bookId,
    chapter
  ) {
    const key =
      `${bookId}-${chapter}`;

    if (chapterCache.has(key)) {
      return chapterCache.get(key);
    }

    const response =
      await fetch(
        `${BSB_API_BASE}/${bookId}/${chapter}.json`,
        {
          cache: "force-cache"
        }
      );

    if (!response.ok) {
      throw new Error(
        "Could not load that chapter."
      );
    }

    const data =
      await response.json();

    chapterCache.set(
      key,
      data
    );

    return data;
  }

  function openModal() {
    backdrop.classList.add("show");

    backdrop.setAttribute(
      "aria-hidden",
      "false"
    );
  }

  function closeModal() {
    backdrop.classList.remove("show");

    backdrop.setAttribute(
      "aria-hidden",
      "true"
    );
  }

  function buildVerseHtml(verses) {
    return verses.map(verse => `
      <p>
        <sup>${escapeHtml(verse.number)}</sup>
        ${flattenVerseContent(verse.content)}
      </p>
    `).join("");
  }

  function buildPlainPassage(
    reference,
    verses
  ) {
    const lines =
      verses.map(verse =>
        `${verse.number} ${flattenVerseContent(
          verse.content,
          true
        )}`
      );

    return `${lines.join("\n")}\n\n${reference} BSB`;
  }

  async function copyText(
    text,
    button,
    successText,
    resetText
  ) {
    try {
      await navigator.clipboard.writeText(text);

      button.textContent =
        successText;
    } catch {
      button.textContent =
        "Copy Failed";
    }

    setTimeout(() => {
      button.textContent =
        resetText;
    }, 1200);
  }

  async function lookupVerse(reference) {
    const requestedReference =
      String(reference || "").trim();

    if (!requestedReference) {
      return;
    }

    modalTitle.textContent =
      requestedReference;

    verseBody.innerHTML =
      '<p class="bible-loading">Loading BSB passage...</p>';

    copyPassageButton.textContent =
      "Copy Verse + Reference";

    openModal();

    try {
      const parsed =
        parseReference(requestedReference);

      const chapterData =
        await fetchChapter(
          parsed.bookId,
          parsed.chapter
        );

      const verses =
        chapterData.chapter.content.filter(item =>
          item.type === "verse" &&
          parsed.selected.has(Number(item.number))
        );

      if (!verses.length) {
        throw new Error(
          "No matching verses were found."
        );
      }

      activeParsed =
        parsed;

      activeReferenceText =
        `${parsed.canonical} BSB`;

      activePassageText =
        buildPlainPassage(
          parsed.canonical,
          verses
        );

      modalTitle.textContent =
        activeReferenceText;

      verseBody.innerHTML = `
        <div>
          ${buildVerseHtml(verses)}
        </div>

        <p style="font-size:.88rem;color:#d8c786;margin-top:18px;">
          Berean Standard Bible, public domain.
        </p>
      `;
    } catch (error) {
      activeParsed =
        null;

      activeReferenceText =
        "";

      activePassageText =
        "";

      verseBody.innerHTML = `
        <p class="bible-error">
          The passage could not be loaded.
        </p>

        <p>${escapeHtml(error.message)}</p>

        <p>
          Try a reference such as
          <strong>John 1:1,14</strong>
          or
          <strong>Romans 10:9-10</strong>.
        </p>
      `;
    }
  }

  async function showWholeChapter() {
    if (!activeParsed) {
      return;
    }

    modalTitle.textContent =
      `${activeParsed.chapterReference} BSB`;

    verseBody.innerHTML =
      '<p class="bible-loading">Loading full chapter...</p>';

    copyPassageButton.textContent =
      "Copy Chapter + Reference";

    try {
      const chapterData =
        await fetchChapter(
          activeParsed.bookId,
          activeParsed.chapter
        );

      const verses =
        chapterData.chapter.content.filter(
          item => item.type === "verse"
        );

      activeReferenceText =
        `${activeParsed.chapterReference} BSB`;

      activePassageText =
        buildPlainPassage(
          activeParsed.chapterReference,
          verses
        );

      verseBody.innerHTML = `
        <div>
          ${buildVerseHtml(verses)}
        </div>

        <p style="font-size:.88rem;color:#d8c786;margin-top:18px;">
          Berean Standard Bible, public domain.
        </p>
      `;
    } catch (error) {
      verseBody.innerHTML = `
        <p class="bible-error">
          The full chapter could not be loaded.
        </p>

        <p>${escapeHtml(error.message)}</p>
      `;
    }
  }

  document
    .querySelectorAll(".sample-verse")
    .forEach(button => {
      button.addEventListener(
        "click",
        () => lookupVerse(button.dataset.ref)
      );
    });

  lookupButton.addEventListener(
    "click",
    () => lookupVerse(searchInput.value)
  );

  searchInput.addEventListener(
    "keydown",
    event => {
      if (event.key === "Enter") {
        lookupVerse(event.target.value);
      }
    }
  );

  viewChapterButton.addEventListener(
    "click",
    showWholeChapter
  );

  copyReferenceButton.addEventListener(
    "click",
    () => {
      if (!activeReferenceText) {
        return;
      }

      copyText(
        activeReferenceText,
        copyReferenceButton,
        "Copied!",
        "Copy Reference"
      );
    }
  );

  copyPassageButton.addEventListener(
    "click",
    () => {
      if (!activePassageText) {
        return;
      }

      const resetText =
        copyPassageButton.textContent.includes("Chapter")
          ? "Copy Chapter + Reference"
          : "Copy Verse + Reference";

      copyText(
        activePassageText,
        copyPassageButton,
        "Copied!",
        resetText
      );
    }
  );

  closeButton.addEventListener(
    "click",
    closeModal
  );

  backdrop.addEventListener(
    "click",
    event => {
      if (event.target === backdrop) {
        closeModal();
      }
    }
  );

  document.addEventListener(
    "keydown",
    event => {
      if (event.key === "Escape") {
        closeModal();
      }
    }
  );
})();
