const HTTP_PROTOCOLS = new Set(['http:', 'https:']);
const HTTP_PROTOCOL_PATTERN = /^https?:/i;
const URL_SCHEME_PATTERN = /^[a-z][a-z\d+.-]*:/i;
const HOST_WITH_PORT_PATTERN = /^[^/?#]+:\d+(?:[/?#]|$)/;

export const normalizeWebUrl = (value: string): string | null => {
  const trimmedValue = value.trim();
  if (!trimmedValue) {
    return null;
  }

  if (
    URL_SCHEME_PATTERN.test(trimmedValue) &&
    !HTTP_PROTOCOL_PATTERN.test(trimmedValue) &&
    !HOST_WITH_PORT_PATTERN.test(trimmedValue)
  ) {
    return null;
  }

  const candidate = HTTP_PROTOCOL_PATTERN.test(trimmedValue)
    ? trimmedValue
    : `https://${trimmedValue}`;

  try {
    const url = new URL(candidate);
    if (!HTTP_PROTOCOLS.has(url.protocol) || !url.hostname) {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
};

export const getCompactUrlLabel = (url: string): string => {
  const parsedUrl = new URL(url);
  const hostname = parsedUrl.hostname.replace(/^www\./, '');
  const pathname =
    parsedUrl.pathname === '/' ? '' : parsedUrl.pathname.replace(/\/$/, '');

  return `${hostname}${pathname}${parsedUrl.search}${parsedUrl.hash}`;
};
