/**
 * @param {Array<{ value?: string, unit_name?: string, unit_symbol?: string, label?: string }> | undefined} measures
 * @returns {string}
 */
export function formatMeasuresSummary(measures) {
  if (!Array.isArray(measures) || measures.length === 0) return '';
  return measures
    .map((m) => {
      if (m?.label && String(m.label).trim()) return String(m.label).trim();
      const v = m?.value != null ? String(m.value).trim() : '';
      const u = (m?.unit_symbol || m?.unit_name || '').trim();
      if (!v) return '';
      return u ? `${v} ${u}`.trim() : v;
    })
    .filter(Boolean)
    .join(' · ');
}
