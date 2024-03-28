import { defineRoute } from "$fresh/server.ts";
import { PageHome } from "@/islands/home.tsx";
import type { Amenity, Notice } from "@/mod.ts";
import { db } from "@/netzo.config.ts";

export default defineRoute(async (req, ctx) => {
  const accountId = ctx.url.searchParams.get("accountId");
  const [amenities, notices] = await Promise.all([
    db.find<Amenity>("amenities", { type: "event" }),
    db.find<Notice>("notices"),
  ]);

  return <PageHome amenities={amenities} notices={notices} />;
});
