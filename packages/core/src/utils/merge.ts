function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * Returns a new object with `override` recursively merged over `base`.
 * Neither input is mutated.
 */
export function deepMerge<T extends Record<string, unknown>>(base: T, override?: Record<string, unknown>): T {
  const result: Record<string, unknown> = { ...base }
  if (!override)
    return result as T
  for (const [key, value] of Object.entries(override)) {
    const current = result[key]
    result[key] = isPlainObject(value) && isPlainObject(current)
      ? deepMerge(current, value)
      : value
  }
  return result as T
}
