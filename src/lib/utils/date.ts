import { Timestamp } from "firebase/firestore";

export type DateInput = Date | string | number | Timestamp | null | undefined;
type FirestoreTimestampLike = { _seconds: number; _nanoseconds: number };
type TimeUnit =
  | "year"
  | "month"
  | "week"
  | "day"
  | "hour"
  | "minute"
  | "second";

interface DateUtils {
  formatDateLong(date?: DateInput): string;
  formatDateShort(date?: DateInput): string;
  formatFull(date?: DateInput): string;
  timeAgo(date: DateInput): string;
  startOfToday(): Date;
  endOfToday(): Date;
  shiftDays(date?: DateInput, days?: number): Date;
  now(): number;
  getYearsAgoDate(yearsAgo?: number): string;
  formatDate(date: unknown): string;
}

/**
 * Strictly parse supported date inputs
 */
const parseDate = (date: DateInput): Date => {
  if (!date) throw new Error("Date is null/undefined");

  if (date instanceof Date) {
    if (isNaN(date.getTime())) throw new Error("Invalid Date object");
    return date;
  }

  if (typeof date === "string" || typeof date === "number") {
    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) {
      throw new Error(`Invalid date string/number: ${date}`);
    }
    return parsed;
  }

  if (date instanceof Timestamp) {
    return date.toDate();
  }

  throw new Error(`Unsupported date input: ${date}`);
};

export const dateUtils: DateUtils = {
  formatDateLong(date: DateInput = new Date()): string {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(parseDate(date));
  },

  formatDateShort(date: DateInput = new Date()): string {
    return new Intl.DateTimeFormat("en-US").format(parseDate(date));
  },

  formatFull(date: DateInput = new Date()): string {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(parseDate(date));
  },

  timeAgo(date: DateInput): string {
    const now = new Date();
    const targetDate = parseDate(date);
    const seconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);

    const rtf = new Intl.RelativeTimeFormat("en-US", { numeric: "auto" });

    const ranges: Record<TimeUnit, number> = {
      year: 31536000,
      month: 2628000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
      second: 1,
    };

    for (const [unit, secondsInUnit] of Object.entries(ranges) as [
      TimeUnit,
      number
    ][]) {
      if (seconds >= secondsInUnit || unit === "second") {
        const value = -Math.floor(seconds / secondsInUnit);
        return rtf.format(value, unit);
      }
    }

    return rtf.format(0, "second");
  },

  startOfToday(): Date {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  },

  endOfToday(): Date {
    const d = new Date();
    d.setHours(23, 59, 59, 999);
    return d;
  },

  shiftDays(date: DateInput = new Date(), days: number = 1): Date {
    const d = new Date(parseDate(date));
    d.setDate(d.getDate() + days);
    return d;
  },

  now(): number {
    return Date.now();
  },

  getYearsAgoDate(yearsAgo: number = 0): string {
    const today = new Date();
    const past = new Date(
      today.getFullYear() - yearsAgo,
      today.getMonth(),
      today.getDate()
    );
    return past.toISOString().split("T")[0];
  },
  formatDate(date: unknown): string {
    const jsDate = toDate(date);
    if (!jsDate) return "Invalid date";
    return dateUtils.formatDateLong(jsDate);
  },
};
export const toDate = (date: unknown): Date | null => {
  if (!date) return null;

  // Firestore Timestamp-like
  if (
    typeof date === "object" &&
    date !== null &&
    "_seconds" in date &&
    "_nanoseconds" in date
  ) {
    const { _seconds, _nanoseconds } = date as FirestoreTimestampLike;
    return new Date(_seconds * 1000 + _nanoseconds / 1e6);
  }

  // Already a Date
  if (date instanceof Date) return date;

  // String input
  if (typeof date === "string") {
    const parsed = new Date(date);
    return isNaN(parsed.getTime()) ? null : parsed;
  }

  return null;
};
