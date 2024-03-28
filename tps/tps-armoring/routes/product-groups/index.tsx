import { defineRoute } from "$fresh/server.ts";
import type { ProductGroup } from "@/mod.ts";
import { PageProductGroups } from "../../islands/product-groups.tsx";
import { apiMicrosoft365 } from "../../netzo.config.ts";

type ProductGroupsResult = {
  "@odata.context": string;
  value: ProductGroup[];
};

// NOTE: cannot pass functions as props from routes (server) to islands (client)
export default defineRoute(async (req, ctx) => {
  const productGroups = await apiMicrosoft365.data.ProductGroups.get<
    ProductGroupsResult
  >();

  // render entire page as island for simplicity
  return <PageProductGroups productGroups={productGroups.value} />;
});
