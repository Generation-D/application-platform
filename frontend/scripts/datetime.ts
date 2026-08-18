import { parseISO, isValid, format } from "date-fns";
import { TZDate } from "@date-fns/tz";
import { DATETIME_FORMAT } from "./consts";

/**
 * Checks if a string is a valid ISO 8601 date/datetime representation.
 */
export function dtIsIso8601(dateString: string): boolean {
  if (typeof dateString !== "string" || !dateString.trim()) {
    return false;
  }
  const parsed = parseISO(dateString);
  return isValid(parsed);
}

/**
 * Converts a date into a formatted UTC ISO string based on Europe/Berlin timezone boundaries.
 */
export function convertToTimezone(
  date: Date,
  options: { endOfDay?: boolean } = {},
): string {
  const { endOfDay = false } = options;
  const timeZone = "Europe/Berlin";

  const year = date.getFullYear();
  const month = date.getMonth(); // 0-indexed in JS/TS
  const day = date.getDate();
  const hours = endOfDay ? 23 : 0;
  const minutes = endOfDay ? 59 : 0;
  const seconds = 0;

  const berlinDate = new TZDate(
    year,
    month,
    day,
    hours,
    minutes,
    seconds,
    timeZone,
  );

  const utcDate = new TZDate(berlinDate, "UTC");

  return format(utcDate, DATETIME_FORMAT);
}
