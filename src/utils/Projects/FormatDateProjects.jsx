export const formatDateInput = (date) => {
  if (!date) return ''

  const d = typeof date.toDate === 'function'
    ? date.toDate()
    : new Date(date)

  // biome-ignore lint/suspicious/noGlobalIsNan: <>
  if (isNaN(d.getTime())) return ''

  return d.toISOString().split('T')[0] // yyyy-MM-dd
}