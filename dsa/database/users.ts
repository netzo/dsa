import { z } from "zod";

// schemas:

export const userSchema = z.object({
  id: z.string().ulid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deletedAt: z.string().datetime().nullable(),
  type: z.enum([
    "user-owner",
    "user-standard",
    "staff-admin",
    "staff-coach",
    "staff-maintenance",
    "staff-security",
    "guest",
  ]),
  name: z.string(),
  image: z.string().url(),
  email: z.string().email(),
  phone: z.string(),
  accountId: z.string().optional(), // users only
});

// types:

export type User = z.infer<typeof userSchema>;

// defaults:

export const getUser = (data?: Partial<User>) => ({
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  deletedAt: null,
  type: "user-owner",
  name: "",
  image: "",
  email: "",
  phone: "",
  accountId: "",
  ...data,
});

// i18n:

export const USER_TYPES = {
  "user-owner": "Propietario",
  "user-standard": "Estándar",
  "staff-admin": "Administrador",
  "staff-coach": "Entrenador",
  "staff-maintenance": "Mantenimiento",
  "staff-security": "Seguridad",
  "guest": "Invitado",
};
