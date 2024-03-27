import { defineRoute } from "$fresh/server.ts";
import { PageAmenities } from "@/islands/amenities.tsx";
import { db } from "@/netzo.config.ts";
import type { Amenity } from "../../../../database/amenities.ts";

// NOTE: cannot pass functions as props from routes (server) to islands (client)
export default defineRoute(async (req, ctx) => {
  const type = ctx.params?.type?.slice(0, -1); // remove last character "s"
  const amenities = await db.find<Amenity>("amenities", { type });

  // render entire page as island for simplicity
  return <PageAmenities amenities={amenities} />;
});
