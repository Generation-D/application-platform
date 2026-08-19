// Standard ISO8601 date-time format representation
export const DATETIME_FORMAT = "yyyy-MM-dd'T'HH:mm:ss";

export const REGEX_PY = {
  PHONE_NUMBER:
    "^\\+?\\d{1,4}([-.\\/\\s]?\\d{1,3})?([-.\\s]?\\d{1,4})?([-.\\s]?\\d{1,4})?([-.\\s]?\\d{1,9})?$",
  URL_SEGMENT: "^(_|-|[a-z]|[A-Z]|[0-9])+$",
  EMAIL:
    "^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@" +
    "(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$",
  TEXT: "^[a-zA-Z0-9_ ]*$",
  NATURAL_NUMBER: "^[1-9]\\d+$",
  RATIONAL_NUMBER: "^(-?)(0|[1-9]\\d*)([.](\\d*)[1-9])?$",
} as const;

export const REGEX_JS = {
  PHONE_NUMBER:
    "^\\+?\\d{1,4}([-.\\/\\s]?\\d{1,3})?([-.\\s]?\\d{1,4})?([-.\\s]?\\d{1,4})?([-.\\s]?\\d{1,9})?$",
  URL_SEGMENT: "^(_|-|[a-zA-Z0-9])+$",
  EMAIL:
    "^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$",
  TEXT: "^[a-zA-Z0-9_ ]*$",
  NATURAL_NUMBER: "^[1-9]\\d+$",
  RATIONAL_NUMBER: "^(-?)(0|[1-9]\\d*)(\\.\\d*[1-9])?$",
} as const;

export const REGEX_TO_DESCRIPTION = {
  PHONE_NUMBER: "Telefonnummer",
  URL_SEGMENT: "URL Segment",
  EMAIL: "Email",
  TEXT: "Text",
  NATURAL_NUMBER: "Natürliche Zahl",
  RATIONAL_NUMBER: "Rationale Zahl",
} as const;

export type RegexKey = keyof typeof REGEX_JS;
export const regexKeys = Object.keys(REGEX_JS) as [RegexKey, ...RegexKey[]];
