import { PageHome } from "@/islands/home.tsx";
import type { Amenity, Notice } from "@/mod.ts";
import { db } from "@/netzo.config.ts";
import { defineRoute } from "fresh/server.ts";
import type { NetzoState } from "netzo/mod.ts";

export default defineRoute<NetzoState>(async (req, ctx) => {
  const accountId = ctx.url.searchParams.get("accountId");
  const [amenities, notices] = await Promise.all([
    db.find<Amenity>("amenities", { type: "event" }),
    db.find<Notice>("notices"),
  ]);

  return <PageHome amenities={amenities} notices={notices} />;
});
