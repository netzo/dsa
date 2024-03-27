import { z } from "zod";

// schemas:

export const linksSchema = z.object({
  website: z.string().url(),
  facebook: z.string().url(),
  linkedin: z.string().url(),
  x: z.string().url(),
});

// types:

export type Link = z.infer<typeof linksSchema>;

// defaults:

export const getLinks = (data?: Partial<Link>) => ({
  website: "",
  facebook: "",
  linkedin: "",
  x: "",
  ...data,
});

// utils:

export const toDateTime = (dateTime: string) =>
  new Date(dateTime).toLocaleString("en-GB", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export const toUSD = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

export const toPercent = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 2,
  }).format(value);

// adapted from https://stackoverflow.com/a/66494926 (space-separated hsl syntax for unocss)
export const toHslColor = (value: string, saturation = 75, lightness = 50) => {
  const stringUniqueHash = [...value].reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  const hue = Math.abs(stringUniqueHash % 360);
  return `hsl(${hue} ${saturation}% ${lightness}%)`;
};
