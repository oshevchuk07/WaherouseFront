export function removeEmptyValues<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined && v !== null && v !== '')) as Partial<T>;
}
