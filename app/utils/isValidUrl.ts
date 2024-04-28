type Base = { success: boolean };

export type UrlSuccess = Base & {
  success: true;
  url: URL;
};

export type UrlError = Base & {
  success: false;
};

export function isValidUrl(maybeUrl: string | null): UrlSuccess | UrlError {
  if (typeof maybeUrl !== 'string') {
    return { success: false } satisfies UrlError;
  }

  try {
    return { success: true, url: new URL(maybeUrl) } satisfies UrlSuccess;
  } catch (err) {
    return { success: false } satisfies UrlError;
  }
}
