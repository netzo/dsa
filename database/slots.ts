import { z } from "zod";

export const slotSchema = z.object({
  id: z.string().ulid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deletedAt: z.string().datetime().nullable(),
  facilityId: z.string(),
  day: z.enum([
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
    "festiveDays",
  ]),
  startTime: z.string().regex(
    /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
    "Invalid time format (HH:MM)",
  ),
  duration: z.string().regex(
    /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
    "Invalid time format (HH:MM)",
  ),
});

export type slot = z.infer<typeof slotSchema>;

export const getSlot = (data?: Partial<slot>) => ({
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  deletedAt: null,
  facilityId: "",
  day: "monday",
  startTime: "09:00",
  duration: "01:00",
  ...data,
});
