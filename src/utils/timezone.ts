const JAKARTA_TIMEZONE = 'Asia/Jakarta';
const JAKARTA_UTC_OFFSET = '+07:00';

export function toJakartaTime(date: Date | string | null | undefined): string | null {
  if (!date) return null;
  
  const d = typeof date === 'string' ? new Date(date) : date;
  
  return d.toLocaleString('sv-SE', { 
    timeZone: JAKARTA_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).replace(' ', 'T') + '+07:00';
}

export function convertDatesToJakarta<T>(obj: T): T {
  if (obj === null || obj === undefined) return obj;
  
  if (obj instanceof Date) {
    return toJakartaTime(obj) as unknown as T;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => convertDatesToJakarta(item)) as unknown as T;
  }
  
  if (typeof obj === 'object') {
    const result: Record<string, unknown> = {};
    
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      const isDateField = /date|time|created|updated|_at$/i.test(key);
      
      if (isDateField && value instanceof Date) {
        result[key] = toJakartaTime(value);
      } else if (isDateField && typeof value === 'string' && isISODateString(value)) {
        result[key] = toJakartaTime(value);
      } else if (typeof value === 'object' && value !== null) {
        result[key] = convertDatesToJakarta(value);
      } else {
        result[key] = value;
      }
    }
    
    return result as T;
  }
  
  return obj;
}

function isISODateString(str: string): boolean {
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(str);
}

export function nowJakarta(): Date {
  return new Date();
}

export function getJakartaDayRange(date: Date = new Date()): { start: Date; end: Date } {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: JAKARTA_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
    .formatToParts(date)
    .reduce<Record<string, string>>((acc, part) => {
      if (part.type !== 'literal') acc[part.type] = part.value;
      return acc;
    }, {});

  const yyyy = parts.year;
  const mm = parts.month;
  const dd = parts.day;

  const start = new Date(`${yyyy}-${mm}-${dd}T00:00:00${JAKARTA_UTC_OFFSET}`);
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  return { start, end };
}

export function getJakartaWeekRange(date: Date = new Date()): { start: Date; end: Date } {
  const { start: dayStart } = getJakartaDayRange(date);

  const weekday = new Intl.DateTimeFormat('en-US', {
    timeZone: JAKARTA_TIMEZONE,
    weekday: 'short',
  }).format(date);

  const weekdayIndex: Record<string, number> = {
    Mon: 0,
    Tue: 1,
    Wed: 2,
    Thu: 3,
    Fri: 4,
    Sat: 5,
    Sun: 6,
  };

  const deltaDays = weekdayIndex[weekday] ?? 0;
  const start = new Date(dayStart.getTime() - deltaDays * 24 * 60 * 60 * 1000);
  const end = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);
  return { start, end };
}

export function getJakartaMonthRange(date: Date = new Date()): { start: Date; end: Date } {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: JAKARTA_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
  })
    .formatToParts(date)
    .reduce<Record<string, string>>((acc, part) => {
      if (part.type !== 'literal') acc[part.type] = part.value;
      return acc;
    }, {});

  const yyyy = Number(parts.year);
  const mm = Number(parts.month);

  const start = new Date(`${String(yyyy).padStart(4, '0')}-${String(mm).padStart(2, '0')}-01T00:00:00${JAKARTA_UTC_OFFSET}`);

  const nextMonth = mm === 12 ? 1 : mm + 1;
  const nextYear = mm === 12 ? yyyy + 1 : yyyy;
  const end = new Date(`${String(nextYear).padStart(4, '0')}-${String(nextMonth).padStart(2, '0')}-01T00:00:00${JAKARTA_UTC_OFFSET}`);
  return { start, end };
}

export function formatDateIndonesia(date: Date | string | null | undefined): string | null {
  if (!date) return null;
  
  const d = typeof date === 'string' ? new Date(date) : date;
  
  return d.toLocaleDateString('id-ID', {
    timeZone: JAKARTA_TIMEZONE,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
