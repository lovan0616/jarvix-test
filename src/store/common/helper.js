export function handleByStatus ({ handlers, status, defaultValue }) {
  const handler = handlers[status]
  return handler ? handler() || defaultValue : defaultValue
}
