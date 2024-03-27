import { useComputed, useSignal } from "@preact/signals";
import { Badge } from "netzo/components/badge.tsx";
import {
  KanbanCardContainer,
  KanbanView,
  type KanbanCardProps,
  type KanbanGroupProps,
  type UseKanbanOptions,
} from "netzo/components/blocks/kanban/kanban.tsx";
import {
  TableActionsReload,
  TableFilters,
  TablePagination,
  TableRowActions,
  TableSearch,
  TableViewOptions,
  useTable,
} from "netzo/components/blocks/table/table.tsx";
import { Button } from "netzo/components/button.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "netzo/components/card.tsx";
import { ScrollArea } from "netzo/components/scroll-area.tsx";
import { cn } from "netzo/components/utils.ts";
import { SortableContext } from "netzo/deps/@dnd-kit/sortable.ts";
import { getUnit, type Unit } from "../../database/units.ts";

export const GROUPS: UseKanbanOptions<Unit>["group"]["groups"] = [
  {
    "id": "pending",
    "title": "En Fila",
    "icon": { "className": "i-mdi-circle-outline bg-lightgrey-500" },
    "badge": { "className": "bg-lightgrey-500" },
  },
  {
    "id": "disassembly",
    "title": "Desarmado",
    "icon": { "className": "i-mdi-circle-slice-1 bg-orange-300" },
    "badge": { "className": "bg-orange-300" },
  },
  {
    "id": "cutting",
    "title": "Corte",
    "icon": { "className": "i-mdi-circle-slice-2 bg-lightorange-500" },
    "badge": { "className": "bg-lightorange-500" },
  },
  {
    "id": "armoring",
    "title": "Blindaje",
    "icon": { "className": "i-mdi-circle-slice-3 bg-yellow-500" },
    "badge": { "className": "bg-yellow-500" },
  },
  {
    "id": "painting",
    "title": "Pintura",
    "icon": { "className": "i-mdi-circle-slice-4 bg-lightblue-500" },
    "badge": { "className": "bg-lightblue-500" },
  },
  {
    "id": "assembly",
    "title": "Armado",
    "icon": { "className": "i-mdi-circle-slice-5 bg-blue-500" },
    "badge": { "className": "bg-blue-500" },
  },
  {
    "id": "quality",
    "title": "Calidad",
    "icon": { "className": "i-mdi-circle-slice-6 bg-lime-500" },
    "badge": { "className": "bg-lime-500" },
  },
  {
    "id": "delivered",
    "title": "Entregado",
    "icon": { "className": "i-mdi-check-circle bg-cyan-500" },
    "badge": { "className": "bg-green-500" },
  },
];

export function PageUnits(props: { units: Unit[] }) {
  const table = useTable<Unit>(props.units, {
    endpoint: "/api/units",
    idField: "id",
    search: {
      column: "name",
      placeholder: "Search by name...",
    },
    filters: [],
    columns: [],
    group: {
      column: "status",
      groups: GROUPS,
    },
  });

  const onClickCreate = async () => {
    const name = globalThis.prompt("Enter unit name");
    if (name) {
      const response = await fetch(`/api/units`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(getUnit({ name })),
      });
      if (response.ok) {
        const data = await response.json();
        globalThis.location.href = `/units/${data.id}`;
      }
    }
  };

  return (
    <div className="grid grid-rows-[min-content_auto_min-content]">
      <header className="flex items-center justify-between p-4">
        <div className="flex items-center flex-1 space-x-2">
          <TableActionsReload table={table} />
          <TableSearch table={table} />
          <TableFilters table={table} />
        </div>
        <div className="flex items-center space-x-2">
          <TableViewOptions table={table} />
          <Button
            variant="default"
            className="ml-2"
            onClick={onClickCreate}
          >
            Create
          </Button>
        </div>
      </header>
      <div className="overflow-y-auto">
        <KanbanView
          table={table}
          renderGroup={(props) => <KanbanGroup {...props} />}
          renderCard={(props) => <KanbanCard {...props} />}
        />
      </div>
      <footer className="flex items-center justify-between p-4">
        <TablePagination table={table} />
      </footer>
    </div>
  );
}

