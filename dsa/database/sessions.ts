import { z } from "zod";

// schemas:

export const sessionSchema = z.object({
  id: z.string().ulid(),
  name: z.string(),
  description: z.string().optional(),
  status: z.enum(["active", "inactive"]),
  sportId: z.string(),
  serviceId: z.string(), // non sport related
  staffId: z.string(), // staff-coach or staff-service
  slotId: z.array(z.string()),
  ageGroup: z.enum(["kids", "teens", "adults", "seniors"]),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  startDate: z.string().datetime(),
  frequency: z.enum(["once", "daily", "weekly", "monthly"]),
  capacity: z.number(),
});

// types:

export type session = z.infer<typeof sessionSchema>;

// defaults:

export const getSession = (data?: Partial<session>) => ({
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  deletedAt: null,
  name: "",
  description: "",
  status: "active",
  sportId: "",
  serviceId: "",
  staffId: "",
  slotId: [],
  ageGroup: "adults",
  level: "beginner",
  startDate: new Date().toISOString(),
  frequency: "weekly",
  capacity: 10,
  ...data,
});
