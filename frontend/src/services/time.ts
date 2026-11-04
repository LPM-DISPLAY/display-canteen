/**
 * Formats an ISO datetime string into Asia/Jakarta (WIB / UTC+7) time string.
 * Example outputs:
 *   formatWIB("2026-11-05T06:00:00Z") => "13:00 WIB"
 *   formatWIBDateTime("2026-11-05T06:00:00Z") => "05 Nov 13:00 WIB"
 */
export function formatWIB(dateString?: string | null): string {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '-';

    return (
      d.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Jakarta',
      }) + ' WIB'
    );
  } catch {
    return '-';
  }
}

export function formatWIBDateTime(dateString?: string | null): string {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '-';

    const formattedDate = d.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      timeZone: 'Asia/Jakarta',
    });
    const formattedTime = d.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Jakarta',
    });

    return `${formattedDate}, ${formattedTime} WIB`;
  } catch {
    return '-';
  }
}
