/**
 * Estimated calendar delivery date from "today" using a business-day window.
 * Default matches the site’s 3–7 day dispatch + India transit cushion.
 */
export function getEstimatedDeliveryRange({
  minBusinessDays = 5,
  maxBusinessDays = 10,
  fromDate = new Date(),
} = {}) {
  const start = addBusinessDays(fromDate, minBusinessDays);
  const end = addBusinessDays(fromDate, maxBusinessDays);
  return { start, end };
}

export function formatDeliveryByLabel(range = getEstimatedDeliveryRange()) {
  const { start, end } = range;
  const sameMonth =
    start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
  if (sameMonth) {
    return `Delivered by ${formatDay(start)}–${formatDayMonth(end)}`;
  }
  return `Delivered by ${formatDayMonth(start)} – ${formatDayMonth(end)}`;
}

function addBusinessDays(from, count) {
  const d = new Date(from);
  d.setHours(12, 0, 0, 0);
  let added = 0;
  while (added < count) {
    d.setDate(d.getDate() + 1);
    const day = d.getDay();
    if (day !== 0 && day !== 6) added += 1;
  }
  return d;
}

function formatDay(date) {
  return String(date.getDate());
}

function formatDayMonth(date) {
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}
