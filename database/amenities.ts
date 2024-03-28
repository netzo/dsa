import { z } from "zod";
import { openingHoursSchema, organizersSchema } from "./mod.ts";

const sportsSchema = z.object({
  type: z.enum([
    "swimming",
    "tennis",
    "paddle",
    "racquetball",
    "gymnastics",
    "ice-skating",
    "soccer",
    "hockey",
    "basketball",
    "dance",
    "karate-do",
    "fitness",
    "wellness",
    "boxing",
    "triathlon",
    "yoga",
    "tai-chi",
    "pilates",
    "crossfit",
    "tabata",
    "spinning",
  ]),
});

const eventsSchema = z.object({
  type: z.enum([
    "event",
    "entertainment",
    "education",
    "social",
    "food-and-drink",
    "special",
    "tournament",
    "sports",
  ]),
  startDateTime: z.string().datetime(),
  endDateTime: z.string().datetime(),
  location: z.string(),
  organizers: z.array(organizersSchema), // Assuming you have an organizersSchema defined elsewhere
});

const servicesSchema = z.object({
  type: z.enum(["salon", "wellness", "medical"]),
  openingHours: openingHoursSchema, // Assuming you have an openingHoursSchema defined elsewhere
});

const foodAndDrinksSchema = z.object({
  type: z.enum([
    "snack",
    "bar",
    "cafe",
    "breakfast",
    "lunch",
    "dinner",
    "drinks",
    "juice-bar",
    "buffet",
  ]),
  contact: z.object({
    phone: z.string(),
    email: z.string().email(),
  }),
  openingHours: openingHoursSchema,
  menuIds: z.array(z.string()),
});

export const amenitySchema = z.object({
  id: z.string().ulid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deletedAt: z.string().datetime().nullable(),
  type: z.enum([
    "service",
    "sport",
    "event",
    "food-and-drink",
  ]),
  name: z.string(),
  description: z.string(),
  image: z.string().url(),
  facilityIds: z.array(z.string()),
  data: z.union([
    sportsSchema,
    eventsSchema,
    servicesSchema,
    foodAndDrinksSchema,
  ]),
});

export type Amenity = z.infer<typeof amenitySchema>;

export const getAmenity = (data?: Partial<Amenity>) => ({
  id: "",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  deletedAt: null,
  type: "service",
  name: "",
  description: "",
  image: "",
  facilityIds: [],
  data: {},
  ...data,
});

// i18n:

export const AMENITY_TYPES = {
  // services:
  "salon": "Estética",
  "wellness": "Bienestar",
  "medical": "Servicios Médicos",
  // food-and-drinks:
  "buffet": "Buffet",
  // sports:
  "swimming": "Natación",
  "tennis": "Tenis",
  "paddle": "Pádel",
  "racquetball": "Racquetball",
  "gymnastics": "Gimnasia artística",
  "soccer": "Fútbol",
  "hockey": "Hockey",
  "basketball": "Baloncesto",
  "dance": "Danza",
  "karate-do": "Karate Do",
  "fitness": "Fitness",
  "boxing": "Boxeo",
  "triathlon": "Triatlón",
  "yoga": "Yoga",
  "tai-chi": "Tai Chi",
  "pilates": "Pilates",
  "crossfit": "Crossfit",
  "tabata": "Tabata",
  "spinning": "Spinning",
  "ice-skating": "Patinaje artístico",
};
