export function createError(...errors) {
  const errorMessages = errors.map((err) => {
    if (typeof err !== 'string') return JSON.stringify(err)
    return err
  })
  return {
    errors: errorMessages,
  }
}
