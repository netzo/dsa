import { z } from "zod";

// schemas:

export const vehicleSchema = z.object({
  id: z.string().ulid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deletedAt: z.string().datetime().nullable(),
  type: z.enum([
    "car",
    "suv",
    "pickup",
    "truck",
    "motorcycle",
    "other",
  ]),
  plateNumber: z.string(),
  data: z.object({
    brand: z.string(),
    model: z.string(),
    year: z.number(),
    color: z.string(),
  }),
  accountId: z.string(),
});

// types:

export type Vehicle = z.infer<typeof vehicleSchema>;

// defaults:

export const getVehicle = (data?: Partial<Vehicle>) => ({
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  deletedAt: null,
  type: "car",
  plateNumber: "",
  data: {
    brand: "",
    model: "",
    year: 0,
    color: "",
  },
  accountId: "",
  ...data,
});

// i18n:

export const VEHICLE_TYPES = {
  "car": "Carro",
  "suv": "Camioneta",
  "pickup": "Pickup",
  "truck": "Camión",
  "motorcycle": "Motocicleta",
  "other": "Otro",
};
