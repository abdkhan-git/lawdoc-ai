import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classnames.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Convert a string to ASCII-only characters (remove emojis, non-printables).
 */
export function convertToAscii(str: string) {
  return str.replace(/[^ -~]+/g, "");
}
