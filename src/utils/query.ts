export const getQueryString = (value: unknown) => {
  return typeof value === 'string' ? value : ''
}

export const getQueryPage = (value: unknown): number => {
  const queryValue = Number(getQueryString(value))

  if (!Number.isInteger(queryValue)) return 1

  return queryValue < 1 ? 1 : queryValue
}
