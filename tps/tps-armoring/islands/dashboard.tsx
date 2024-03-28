import type { Unit } from "@/mod.ts";
import { toPercent, toUSD } from "@/mod.ts";
import { useSignal } from "@preact/signals";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "netzo/components/avatar.tsx";
import * as Plot from "netzo/components/blocks/plot.tsx";
import { Button } from "netzo/components/button.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "netzo/components/card.tsx";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "netzo/components/command.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "netzo/components/popover.tsx";
import { cn } from "netzo/components/utils.ts";
import type { ComponentProps } from "preact";
import type { Metrics } from "../routes/index.tsx";

type PopoverTriggerProps = ComponentProps<typeof PopoverTrigger>;

interface DashboardUnitSelectProps extends PopoverTriggerProps {
  units: Unit[];
  unit: Unit;
}

export function UnitSelect({
  units,
  unit,
  className,
}: DashboardUnitSelectProps) {
  const open = useSignal(false);
  const selectedUnit = useSignal<Unit | null>(unit);

  const groups = [
    { name: "Units", items: units },
  ];

  const onSelect = (item: Unit) => {
    open.value = false;
    selectedUnit.value = item;
    globalThis.location.href = `?unitId=${item.id}`;
  };

  return (
    <Popover
      open={open.value}
      onOpenChange={(value) => open.value = value}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open.value}
          aria-label="Select a unit"
          className={cn("w-auto justify-between", className)}
        >
          <Avatar className="mr-2 h-5 w-5">
            {selectedUnit.value
              ? (
                <>
                  <AvatarImage
                    src={selectedUnit.value?.image}
                    alt={selectedUnit.value?.name}
                    className="grayscale"
                  />
                  <AvatarFallback>
                    {selectedUnit.value?.name?.[0]}
                  </AvatarFallback>
                </>
              )
              : <i className="mdi-storefront h-5 w-5" />}
          </Avatar>
          {selectedUnit.value?.name ?? "All units"}
          <i className="mdi-unfold-more-horizontal ml-3 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search by name" />
            <CommandItem
              onSelect={() => {
                selectedUnit.value = null;
                globalThis.location.href = "/";
                open.value = false;
              }}
              className="text-sm"
            >
              <Avatar className="mr-2 h-5 w-5">
                <i className="mdi-storefront h-5 w-5" />
              </Avatar>
              All units
              <i
                className={cn(
                  "mdi-check ml-auto h-4 w-4",
                  selectedUnit.value === null ? "opacity-100" : "opacity-0",
                )}
              />
            </CommandItem>
            <CommandEmpty>No unit found.</CommandEmpty>
            {groups.map((group) => (
              <CommandGroup key={group.name} heading={group.name}>
                {group.items.map((item) => (
                  <CommandItem
                    key={item.id}
                    onSelect={() => onSelect(item)}
                    className="text-sm"
                  >
                    <Avatar className="mr-2 h-5 w-5">
                      <AvatarImage
                        src={item.image}
                        alt={item.name}
                        className="grayscale"
                      />
                      <AvatarFallback>
                        {selectedUnit.value?.name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    {item.name}
                    <i
                      className={cn(
                        "mdi-check ml-auto h-4 w-4",
                        selectedUnit.value?.id === item.id
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  open.value = false;
                  globalThis.location.href = "/units";
                }}
              >
                <i className="mdi-plus-circle-outline mr-2 h-5 w-5" />
                Create Unit
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export function Cards(props: { data: Metrics; unit: Unit }) {
  const { amount, count, units } = props.data;
  const activeCount = props.unit ? count.ofUnit : count.all;
  const unitAverageValue = props.unit
    ? amount.ofUnit / count.ofUnit
    : amount.all / count.all;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">
            Units
          </CardTitle>
          <div className="w-4 h-4 mdi-tag text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {activeCount}
          </div>
          <p className="text-xs text-muted-foreground">
            <span className="text-primary">
              {toPercent(activeCount / count.all)}
            </span>{" "}
            of all units
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">
            Units delivered
          </CardTitle>
          <div className="w-4 h-4 mdi-currency-usd text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{count.ofUnit}</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-primary">
              {toPercent(count.perStatus.delivered / count.all)}
            </span>{" "}
            of all units
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">
            Units delivered amount
          </CardTitle>
          <div className="w-4 h-4 mdi-currency-usd text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{toUSD(amount.ofUnit)}</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-primary">
              {toPercent(amount.perStatus.delivered / amount.all)}
            </span>{" "}
            of all units
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">
            Unit average value
          </CardTitle>
          <div className="w-4 h-4 mdi-currency-usd-circle text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{toUSD(unitAverageValue)}</div>
          <p className="text-xs text-muted-foreground">
            {/* {props.unit ? "of unit units" : "of all units"} */}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export function ChartUnitsPerMonth(props: { data: Metrics }) {
  const { unitsPerMonth = [] } = props.data;
  const data = unitsPerMonth.map((d) => ({ ...d, amount: Number(d.amount) }));

  return (
    <Plot.Figure
      options={{
        x: { tickFormat: Plot.formatMonth(), ticks: 12 },
        marks: [
          Plot.barY(data, { x: "month", y: "amount", tip: true }),
          Plot.ruleY([0]),
        ],
      }}
    />
  );
}

export function ChartUnitsPerStatus(props: { data: Metrics }) {
  const { units } = props.data;
  const data = units.map((d) => ({ ...d, amount: Number(d.amount) }));

  return (
    <Plot.Figure
      options={{
        color: { legend: true },
        marks: [
          Plot.barY(
            data,
            Plot.groupX({ y: "count" }, {
              x: "status",
              fill: "status",
              tip: true,
            }),
          ),
          Plot.ruleY([0]),
        ],
      }}
    />
  );
}

export function ChartUnitsThroughTime(props: { data: Metrics }) {
  const { unitsAmountThroughTime = [] } = props.data;
  const currentYear = new Date().getFullYear();
  const data = unitsAmountThroughTime.map((d) => ({
    createdAt: new Date(d.createdAt),
    amount: Number(d.amount),
  }));
  return (
    <Plot.Figure
      options={{
        marks: [
          Plot.lineX(data, { x: "createdAt", y: "amount", tip: true }),
          Plot.crosshair(data, { x: "createdAt", y: "amount" }),
        ],
      }}
    />
  );
}

function PlotPlaceholder() {
  return (
    <div className="text-muted-foreground text-center">
      No units created yet
    </div>
  );
}
