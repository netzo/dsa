import { z } from "zod";

export const bookingSchema = z.object({
  id: z.string().ulid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deletedAt: z.string().datetime().nullable(),
  sessionId: z.string(),
  status: z.enum([
    "waiting",
    "confirmed",
    "cancelled",
  ]),
  userId: z.string(),
});

export type Booking = z.infer<typeof bookingSchema>;

export const getBooking = (data?: Partial<Booking>) => ({
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  deletedAt: null,
  sessionId: "",
  status: "waiting",
  userId: "",
  ...data,
});
