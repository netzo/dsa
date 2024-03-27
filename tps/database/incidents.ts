import { z } from "zod";

// schemas:

export const incidentSchema = z.object({
  id: z.string().ulid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deletedAt: z.string().datetime().nullable(),
  type: z.enum([
    "critical",
    "warning",
    "notice",
    "maintenance",
    "security",
    "other",
  ]),
  name: z.string(),
  notes: z.string(),
  unitIds: z.array(z.string()),
});

// types:

export type Incident = z.infer<typeof incidentSchema>;

// defaults:

export const getIncident = (data?: Partial<Incident>) => ({
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  deletedAt: null,
  type: "other",
  name: "",
  notes: "",
  unitIds: [],
  ...data,
});
