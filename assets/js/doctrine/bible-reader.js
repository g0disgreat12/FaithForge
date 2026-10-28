/*
  SIMPLE BSB VERSION
  No ESV key. No Cloudflare Worker required.
  Uses public-domain BSB chapter JSON from the Free Use Bible API:
  https://bible.helloao.org/api/BSB/JHN/3.json

  This supports normal single-chapter references like:
  John 3:16
  Romans 10:9-10
  John 1:1,14
  Romans 14:1-13,19
*/

const BSB_API_BASE = "https://bible.helloao.org/api/BSB";

const BOOK_ALIASES = {
  "genesis":"GEN","gen":"GEN",
  "exodus":"EXO","exod":"EXO","exo":"EXO",
  "leviticus":"LEV","lev":"LEV",
  "numbers":"NUM","num":"NUM",
  "deuteronomy":"DEU","deut":"DEU","deu":"DEU",
  "joshua":"JOS","josh":"JOS","jos":"JOS",
  "judges":"JDG","judg":"JDG","jdg":"JDG",
  "ruth":"RUT","rut":"RUT",
  "1 samuel":"1SA","1samuel":"1SA","1 sam":"1SA","1sam":"1SA",
  "2 samuel":"2SA","2samuel":"2SA","2 sam":"2SA","2sam":"2SA",
  "1 kings":"1KI","1kings":"1KI","1 kgs":"1KI","1kgs":"1KI",
  "2 kings":"2KI","2kings":"2KI","2 kgs":"2KI","2kgs":"2KI",
  "1 chronicles":"1CH","1chronicles":"1CH","1 chron":"1CH","1chron":"1CH","1 chr":"1CH","1chr":"1CH",
  "2 chronicles":"2CH","2chronicles":"2CH","2 chron":"2CH","2chron":"2CH","2 chr":"2CH","2chr":"2CH",
  "ezra":"EZR","ezr":"EZR",
  "nehemiah":"NEH","neh":"NEH",
  "esther":"EST","est":"EST",
  "job":"JOB",
  "psalms":"PSA","psalm":"PSA","ps":"PSA","psa":"PSA",
  "proverbs":"PRO","prov":"PRO","pro":"PRO",
  "ecclesiastes":"ECC","eccl":"ECC","ecc":"ECC",
  "song of songs":"SNG","song of solomon":"SNG","song":"SNG","sos":"SNG","sng":"SNG",
  "isaiah":"ISA","isa":"ISA",
  "jeremiah":"JER","jer":"JER",
  "lamentations":"LAM","lam":"LAM",
  "ezekiel":"EZK","ezek":"EZK","ezk":"EZK",
  "daniel":"DAN","dan":"DAN",
  "hosea":"HOS","hos":"HOS",
  "joel":"JOL","jol":"JOL",
  "amos":"AMO","amo":"AMO",
  "obadiah":"OBA","obad":"OBA","oba":"OBA",
  "jonah":"JON","jon":"JON",
  "micah":"MIC","mic":"MIC",
  "nahum":"NAM","nah":"NAM","nam":"NAM",
  "habakkuk":"HAB","hab":"HAB",
  "zephaniah":"ZEP","zeph":"ZEP","zep":"ZEP",
  "haggai":"HAG","hag":"HAG",
  "zechariah":"ZEC","zech":"ZEC","zec":"ZEC",
  "malachi":"MAL","mal":"MAL",
  "matthew":"MAT","matt":"MAT","mat":"MAT","mt":"MAT",
  "mark":"MRK","mrk":"MRK","mk":"MRK",
  "luke":"LUK","luk":"LUK","lk":"LUK",
  "john":"JHN","jhn":"JHN","jn":"JHN",
  "acts":"ACT","act":"ACT",
  "romans":"ROM","rom":"ROM",
  "1 corinthians":"1CO","1corinthians":"1CO","1 cor":"1CO","1cor":"1CO",
  "2 corinthians":"2CO","2corinthians":"2CO","2 cor":"2CO","2cor":"2CO",
  "galatians":"GAL","gal":"GAL",
  "ephesians":"EPH","eph":"EPH",
  "philippians":"PHP","phil":"PHP","php":"PHP",
  "colossians":"COL","col":"COL",
  "1 thessalonians":"1TH","1thessalonians":"1TH","1 thess":"1TH","1thess":"1TH",
  "2 thessalonians":"2TH","2thessalonians":"2TH","2 thess":"2TH","2thess":"2TH",
  "1 timothy":"1TI","1timothy":"1TI","1 tim":"1TI","1tim":"1TI",
  "2 timothy":"2TI","2timothy":"2TI","2 tim":"2TI","2tim":"2TI",
  "titus":"TIT","tit":"TIT",
  "philemon":"PHM","phlm":"PHM","phm":"PHM",
  "hebrews":"HEB","heb":"HEB",
  "james":"JAS","jas":"JAS","jam":"JAS",
  "1 peter":"1PE","1peter":"1PE","1 pet":"1PE","1pet":"1PE",
  "2 peter":"2PE","2peter":"2PE","2 pet":"2PE","2pet":"2PE",
  "1 john":"1JN","1john":"1JN","1 jn":"1JN",
  "2 john":"2JN","2john":"2JN","2 jn":"2JN",
  "3 john":"3JN","3john":"3JN","3 jn":"3JN",
  "jude":"JUD","jud":"JUD",
  "revelation":"REV","rev":"REV"
};

