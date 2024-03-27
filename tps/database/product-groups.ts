import { z } from "zod";

// schemas:

export const productGroupSchema = z.object({
  "@odata.etag": z.string(),
  dataAreaId: z.string(),
  GroupId: z.string(),
  DefaultForecastAllocationKeyId: z.string(),
  GroupName: z.string(),
  DefaultSalesSalesTaxItemGroupCode: z.string(),
  DefaultPurchaseSalesTaxItemGroupCode: z.string(),
  ShipmentPhysicalLoadTemplateId: z.string(),
  RevRecMedianPriceMaximumTolerance: z.number(),
  RevRecMedianPrice: z.string(),
  RevRecDefaultRevenueRecognitionSchedule: z.string(),
  RevRecExcludeFromCarveOut: z.string(),
  RevRecMedianPriceMinimumTolerance: z.number(),
  RevRecRevenueRecognitionEnabled: z.string(),
  RevRecRevenueType: z.string(),
  AMFixedAssetGroup: z.string(),
});

// types:

export type ProductGroup = z.infer<typeof productGroupSchema>;
