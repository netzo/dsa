import { z } from "zod";
import { getOpeningHours, openingHoursSchema } from "./mod.ts";

// schemas:

export const restaurantsSchema = z.object({
  menuIds: z.array(z.string()),
});

export const courtsSchema = z.object({
  type: z.array(z.enum([
    "tennis",
    "paddle",
    "racquetball",
    "basketball",
    "volleyball",
    "handball",
    "soccer",
  ])),
});

export const gymsSchema = z.object({
  type: z.array(z.enum([
    "fitness",
    "cardio",
    "spinning",
    "pilates",
  ])),
});

export const eventAreasSchema = z.object({
  type: z.array(z.enum([
    "event-areas",
  ])),
});

export const playAreasSchema = z.object({
  type: z.array(z.enum(["play-areas"])),
});

export const poolsSchema = z.object({
  type: z.array(z.enum([
    "swimming",
    "diving",
    "water-polo",
    "recreational",
  ])),
});

export const tracksSchema = z.object({
  type: z.array(z.enum([
    "running",
    "ice-skating",
  ])),
});

export const lockerRoomsSchema = z.object({
  type: z.array(z.enum([
    "jacuzzi",
    "sauna",
    "steam-room",
    "showers",
    "changing-rooms",
  ])),
});

export const facilitySchema = z.object({
  id: z.string().ulid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deletedAt: z.string().datetime().nullable(),
  type: z.enum([
    "restaurant",
    "courts",
    "gyms",
    "event-areas",
    "play-areas",
    "pools",
    "tracks",
    "locker-rooms",
    "other",
  ]),
  name: z.string(),
  description: z.string(),
  image: z.string().url(),
  contact: z.object({
    email: z.string().email(),
    phone: z.string(),
  }),
  openingHours: openingHoursSchema,
  data: z.union([
    restaurantsSchema,
    courtsSchema,
    gymsSchema,
    eventAreasSchema,
    playAreasSchema,
    poolsSchema,
    tracksSchema,
    lockerRoomsSchema,
  ]),
});

// types:

export type Facility = z.infer<typeof facilitySchema>;

// defaults:

export const getFacility = (data?: Partial<Facility>) => ({
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  deletedAt: null,
  type: "other",
  name: "",
  description: "",
  image: "",
  contact: {
    email: "",
    phone: "",
  },
  openingHours: getOpeningHours(data?.openingHours),
  ...data,
});

// i18n:

export const FACILITY_TYPES = {
  "restaurant": "Restaurante",
  "court": "Cancha",
  "gym": "Ginmasio",
  "event-area": "Area de Eventos",
  "play-area": "Area de Juego",
  "pool": "Albercas",
  "track": "Pistas",
  "locker-room": "Vestidores",
  "other": "Otra",
};