const CANONICAL_BOOK_NAMES = {
  "GEN":"Genesis","EXO":"Exodus","LEV":"Leviticus","NUM":"Numbers","DEU":"Deuteronomy",
  "JOS":"Joshua","JDG":"Judges","RUT":"Ruth","1SA":"1 Samuel","2SA":"2 Samuel",
  "1KI":"1 Kings","2KI":"2 Kings","1CH":"1 Chronicles","2CH":"2 Chronicles",
  "EZR":"Ezra","NEH":"Nehemiah","EST":"Esther","JOB":"Job","PSA":"Psalm",
  "PRO":"Proverbs","ECC":"Ecclesiastes","SNG":"Song of Songs","ISA":"Isaiah",
  "JER":"Jeremiah","LAM":"Lamentations","EZK":"Ezekiel","DAN":"Daniel","HOS":"Hosea",
  "JOL":"Joel","AMO":"Amos","OBA":"Obadiah","JON":"Jonah","MIC":"Micah","NAM":"Nahum",
  "HAB":"Habakkuk","ZEP":"Zephaniah","HAG":"Haggai","ZEC":"Zechariah","MAL":"Malachi",
  "MAT":"Matthew","MRK":"Mark","LUK":"Luke","JHN":"John","ACT":"Acts","ROM":"Romans",
  "1CO":"1 Corinthians","2CO":"2 Corinthians","GAL":"Galatians","EPH":"Ephesians",
  "PHP":"Philippians","COL":"Colossians","1TH":"1 Thessalonians","2TH":"2 Thessalonians",
  "1TI":"1 Timothy","2TI":"2 Timothy","TIT":"Titus","PHM":"Philemon","HEB":"Hebrews",
  "JAS":"James","1PE":"1 Peter","2PE":"2 Peter","1JN":"1 John","2JN":"2 John",
  "3JN":"3 John","JUD":"Jude","REV":"Revelation"
};

const chapterCache = new Map();

const backdrop = document.getElementById("verseBackdrop");
const modalTitle = document.getElementById("verseModalTitle");
const verseBody = document.getElementById("verseBody");
const viewChapterBtn = document.getElementById("viewChapterBtn");
const copyRefBtn = document.getElementById("copyRefBtn");
const copyVerseBtn = document.getElementById("copyVerseBtn");

