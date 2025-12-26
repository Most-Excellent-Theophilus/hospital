import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Timestamp } from "firebase/firestore";
import { toDate } from "./date";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function capitalizeFirstLetter(word: string) {
  if (!word) return "";
  return word.charAt(0).toUpperCase() + word.slice(1);
}
export function capitalizeWords(sentence: string) {
  return sentence.split(" ").map(capitalizeFirstLetter).join(" ");
}

export function slugify(str?: string | null): string {
  return (
    str
      ?.normalize("NFD") // decompose accents
      ?.replace(/[\u0300-\u036f]/g, "") // remove diacritical marks
      ?.toLowerCase()
      ?.trim()
      ?.replace(/[\s\W-]+/g, "-")
      ?.replace(/^-+|-+$/g, "") || ""
  );
}

export const delay = (seconds: number) =>
  new Promise((resolve) => setTimeout(resolve, seconds * 1000));

export const extractData = async <T>(
  promise: Promise<{ status: string; data?: T }>
) => {
  const result = await promise;
  return result.status === "warning" || result.status === "success"
    ? result.data
    : null;
};


export function trimWords(
  text: string | null | undefined,
  wordLimit: number
): string {
  if (!text) return "";

  const words = text.trim().split(/\s+/);
  if (words.length <= wordLimit) return text;
  return words.slice(0, wordLimit).join(" ") + "…";
}
export function trimAndEllipsis(
  text: string | null | undefined,
  maxLength = 50
): string {
  if (!text) return "";
  return text.length > maxLength ? text.slice(0, maxLength) + "…" : text;
}

export function isEmpty(value: unknown): boolean {
  if (value == null) return true; // null or undefined
  if (typeof value === "string") return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  return false;
}

/**
 * Encode a message for safe use in URLs (e.g., WhatsApp links).
 *
 * @param message - The plain text message
 * @returns Encoded string safe for query params
 */
export function encodeMessage(message: string): string {
  return encodeURIComponent(message.trim());
}

export function isString(value: unknown) {
  return typeof value === "string" || value instanceof String;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function normalizeFirestoreData<T extends Record<string, any>>(data: T): T {
  return JSON.parse(
    JSON.stringify(data, (_, value) => {
      if (value instanceof Timestamp) {
        return toDate(value); // or value.toMillis()
      }
      return value;
    })
  );
}