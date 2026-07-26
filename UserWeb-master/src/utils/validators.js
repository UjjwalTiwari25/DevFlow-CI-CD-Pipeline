export function isValidEmail(email) {
  const emailRegEx =
    // eslint-disable-next-line no-useless-escape
    /^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/;
  return emailRegEx.test(email);
}

export function validateTrackSlug(slug) {
  if (!slug) {
    return { isValid: false };
  }

  // Validate slug: reject if it contains characters not allowed in Firebase paths
  // Firebase paths can't contain ".", "#", "$", "[", or "]"
  const invalidCharsRegex = /[.#$[\]]/;
  if (invalidCharsRegex.test(slug)) {
    return { isValid: false };
  }

  return { isValid: true };
}