let activeRef = "";
let activeParsed = null;
let activeChapterData = null;
let activeVerseCopyText = "";

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizeInput(input) {
  return String(input || "")
    .replace(/[–—]/g, "-")
    .replace(/\./g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function parseReference(input) {
  const normalized = normalizeInput(input);
  const lower = normalized.toLowerCase();

  const aliases = Object.keys(BOOK_ALIASES).sort((a, b) => b.length - a.length);
  const alias = aliases.find(name => lower === name || lower.startsWith(name + " "));

  if (!alias) {
    throw new Error("Could not recognize the Bible book. Try something like Romans 10:9-10.");
  }

  const bookId = BOOK_ALIASES[alias];
  const rest = normalized.slice(alias.length).trim();
  const match = rest.match(/^(\d+)\s*:\s*(.+)$/);

  if (!match) {
    throw new Error("Use a chapter and verse, like John 3:16.");
  }

  const chapter = Number(match[1]);
  const verseSpec = match[2].replace(/\s+/g, "");
  const selected = new Set();

  verseSpec.split(",").forEach(part => {
    if (!part) return;

    if (part.includes("-")) {
      const [start, end] = part.split("-").map(Number);
      if (!start || !end || end < start) throw new Error("Verse range is not valid.");
      for (let v = start; v <= end; v++) selected.add(v);
    } else {
      const verse = Number(part);
      if (!verse) throw new Error("Verse number is not valid.");
      selected.add(verse);
    }
  });

  if (!selected.size) {
    throw new Error("No verses were found in that reference.");
  }

  const canonical = `${CANONICAL_BOOK_NAMES[bookId]} ${chapter}:${verseSpec}`;
  return { bookId, chapter, selected, canonical };
}

function flattenVerseContent(content) {
  return content.map(piece => {
    if (typeof piece === "string") return escapeHtml(piece);
    if (piece && typeof piece.text === "string") return escapeHtml(piece.text);
    if (piece && piece.lineBreak) return "<br>";
    if (piece && piece.heading) return `<strong>${escapeHtml(piece.heading)}</strong> `;
    // Skip footnote callers in simple mode.
    return "";
  }).join("");
}

function flattenVersePlainText(content) {
  return content.map(piece => {
    if (typeof piece === "string") return piece;
    if (piece && typeof piece.text === "string") return piece.text;
    if (piece && piece.lineBreak) return "\n";
    if (piece && piece.heading) return `${piece.heading} `;
    return "";
  }).join("").replace(/\s+\n/g, "\n").replace(/\s+/g, " ").trim();
}

function getChapterTitle(parsed) {
  return `${CANONICAL_BOOK_NAMES[parsed.bookId]} ${parsed.chapter}`;
}

function getVerseNumbersText(verses) {
  return verses.map(v => Number(v.number)).join(", ");
}

function renderPassage(parsed, chapterData, verses) {
  activeVerseCopyText = `${parsed.canonical} BSB\n` +
    verses.map(v => `${v.number} ${flattenVersePlainText(v.content)}`).join("\n");

  modalTitle.textContent = `${parsed.canonical} BSB`;
  viewChapterBtn.textContent = `View ${getChapterTitle(parsed)}`;
  copyVerseBtn.textContent = "Copy Verse + Reference";
  copyVerseBtn.disabled = false;

  verseBody.innerHTML = `
    <div class="bsb-passage">
      ${verses.map(v => `
        <p>
          <sup>${v.number}</sup>
          ${flattenVerseContent(v.content)}
        </p>
      `).join("")}
    </div>
    <p style="font-size:.9rem;color:#d8c786;margin-top:18px;">
      Berean Standard Bible, public domain.
    </p>
  `;
}

function renderWholeChapter(parsed, chapterData) {
  const chapterTitle = getChapterTitle(parsed);
  activeVerseCopyText = `${chapterTitle} BSB\n` +
    chapterData.chapter.content
      .filter(item => item.type === "verse")
      .map(v => `${v.number} ${flattenVersePlainText(v.content)}`)
      .join("\n");

  modalTitle.textContent = `${chapterTitle} BSB`;
  viewChapterBtn.textContent = "Back to Selected Verse";
  copyVerseBtn.textContent = "Copy Chapter + Reference";
  copyVerseBtn.disabled = false;

  verseBody.innerHTML = `
    <div class="bsb-passage">
      ${chapterData.chapter.content.map(item => {
        if (item.type === "heading" && item.content) {
          return `<div class="chapter-heading">${escapeHtml(item.content)}</div>`;
        }

        if (item.type === "verse") {
          const isSelected = parsed.selected.has(Number(item.number));
          return `
            <p class="${isSelected ? "verse-highlight" : ""}">
              <sup>${item.number}</sup>
              ${flattenVerseContent(item.content)}
            </p>
          `;
        }

        return "";
      }).join("")}
    </div>
    <p style="font-size:.9rem;color:#d8c786;margin-top:18px;">
      Berean Standard Bible, public domain.
    </p>
  `;
}

async function fetchChapter(bookId, chapter) {
  const key = `${bookId}-${chapter}`;

  if (chapterCache.has(key)) {
    return chapterCache.get(key);
  }

  const url = `${BSB_API_BASE}/${bookId}/${chapter}.json`;
  const response = await fetch(url, { cache: "force-cache" });

  if (!response.ok) {
    throw new Error("Could not load that chapter.");
  }

  const data = await response.json();
  chapterCache.set(key, data);
  return data;
}

function openModal() {
  backdrop.classList.add("show");
  backdrop.setAttribute("aria-hidden", "false");
}

function closeModal() {
  backdrop.classList.remove("show");
  backdrop.setAttribute("aria-hidden", "true");
}

async function lookupVerse(reference) {
  const ref = String(reference || "").trim();
  if (!ref) return;

  activeRef = ref;
  activeParsed = null;
  activeChapterData = null;
  activeVerseCopyText = "";

  modalTitle.textContent = ref;
  verseBody.innerHTML = '<p class="loading">Loading BSB passage...</p>';
  viewChapterBtn.textContent = "View Whole Chapter";
  viewChapterBtn.disabled = true;
  copyVerseBtn.disabled = true;
  openModal();

  try {
    const parsed = parseReference(ref);
    const chapterData = await fetchChapter(parsed.bookId, parsed.chapter);

    const verses = chapterData.chapter.content
      .filter(item => item.type === "verse" && parsed.selected.has(Number(item.number)));

    if (!verses.length) {
      throw new Error("No matching verses were found in that chapter.");
    }

    activeRef = parsed.canonical;
    activeParsed = parsed;
    activeChapterData = chapterData;

    viewChapterBtn.disabled = false;
    renderPassage(parsed, chapterData, verses);
  } catch (error) {
    verseBody.innerHTML = `
      <p class="error-message">I could not load that BSB passage.</p>
      <p>${escapeHtml(error.message)}</p>
      <p>Tip: use one chapter at a time, like <strong>John 1:1,14</strong> or <strong>Romans 14:1-13,19</strong>.</p>
    `;
  }
}

document.querySelectorAll(".verse-chip").forEach(button => {
  button.addEventListener("click", () => lookupVerse(button.dataset.ref));
});

document.querySelector(".close-modal").addEventListener("click", closeModal);

backdrop.addEventListener("click", event => {
  if (event.target === backdrop) closeModal();
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeModal();
});

document.getElementById("lookupBtn").addEventListener("click", () => {
  lookupVerse(document.getElementById("verseSearch").value);
});

document.getElementById("verseSearch").addEventListener("keydown", event => {
  if (event.key === "Enter") lookupVerse(event.target.value);
});

viewChapterBtn.addEventListener("click", () => {
  if (!activeParsed || !activeChapterData) return;

  if (viewChapterBtn.textContent.startsWith("Back")) {
    const verses = activeChapterData.chapter.content
      .filter(item => item.type === "verse" && activeParsed.selected.has(Number(item.number)));
    renderPassage(activeParsed, activeChapterData, verses);
  } else {
    renderWholeChapter(activeParsed, activeChapterData);
  }
});

copyRefBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(activeRef);
    copyRefBtn.textContent = "Copied!";
    setTimeout(() => copyRefBtn.textContent = "Copy Reference", 1200);
  } catch {
    copyRefBtn.textContent = "Copy Failed";
    setTimeout(() => copyRefBtn.textContent = "Copy Reference", 1200);
  }
});

