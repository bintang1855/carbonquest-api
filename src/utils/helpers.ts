export function removeUndefinedFields<T extends object>(obj: T): Partial<T> {
  const result = { ...obj };
  Object.keys(result).forEach((key) => {
    if (result[key as keyof T] === undefined) {
      delete result[key as keyof T];
    }
  });
  return result;
}

export function parseId(id: string): number {
  return parseInt(id, 10);
}

export function buildFilePath(filename: string): string {
  return `/files/${filename}`;
}
