import { defineRoute } from "$fresh/server.ts";
import { type Unit } from "@/mod.ts";
import { PageUnits } from "../../islands/units.tsx";
import { db } from "../../netzo.config.ts";

// NOTE: cannot pass functions as props from routes (server) to islands (client)
export default defineRoute(async (req, ctx) => {
  const units = await db.find<Unit>("units");

  // render entire page as island for simplicity
  return <PageUnits units={units} />;
});
