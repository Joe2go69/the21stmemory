/**
 * Helpers for a topic's `added` value.
 *
 * `added` is either:
 *   - date-only  "YYYY-MM-DD"                 (legacy topics; kept as-is)
 *   - timestamp  "YYYY-MM-DDTHH:MM:SS±HH:MM"  (new topics; local offset, so the
 *                                              first 10 chars are the local day)
 *
 * Ordering (compareAddedDesc, newest first):
 *   1. Calendar day as written (first 10 chars). We do NOT Date.parse a bare
 *      date: JS reads it as UTC midnight, which is the previous evening in PT
 *      and would sort it below a timestamp from the day before.
 *   2. Same day: a timestamped entry ranks above a date-only one (date-only is
 *      treated as the start of that day, i.e. older).
 *   3. Same day, both timestamped: by exact instant (Date.parse).
 *   4. Otherwise 0, so the caller's tiebreak (build order) applies.
 */

function addedDay(value) {
  const m = /^(\d{4}-\d{2}-\d{2})/.exec(String(value || ''));
  return m ? m[1] : '';
}

function addedInstant(value) {
  const s = String(value || '');
  if (s.length <= 10) return null;
  const t = Date.parse(s);
  return Number.isFinite(t) ? t : null;
}

function compareAddedDesc(a, b) {
  const da = addedDay(a);
  const db = addedDay(b);
  if (da !== db) return db.localeCompare(da);
  const ta = addedInstant(a);
  const tb = addedInstant(b);
  if (ta !== null && tb !== null) return tb - ta;
  if (ta !== null) return -1;
  if (tb !== null) return 1;
  return 0;
}

/** ISO 8601 with the machine's local offset, e.g. 2026-10-15T12:30:05-07:00. */
function localIsoTimestamp(date = new Date()) {
  const pad = (n) => String(Math.abs(Math.trunc(n))).padStart(2, '0');
  const off = -date.getTimezoneOffset();
  const sign = off >= 0 ? '+' : '-';
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}` +
    `${sign}${pad(off / 60)}:${pad(off % 60)}`
  );
}

module.exports = { addedDay, addedInstant, compareAddedDesc, localIsoTimestamp };