// adapted from https://github.com/Georgegriff/react-dnd-kit-tailwind-shadcn-ui/blob/main/src/components/BoardGroup.tsx
function KanbanGroup({
  group,
  items,
  isOverlay,
  options,
  renderCard,
}: KanbanGroupProps) {
  const selected = useSignal<string[]>([]);

  const itemsIds = useComputed(() =>
    items.map((item) => item[options.idField])
  );

  const itemsAmount = useComputed(() =>
    items.reduce((acc, item) => acc + Number(item.amount), 0)
  );

  return (
    <Card className="h-full self-baseline w-[300px] max-w-full flex flex-col flex-shrink-0 snap-center">
      <CardHeader className="flex flex-row items-center py-2 px-4 font-semibold text-left border-b-2 justify-between">
        <div className="flex flex-1 items-center">
          <div
            {...group?.icon}
            className={cn("w-6 h-6 mr-3", group?.icon?.className)}
          />
          <h3 className="mt-0">{group.title}</h3>
        </div>
        <span className="text-sm font-medium">
          {Number(itemsAmount.value).toLocaleString("en-US", {
            style: "currency",
            currency: items?.[0]?.currencyCode || "USD",
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          })}
        </span>
      </CardHeader>
      <ScrollArea>
        <CardContent className="flex flex-col flex-grow gap-2 p-2 min-h-[150px]">
          <SortableContext items={itemsIds.value}>
            {items.map((item, index) => renderCard({ item, options }))}
          </SortableContext>
        </CardContent>
      </ScrollArea>
    </Card>
  );
}

// see "Calling children as a function" from https://stackoverflow.com/a/32371612
function KanbanCard({ item, isOverlay, options }: KanbanCardProps) {
  const groupBy = options.group.column;

  const { badge } = options.group.groups.find((c) => c.id === item?.[groupBy]);

  return (
    <KanbanCardContainer {...{ item, isOverlay, options }}>
      {({
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
      }) => (
        <>
          {item?.image && (
            <img
              src={item.image}
              className="w-full h-auto p-1"
            />
          )}
          <CardHeader className="relative flex flex-row items-center px-3 py-1 justify-between">
            <div className="flex flex-1 items-center">
              <Button
                variant={"ghost"}
                {...attributes}
                {...listeners}
                className="h-auto p-1 -ml-2 text-secondary-foreground/50 cursor-grab"
              >
                <span className="sr-only">Move item</span>
                <div className="w-6 h-6 mdi-drag" />
              </Button>
              <CardTitle className="ml-1 text-sm font-medium">
                <a
                  href={`/units/${item.id}`}
                  className="whitespace-nowrap text-center font-medium text-primary hover:underline"
                >
                  {item?.name}
                </a>
              </CardTitle>
            </div>
            <TableRowActions
              row={{ original: item }}
              endpoint="/api/units"
              className={cn("h-auto p-1 -mr-2 text-secondary-foreground/50")}
            />
          </CardHeader>
          <CardContent className="flex flex-col gap-2 px-4 pt-2 pb-4 text-xs whitespace-pre-wrap text-secondary-foreground">
            {item?.description}
            <div className="flex items-center justify-between w-full">
              <Badge
                variant={"outline"}
                {...badge}
                className={cn("font-medium", badge?.className)}
              >
                {item?.[groupBy]}
              </Badge>
              <span className="font-medium">
                {Number(item?.amount).toLocaleString("en-US", {
                  style: "currency",
                  currency: item?.currencyCode || "USD",
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          </CardContent>
        </>
      )}
    </KanbanCardContainer>
  );
}
