import { defineRoute } from "$fresh/server.ts";
import type { Unit } from "../../../database/units.ts";
import { PageUnit } from "../../islands/unit.tsx";
import { db } from "../../netzo.config.ts";

export default defineRoute(async (req, ctx) => {
  const { id } = ctx.params;
  const [unit, units] = await Promise.all([
    db.units.get(id) as Unit,
    db.find<Unit>("units"),
  ]);

  // render entire page as island for simplicity
  return <PageUnit {...{ id, unit, units }} />;
});
