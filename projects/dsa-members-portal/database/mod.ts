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
