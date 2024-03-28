import { defineRoute } from "$fresh/server.ts";
import type { Incident, Unit } from "@/mod.ts";
import { PageIncidents } from "../../islands/incidents.tsx";
import { db } from "../../netzo.config.ts";

export default defineRoute(async (req, ctx) => {
  const { id } = ctx.params;
  const [incidents, units] = await Promise.all([
    db.find<Incident>("incidents"),
    db.find<Unit>("units"),
  ]);

  // render entire page as island for simplicity
  return (
    <PageIncidents
      incident={incidents.find((a) => a.id === id) ?? incidents[0]}
      incidents={incidents.map((incident) => ({
        ...incident,
        units: units.filter((d) => incident.unitIds?.includes(d.id)),
      }))}
      units={units}
    />
  );
});
