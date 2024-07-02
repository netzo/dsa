import { PageFacilities } from "@/islands/facilities.tsx";
import type { Facility } from "@/mod.ts";
import { db } from "@/netzo.config.ts";
import { defineRoute } from "fresh/server.ts";
import type { NetzoState } from "netzo/mod.ts";

// NOTE: cannot pass functions as props from routes (server) to islands (client)
export default defineRoute<NetzoState>(async (req, ctx) => {
  const facilities = await db.find<Facility>("facilities", ctx.params);

  // render entire page as island for simplicity
  return <PageFacilities facilities={facilities} />;
});
