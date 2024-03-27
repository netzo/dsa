import { z } from "zod";

// schemas:

export const unitSchema = z.object({
  id: z.string().ulid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deletedAt: z.string().datetime().nullable(),
  name: z.string(),
  description: z.string(),
  status: z.enum([
    "pending",
    "disassembly",
    "cutting",
    "armoring",
    "painting",
    "assembly",
    "quality",
    "delivered",
  ]),
  tasks: z.object({
    pending: z.object({
      reception: z.boolean(),
      inspection: z.boolean(),
      documentation: z.boolean(),
      inventoryOfParts: z.boolean(),
      initialPhotos: z.boolean(),
      clientCommunication: z.boolean(),
    }),
    disassembly: z.object({
      interiorRemoval: z.boolean(),
      exteriorComponentsRemoval: z.boolean(),
      engineAndDrivetrainInspection: z.boolean(),
      storageOfRemovedParts: z.boolean(),
      labelingAndDocumentation: z.boolean(),
      photographicDocumentation: z.boolean(),
    }),
    cutting: z.object({
      materialSelection: z.boolean(),
      cuttingPlanDesign: z.boolean(),
      cuttingExecution: z.boolean(),
      edgeFinishing: z.boolean(),
      materialInspection: z.boolean(),
      wasteManagement: z.boolean(),
    }),
    armoring: z.object({
      materialPreparation: z.boolean(),
      panelFittingAndInstallation: z.boolean(),
      ballisticGlassInstallation: z.boolean(),
      reinforcedDoorMechanisms: z.boolean(),
      electricalSystemAdjustment: z.boolean(),
      armoringInspection: z.boolean(),
    }),
    painting: z.object({
      surfacePreparation: z.boolean(),
      primerApplication: z.boolean(),
      colorCoatApplication: z.boolean(),
      clearCoatApplication: z.boolean(),
      curingAndDrying: z.boolean(),
      finalInspection: z.boolean(),
      detailing: z.boolean(),
    }),
    assembly: z.object({
      interiorInstallation: z.boolean(),
      exteriorComponentsInstallation: z.boolean(),
      engineAndDrivetrainAssembly: z.boolean(),
      functionalTesting: z.boolean(),
      finalAssemblyInspection: z.boolean(),
      cleaningAndDetailing: z.boolean(),
    }),
    quality: z.object({
      ballisticResistanceTesting: z.boolean(),
      durabilityTesting: z.boolean(),
      functionalityTesting: z.boolean(),
      finalQualityInspection: z.boolean(),
      clientReviewAndFeedback: z.boolean(),
      correctiveActionsDocumentation: z.boolean(),
    }),
    delivered: z.object({
      clientCommunicationForDelivery: z.boolean(),
      finalDocumentationAndInvoice: z.boolean(),
      deliveryOrPickup: z.boolean(),
      postDeliveryFollowUp: z.boolean(),
      customerSatisfactionSurvey: z.boolean(),
    }),
  }),
  amount: z.coerce.number(),
  currencyCode: z.enum(["USD"]),
});

// types:

export type Unit = z.infer<typeof unitSchema>;

// defaults:

const tasks = {
  pending: {
    reception: false,
    inspection: false,
    documentation: false,
    inventoryOfParts: false,
    initialPhotos: false,
    clientCommunication: false,
  },
  disassembly: {
    interiorRemoval: false,
    exteriorComponentsRemoval: false,
    engineAndDrivetrainInspection: false,
    storageOfRemovedParts: false,
    labelingAndDocumentation: false,
    photographicDocumentation: false,
  },
  cutting: {
    materialSelection: false,
    cuttingPlanDesign: false,
    cuttingExecution: false,
    edgeFinishing: false,
    materialInspection: false,
    wasteManagement: false,
  },
  armoring: {
    materialPreparation: false,
    panelFittingAndInstallation: false,
    ballisticGlassInstallation: false,
    reinforcedDoorMechanisms: false,
    electricalSystemAdjustment: false,
    armoringInspection: false,
  },
  painting: {
    surfacePreparation: false,
    primerApplication: false,
    colorCoatApplication: false,
    clearCoatApplication: false,
    curingAndDrying: false,
    finalInspection: false,
    detailing: false,
  },
  assembly: {
    interiorInstallation: false,
    exteriorComponentsInstallation: false,
    engineAndDrivetrainAssembly: false,
    functionalTesting: false,
    finalAssemblyInspection: false,
    cleaningAndDetailing: false,
  },
  quality: {
    ballisticResistanceTesting: false,
    durabilityTesting: false,
    functionalityTesting: false,
    finalQualityInspection: false,
    clientReviewAndFeedback: false,
    correctiveActionsDocumentation: false,
  },
  delivered: {
    clientCommunicationForDelivery: false,
    finalDocumentationAndInvoice: false,
    deliveryOrPickup: false,
    postDeliveryFollowUp: false,
    customerSatisfactionSurvey: false,
  },
};

export const getUnit = (data?: Partial<Unit>) => ({
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  deletedAt: null,
  name: "",
  description: "",
  status: "pending",
  tasks,
  amount: 0,
  currencyCode: "USD",
  ...data,
});
