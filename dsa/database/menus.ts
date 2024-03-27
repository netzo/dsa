import { z } from "zod";

// schemas:

export const menuSchema = z.object({
  id: z.string().ulid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deletedAt: z.string().datetime().nullable(),
  name: z.string(),
  description: z.string(),
  caption: z.string(),
  image: z.string().url(),
  cuisine: z.string(),
  restaurantId: z.string(),
  sections: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
      caption: z.string(),
      image: z.string().url(),
    }),
  ),
});

// types:

export type Menu = z.infer<typeof menuSchema>;

// defaults:

export const getMenu = (data?: Partial<Menu>) => ({
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  deletedAt: null,
  name: "",
  description: "",
  caption: "",
  image: "",
  cuisine: "",
  restaurantId: "",
  sections: [],
  ...data,
});
