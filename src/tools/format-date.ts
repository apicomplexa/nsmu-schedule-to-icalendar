// Helper function to format dates to iCalendar format
export function formatDate(date: Date) {
  return date.toISOString().replaceAll(/-|:|(\.\d{3})/g, '')
}
