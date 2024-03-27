import { z } from "zod";

// schemas:

export const publicationSchema = z.object({
  id: z.string().ulid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deletedAt: z.string().datetime().nullable(),
  type: z.enum([
    "second-hand",
    "legal",
    "food",
    "health",
    "beauty",
    "home",
    "education",
    "financial",
    "entertainment",
    "transport",
    "sports",
    "other",
  ]),
  name: z.string(),
  description: z.string(),
  image: z.string().url(),
  contact: z.object({
    email: z.string().email(),
    phone: z.string(),
    website: z.string().url().optional(),
  }),
  userId: z.string(),
  data: z.union([z.object()]),
});

// types:

export type Publication = z.infer<typeof publicationSchema>;

// defaults:

export const getPublication = (data?: Partial<Publication>) => ({
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  deletedAt: null,
  type: "second-hand",
  name: "",
  description: "",
  image: "",
  contact: {
    email: "",
    phone: "",
  },
  userId: "",
  ...data,
});

// i18n:

export const PUBLICATION_TYPES = {
  "second-hand": "Segunda Mano",
  "legal": "Legal",
  "food": "Alimentos",
  "health": "Salud",
  "beauty": "Belleza",
  "home": "Hogar",
  "education": "Educación",
  "financial": "Financiero",
  "entertainment": "Entretenimiento",
  "transport": "Transporte",
  "sports": "Deportes",
  "other": "Otro",
};
