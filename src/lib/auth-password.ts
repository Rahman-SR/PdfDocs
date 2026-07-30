// Password rules mirror the recommended Supabase Auth policy for new passwords.
export const MIN_PASSWORD_LENGTH = 12
export const MAX_PASSWORD_LENGTH = 128
export const PASSWORD_REQUIREMENTS =
  'Use at least 12 characters with uppercase, lowercase, a number, and a symbol.'

// Client-side validation gives immediate feedback; Supabase remains authoritative.
export function getPasswordValidationError(password: string): string | null {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return PASSWORD_REQUIREMENTS
  }

  if (password.length > MAX_PASSWORD_LENGTH) {
    return `Use no more than ${MAX_PASSWORD_LENGTH} characters.`
  }

  if (
    !/[a-z]/.test(password)
    || !/[A-Z]/.test(password)
    || !/[0-9]/.test(password)
    || !/[^A-Za-z0-9]/.test(password)
  ) {
    return PASSWORD_REQUIREMENTS
  }

  return null
}
