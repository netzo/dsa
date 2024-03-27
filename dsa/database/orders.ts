import { z } from "zod";

// schemas:

export const orderSchema = z.object({
  id: z.string().ulid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deletedAt: z.string().datetime().nullable(),
  orderNumber: z.number(),
  paymentMethod: z.enum(["account", "cash", "card"]),
  items: z.array(z.object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
    quantity: z.number(),
  })),
  accountId: z.string(),
  userId: z.string(),
});

// types:

export type Order = z.infer<typeof orderSchema>;

// defaults:

export const getOrder = (data?: Partial<Order>) => ({
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  deletedAt: null,
  orderNumber: 0,
  paymentMethod: "account",
  items: [],
  accountId: "",
  userId: "",
  ...data,
});
