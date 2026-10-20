// URL helpers shared by every page, so the site works both at the domain root
// and under a project sub-path (PUBLIC_BASE_PATH) without hand-built strings.

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Prefix an internal path ("/projects/") with the deployment base path. */
export function withBase(path: string): string {
  if (/^(https?:|mailto:|tel:|#)/.test(path)) return path;
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${base}${clean}` || '/';
}

export function isExternal(url: string): boolean {
  return /^https?:\/\//.test(url);
}

/** Attributes for links that leave the site. */
export function externalAttrs(url: string): Record<string, string> {
  return isExternal(url) ? { target: '_blank', rel: 'noopener noreferrer' } : {};
}

/** Strip the base path from a pathname so active-nav checks are base-agnostic. */
export function relativePath(pathname: string): string {
  const path = pathname.replace(/\/$/, '') || '/';
  if (base && path.startsWith(base)) return path.slice(base.length) || '/';
  return path;
}
