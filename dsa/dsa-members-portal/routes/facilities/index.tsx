import { defineRoute } from "$fresh/server.ts";
import { PageFacilities } from "@/islands/facilities.tsx";
import { db } from "@/netzo.config.ts";
import type { Facility } from "../../../database/facilities.ts";

// NOTE: cannot pass functions as props from routes (server) to islands (client)
export default defineRoute(async (req, ctx) => {
  const facilities = await db.find<Facility>("facilities", ctx.params);

  // render entire page as island for simplicity
  return <PageFacilities facilities={facilities} />;
});
