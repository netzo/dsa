import { getVerifications } from "@/mod.ts";
import { z } from "zod";
import { verificationsSchema } from "./mod.ts";

export const accountSchema = z.object({
  id: z.string().ulid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deletedAt: z.string().datetime().nullable(),
  accountNumber: z.number(),
  verifications: verificationsSchema,
});

export type Account = z.infer<typeof accountSchema>;

export const getAccount = (data?: Partial<Account>) => ({
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  deletedAt: null,
  accountNumber: 0,
  verifications: getVerifications(data?.verifications),
  ...data,
});
