import { Partial } from "$fresh/runtime.ts";
import { defineRoute } from "$fresh/server.ts";
import type { Unit } from "@/mod.ts";
import { Button } from "netzo/components/button.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "netzo/components/card.tsx";
import * as Dashboard from "../islands/dashboard.tsx";
import { db } from "../netzo.config.ts";

export default defineRoute(async (req, ctx) => {
  const unitId = ctx.url.searchParams.get("unitId");
  const [metrics, units] = await Promise.all([
    getMetrics({ unitId }),
    db.find<Unit>("units"),
  ]);

  const unit = units.find(({ id }) => id === unitId) as Unit;

  return (
    <div className="h-100vh overflow-y-auto p-4">
      <div className="p-4 space-y-4">
        <div f-client-nav className="flex items-center">
          <Dashboard.UnitSelect units={units} unit={unit} />
          {/* <MainNav className="mx-6" /> */}
          <div className="ml-auto flex items-center space-x-4">
            <Button onClick={() => globalThis.print()}>
              <i className="mdi-printer w-4 h-4 mr-2" />
              Print PDF
            </Button>
          </div>
        </div>

        <Partial name="main-content">
          <Dashboard.Cards data={metrics} unit={unit} />

          <div className="grid md:grid-cols-2 lg:grid-cols-7 gap-4">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Units per month</CardTitle>
              </CardHeader>
              <CardContent>
                <Dashboard.ChartUnitsPerMonth data={metrics} />
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Units per status</CardTitle>
              </CardHeader>
              <CardContent>
                <Dashboard.ChartUnitsPerStatus data={metrics} />
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Units total through time</CardTitle>
              </CardHeader>
              <CardContent>
                <Dashboard.ChartUnitsThroughTime data={metrics} />
              </CardContent>
            </Card>
          </div>
        </Partial>
      </div>
    </div>
  );
});

// metrics:

export type Metrics = {
  count: {
    all: number;
    ofUnit: number;
    perStatus: {
      lead: number;
      qualified: number;
      negotiation: number;
      won: number;
      lost: number;
    };
    perMonth: { month: number; amount: number }[];
  };
  amount: {
    all: number;
    ofUnit: number;
    perStatus: {
      lead: number;
      qualified: number;
      negotiation: number;
      won: number;
      lost: number;
    };
    perMonth: { month: number; amount: number }[];
  };
  units: Unit[];
  unitsPerMonth: { month: number; amount: number }[];
  unitsAmountThroughTime: { createdAt: string; amount: number }[];
};

async function getMetrics(query: { unitId?: string }): Promise<Metrics> {
  const allUnitsUnsorted = await db.find<Unit>("units");
  const allUnits = allUnitsUnsorted.sort((a, b) => a.createdAt - b.createdAt);
  const units = query?.unitId
    ? allUnits.filter((unit) => unit.unitId === query.unitId)
    : allUnits;

  return {
    count: {
      all: allUnits.length,
      ofUnit: units.length,
      perStatus: {
        lead: units.filter((unit) => unit.status === "lead").length,
        qualified: units.filter((unit) => unit.status === "qualified").length,
        negotiation:
          units.filter((unit) => unit.status === "negotiation").length,
        won: units.filter((unit) => unit.status === "won").length,
        lost: units.filter((unit) => unit.status === "lost").length,
      },
      perMonth: units.reduce(
        (acc, unit) => {
          const date = new Date(unit["createdAt"]);
          const month = date.getMonth();
          acc[month].amount = acc[month]?.amount + Number(unit.amount);
          return acc;
        },
        Array.from({ length: 12 }).map((_, i) => ({ month: i, amount: 0 })),
      ),
    },
    amount: {
      all: allUnits.reduce((acc, unit) => acc + Number(unit.amount), 0),
      ofUnit: units.reduce(
        (acc, unit) => acc + Number(unit.amount),
        0,
      ),
      perStatus: {
        lead: units.filter((unit) => unit.status === "lead").reduce(
          (acc, unit) => acc + Number(unit.amount),
          0,
        ),
        qualified: units.filter((unit) => unit.status === "qualified")
          .reduce((acc, unit) => acc + Number(unit.amount), 0),
        negotiation: units.filter((unit) => unit.status === "negotiation")
          .reduce((acc, unit) => acc + Number(unit.amount), 0),
        won: units.filter((unit) => unit.status === "won").reduce(
          (acc, unit) => acc + Number(unit.amount),
          0,
        ),
        lost: units.filter((unit) => unit.status === "lost").reduce(
          (acc, unit) => acc + Number(unit.amount),
          0,
        ),
      },
      perMonth: units.reduce(
        (acc, unit) => {
          const date = new Date(unit["createdAt"]);
          const month = date.getMonth();
          acc[month].amount = acc[month].amount + Number(unit.amount);
          return acc;
        },
        Array.from({ length: 12 }).map((_, i) => ({ month: i, amount: 0 })),
      ),
    },
    units,
    unitsPerMonth: units.reduce((acc, unit) => {
      const date = new Date(unit["createdAt"]);
      const month = date.getMonth();
      acc[month].amount = acc[month].amount + Number(unit.amount);
      return acc;
    }, Array.from({ length: 12 }).map((_, i) => ({ month: i, amount: 0 }))),
    unitsAmountThroughTime: units
      .sort((a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
      .map((unit) => ({
        createdAt: unit["createdAt"],
        amount: getTotalAmountThroughTime(units, unit.createdAt),
      })),
  };
}

function getTotalAmountThroughTime(units: Unit[], isoDate: string) {
  return units
    .filter((unit) =>
      new Date(unit.createdAt).getTime() <= new Date(isoDate).getTime()
    )
    .reduce((acc, unit) => acc + Number(unit.amount), 0);
}
