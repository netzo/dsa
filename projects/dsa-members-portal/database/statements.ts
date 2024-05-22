import { z } from "zod";

export const statementSchema = z.object({
  id: z.string().ulid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deletedAt: z.string().datetime().nullable(),
  type: z.enum([
    "contribution",
    "order",
  ]),
  paymentMethod: z.enum(["account", "cash", "card"]),
  amount: z.number(),
  accountId: z.string(),
});

export type Statement = z.infer<typeof statementSchema>;

export const getStatement = (data?: Partial<Statement>) => ({
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  deletedAt: null,
  type: "order",
  paymentMethod: "account",
  amount: 0,
  accountId: "",
  ...data,
});

export const statements = [
  {
    "key": ["statements", ""],
    "value": {
      id: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
      type: "order",
      paymentMethod: "account",
      amount: 0,
      accountId: "",
    },
  },
];

// i18n:

export const STATEMENT_TYPES = {
  "contribution": "Aportación",
  "order": "Orden",
};
