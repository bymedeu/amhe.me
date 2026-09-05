// Calendar dates are interpreted in the portfolio owner's timezone.
export function calendarDay(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Paris", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(now);
}

export function dateBoundary(value, end = false) {
  if (!value) return null;
  if (value.length === 4) return `${value}-${end ? "12-31" : "01-01"}`;
  if (value.length === 7) {
    const [year, month] = value.split("-").map(Number);
    const day = end ? new Date(Date.UTC(year, month, 0)).getUTCDate() : 1;
    return `${value}-${String(day).padStart(2, "0")}`;
  }
  return value;
}

export function isCurrent(period, now = new Date()) {
  if (!period?.start || (!period.end && !period.openEnded)) return false;
  const today = calendarDay(now);
  return today >= dateBoundary(period.start)
    && (period.openEnded || today <= dateBoundary(period.end, true));
}

export function formatPeriod(period, language) {
  if (!period) return "";
  const start = formatDatePoint(period.start, language);
  if (period.openEnded) return `${start} — ${language === "fr" ? "aujourd’hui" : "Present"}`;
  if (!period.end || period.start === period.end) return start;
  const end = formatDatePoint(period.end, language);
  if (period.start.length >= 7 && period.end.length >= 7 && period.start.slice(0, 4) === period.end.slice(0, 4)) {
    return `${formatDatePoint(period.start, language, false)} — ${end}`;
  }
  return `${start} — ${end}`;
}

function formatDatePoint(value, language, includeYear = true) {
  if (value.length === 4) return value;
  const [year, month] = value.split("-").map(Number);
  return new Intl.DateTimeFormat(language === "fr" ? "fr-FR" : "en-GB", {
    month: "short", ...(includeYear ? { year: "numeric" } : {}), timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, 1))).replace(".", "");
}
