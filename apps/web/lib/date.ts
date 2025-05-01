/* eslint-disable @typescript-eslint/no-explicit-any */
export function formatDate(dateStr: any) {
    const [month, day, year] = dateStr.split('/').map(Number);
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const getOrdinal = (n: any) => {
      const v = n % 100;
      return suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0];
    };
    const date = new Date(year, month - 1, day);
    const monthName = date.toLocaleString('default', { month: 'long' });
    return `${day}${getOrdinal(day)} ${monthName} ${year}`;
  }