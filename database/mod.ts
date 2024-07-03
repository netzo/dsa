import { z } from "zod";

export const verificationsSchema = z.object({
  owner: z.boolean(),
  users: z.boolean(),
  payments: z.boolean(),
  vehicles: z.boolean(),
});

export const vehiclesSchema = z.object({
  brand: z.string(),
  model: z.string(),
  year: z.number(),
  color: z.string(),
  plateNumber: z.string(),
});

export const organizersSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  userId: z.string(),
});

export const openingHoursSchema = z.object({
  monday: z.string(),
  tuesday: z.string(),
  wednesday: z.string(),
  thursday: z.string(),
  friday: z.string(),
  saturday: z.string(),
  sunday: z.string(),
  festiveDays: z.string(),
});

export type Verifications = z.infer<typeof verificationsSchema>;
export type Vehicles = z.infer<typeof vehiclesSchema>;
export type Organizers = z.infer<typeof organizersSchema>;
export type OpeningHours = z.infer<typeof openingHoursSchema>;

export const getVerifications = (data?: Partial<Verifications>) => ({
  owner: true,
  users: false,
  payments: true,
  vehicles: true,
  ...data,
});

export const getVehicles = (data?: Partial<Vehicles>) => ({
  brand: "",
  model: "",
  year: 2014,
  color: "",
  plateNumber: "",
  ...data,
});

export const getOrganizers = (data?: Partial<Organizers>) => ({
  name: "",
  userId: "",
  email: "",
  phone: "",
  ...data,
});

export const getOpeningHours = (data?: Partial<OpeningHours>) => ({
  monday: "",
  tuesday: "",
  wednesday: "",
  thursday: "",
  friday: "",
  saturday: "",
  sunday: "",
  festiveDays: "",
  ...data,
});

// used for `row.original.openinigHours[getDay]` to select current day opening hours
export const getDay = (index?: number) =>
  ({
    0: "sunday",
    1: "monday",
    2: "tuesday",
    3: "wednesday",
    4: "thursday",
    5: "friday",
    6: "saturday",
  })?.[index ?? new Date().getDay()];

// utils:

export const toDateTime = (dateTime: string) =>
  new Date(dateTime).toLocaleString("en-GB", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export const toMXN = (amount: number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(amount);

export const toPercent = (value: number) =>
  new Intl.NumberFormat("es-MX", {
    style: "percent",
    minimumFractionDigits: 2,
  }).format(value);

// adapted from https://stackoverflow.com/a/66494926 (underscore-separated hsl syntax for unocss)
// usage: add to className e.g. `bg-[toHslColor(category)]`
export const toHslColor = (value: string, saturation = 75, lightness = 50) => {
  const stringUniqueHash = [...value].reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  const hue = Math.abs(stringUniqueHash % 360);
  return `hsl(${hue}_${saturation}%_${lightness}%)`;
};
