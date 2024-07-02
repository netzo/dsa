import { z } from "zod";

export const itemSchema = z.object({
  id: z.string().ulid(),
  section: z.string(),
  name: z.string(),
  description: z.string(),
  image: z.string().url(),
  price: z.string(),
  variants: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      price: z.string(),
    }),
  ),
});

export type Item = z.infer<typeof itemSchema>;

export const getItem = (data?: Partial<Item>) => ({
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  deletedAt: null,
  name: "",
  description: "",
  image: "",
  cuisine: "",
  items: [],
  ...data,
});
