import { z } from "zod";

// schemas:

export const noticeSchema = z.object({
  id: z.string().ulid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deletedAt: z.string().datetime().nullable(),
  type: z.enum([
    "info",
    "security",
    "maintenance",
    "legal",
    "achievement",
    "promotion",
    "advertisement",
    "other",
  ]),
  name: z.string(),
  description: z.string(),
  image: z.string().url(),
  notes: z.string(),
});

// types:

export type Notice = z.infer<typeof noticeSchema>;

// defaults:

export const getNotice = (data?: Partial<Notice>) => ({
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  deletedAt: null,
  type: "other",
  name: "",
  description: "",
  image: "",
  notes: "",
  ...data,
});

// i18n:

export const NOTICE_TYPES = {
  info: {
    icon: "mdi-information",
    text: "Información",
    className: `bg-blue hover:bg-blue bg-opacity-80 text-white`,
  },
  security: {
    icon: "mdi-shield",
    text: "Seguridad",
    className: `bg-red hover:bg-red bg-opacity-80 text-white`,
  },
  legal: {
    icon: "mdi-file-document",
    text: "Legal",
    className: `bg-purple hover:bg-purple bg-opacity-80 text-white`,
  },
  achievement: {
    icon: "mdi-trophy",
    text: "Logros",
    className: `bg-purple hover:bg-purple bg-opacity-80 text-white`,
  },
  promotion: {
    icon: "mdi-gift",
    text: "Promoción",
    className: `bg-yellow hover:bg-yellow bg-opacity-80 text-white`,
  },
  "advertisement": {
    icon: "mdi-bullhorn",
    text: "Anuncio",
    className: `bg-green hover:bg-green bg-opacity-80 text-white`,
  },
  "maintenance": {
    icon: "mdi-wrench",
    text: "Mantenimiento",
    className: `bg-gray hover:bg-gray bg-opacity-80 text-white`,
  },
  other: {
    icon: "mdi-dots-horizontal",
    text: "Otro",
    className: `bg-gray hover:bg-gray bg-opacity-80 text-white`,
  },
};
