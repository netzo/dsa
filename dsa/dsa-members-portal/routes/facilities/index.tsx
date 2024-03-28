import { defineRoute } from "$fresh/server.ts";
import { PageFacilities } from "@/islands/facilities.tsx";
import type { Facility } from "@/mod.ts";
import { db } from "@/netzo.config.ts";

// NOTE: cannot pass functions as props from routes (server) to islands (client)
export default defineRoute(async (req, ctx) => {
  const facilities = await db.find<Facility>("facilities", ctx.params);

  // render entire page as island for simplicity
  return <PageFacilities facilities={facilities} />;
});
