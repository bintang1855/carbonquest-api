const JAKARTA_TIMEZONE = 'Asia/Jakarta';

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
      // Deteksi field tanggal berdasarkan nama
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