function currentCopyVerseButtonLabel() {
  return viewChapterBtn.textContent.startsWith("Back")
    ? "Copy Chapter + Reference"
    : "Copy Verse + Reference";
}

copyVerseBtn.addEventListener("click", async () => {
  const label = currentCopyVerseButtonLabel();

  try {
    await navigator.clipboard.writeText(activeVerseCopyText || activeRef);
    copyVerseBtn.textContent = "Copied!";
    setTimeout(() => copyVerseBtn.textContent = label, 1200);
  } catch {
    copyVerseBtn.textContent = "Copy Failed";
    setTimeout(() => copyVerseBtn.textContent = label, 1200);
  }
});

/* Lightweight ember background */
const c = document.getElementById("embers");
const ctx = c.getContext("2d");
function resize(){ c.width = innerWidth; c.height = innerHeight; }
resize();
window.addEventListener("resize", resize);
let particles = [];
function spawn(){
  particles.push({ x: Math.random()*c.width, y: c.height + 10, s: Math.random()*2 + 1, o: .6 });
}
function draw(){
  ctx.clearRect(0,0,c.width,c.height);
  particles.forEach((p,i)=>{
    ctx.fillStyle = `rgba(245,197,24,${p.o})`;
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.s,0,Math.PI*2);
    ctx.fill();
    p.y -= 1.5;
    p.o -= .004;
    if(p.o <= 0) particles.splice(i,1);
  });
  if(Math.random() < .28) spawn();
  requestAnimationFrame(draw);
}
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) draw();
