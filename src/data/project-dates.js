const projectPeriods = Object.freeze({
  mystarceiling: { start: "2024" },
  aurora: { start: "2026-06", end: "present" },
  "word-search-ocr": { start: "2024" },
  "multiplayer-game": { start: "2023-09", end: "2024-06" },
  "c-piscine": { start: "2025-10" },
  tinyprintf: { start: "2025" },
  evalexpr: { start: "2025" },
  minimake: { start: "2025" },
  "memory-allocator": { start: "2025" },
  "http-server": { start: "2025" },
  "21sh": { start: "2026-01" },
  "42sh": { start: "2025-12", end: "2026-01" },
  "cpp-piscine": { start: "2026-05" },
  "image-library": { start: "2026-06" },
  tiger: { start: "2026" },
  "java-piscine": { start: "2026-05" },
  "rush-creeps": { start: "2026" },
  jws: { start: "2026" },
  ping: { start: "2026-06", end: "2026-07" },
  "javascript-piscine": { start: "2026-06" },
  eplace: { start: "2026" },
  libzork: { start: "2026" },
  "snow-plow": { start: "2026-05", end: "2026-07" },
  "comments-platform": { start: "2026-05" },
  "cs50-ai": { start: "2026" },
  leetcode: { start: "2026-03", end: "present" },
});

export function getProjectPeriod(projectId) {
  return projectPeriods[projectId] ?? null;
}

export function getProjectPeriodIds() {
  return Object.keys(projectPeriods);
}

export function formatProjectPeriod(projectId, language) {
  const period = getProjectPeriod(projectId);
  if (!period) return "";

  const start = formatDatePoint(period.start, language);
  if (!period.end || period.end === period.start) return start;
  if (period.end === "present") {
    return `${start} — ${language === "fr" ? "aujourd’hui" : "present"}`;
  }

  const end = formatDatePoint(period.end, language);
  if (period.start.length === 7 && period.end.length === 7 && period.start.slice(0, 4) === period.end.slice(0, 4)) {
    const startMonth = formatDatePoint(period.start, language, false);
    return `${startMonth} — ${end}`;
  }
  return `${start} — ${end}`;
}

function formatDatePoint(value, language, includeYear = true) {
  if (value.length === 4) return value;

  const [year, month] = value.split("-").map(Number);
  return new Intl.DateTimeFormat(language === "fr" ? "fr-FR" : "en-GB", {
    month: "short",
    ...(includeYear ? { year: "numeric" } : {}),
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, 1))).replace(".", "");
}
