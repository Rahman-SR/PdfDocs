const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '')

function getSiteUrl(): string {
  const configuredUrl = import.meta.env.VITE_SITE_URL?.trim()

  if (configuredUrl) {
    return trimTrailingSlash(configuredUrl)
  }

  return window.location.origin
}

export function buildAuthRedirect(
  pathname: string,
  nextPath?: string,
): string {
  const url = new URL(pathname, `${getSiteUrl()}/`)

  if (nextPath) {
    url.searchParams.set('next', getSafeRedirect(nextPath))
  }

  return url.toString()
}

export function getSafeRedirect(
  candidate: string | null | undefined,
  fallback = '/dashboard',
): string {
  if (!candidate?.startsWith('/') || candidate.startsWith('//')) {
    return fallback
  }

  return candidate
}
