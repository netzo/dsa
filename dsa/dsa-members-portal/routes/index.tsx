import { defineRoute } from "$fresh/server.ts";
import { PageHome } from "@/islands/home.tsx";
import { db } from "@/netzo.config.ts";
import type { Amenity } from "../../database/amenities.ts";
import type { Notice } from "../../database/notices.ts";

export default defineRoute(async (req, ctx) => {
  const accountId = ctx.url.searchParams.get("accountId");
  const [amenities, notices] = await Promise.all([
    db.find<Amenity>("amenities", { type: "event" }),
    db.find<Notice>("notices"),
  ]);

  return <PageHome amenities={amenities} notices={notices} />;
});
