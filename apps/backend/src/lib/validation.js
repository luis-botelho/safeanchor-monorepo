const DEFAULT_MAX_LENGTH = 200;

export function isNonEmptyString(value, maximum = DEFAULT_MAX_LENGTH) {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    value.trim().length <= maximum
  );
}

export function hasRequiredStrings(body, fields, maximum = DEFAULT_MAX_LENGTH) {
  return fields.every((field) => isNonEmptyString(body?.[field], maximum));
}

export function isEmail(value) {
  return (
    isNonEmptyString(value, 254) &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
  );
}

export function isStrongPassword(value) {
  return typeof value === "string" && value.length >= 12 && value.length <= 128;
}
