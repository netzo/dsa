import { Badge } from "netzo/components/badge.tsx";
import {
  TableActionsReload,
  TableFilters,
  TablePagination,
  TableRowActions,
  TableSearch,
  TableView,
  TableViewOptions,
  useTable,
} from "netzo/components/blocks/table/table.tsx";
import { Button } from "netzo/components/button.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "netzo/components/card.tsx";
import type { Facility } from "../../database/facilities.ts";
import { FACILITY_TYPES, getFacility } from "../../database/facilities.ts";
import { getDay, toHslColor } from "../../database/mod.ts";

export function PageFacilities(props: { facilities: Facility[] }) {
  const table = useTable<Facility>(props.facilities, {
    endpoint: "/api/facilities",
    idField: "id",
    search: {
      column: "name",
      placeholder: "Buscar por nombre...",
    },
    sorting: [
      { id: "updatedAt", desc: true },
      { id: "name", desc: false },
    ],
    filters: [
      {
        column: "type",
        title: "Tipo",
        options: [...new Set(props.facilities.map((item) => item.type).flat())]
          .sort()
          .map((
            value,
          ) => (value
            ? { label: FACILITY_TYPES?.[value], value }
            : { label: "*no data", value: "" })
          ),
      },
    ],
    columns: [
      {
        id: "actions",
        cell: (props) => (
          <TableRowActions {...props} endpoint="/api/facilities" />
        ),
      },
      {
        accessorKey: "type",
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
      },
    ],
  });

  const onClickCreate = async () => {
    const name = globalThis.prompt("Enter facility name");
    if (name) {
      const response = await fetch(`/api/facilities`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(getFacility({ name })),
      });
      if (response.ok) {
        const data = await response.json();
        globalThis.location.href = `/facilities/${data.id}`;
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
            Crear
          </Button>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto @container">
        <TableView table={table}>
          {(table) => (
            <div className="grid grid-cols-1 @md:grid-cols-2 @xl:grid-cols-3 @3xl:grid-cols-4 @5xl:grid-cols-5 gap-4 p-4">
              {table.getRowModel().rows?.map((row, index) => (
                <a
                  href={`/facilities/${row.original.id}`}
                  key={`card-${index}`}
                >
                  <Card className="w-full hover:bg-accent hover:cursor-pointer">
                    <img
                      src={row.original.image}
                      alt={row.original.name}
                      className="object-cover w-full h-auto"
                    />
                    <div className="grid gap-0.5">
                      <CardHeader>
                        <CardTitle
                          title={row.original.name}
                          className="text-base font-semibold"
                        >
                          {row.original.name}
                        </CardTitle>
                        <CardDescription
                          title={row.original.description}
                          className="text-sm font-normal line-clamp-4"
                        >
                          {row.original.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex items-center justify-between gap-1 text-sm font-medium">
                        <div
                          title={Object.entries(row.original.openingHours)
                            .reduce(
                              (acc, [key, value]) => (
                                acc + `${key}: ${value}\n`
                              ),
                              "",
                            )}
                        >
                          <i className="mdi-clock w-4 h-4 mr-1.5 flex-shrink-0" />
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            {row.original.openingHours?.[getDay()]}
                          </span>
                        </div>
                        <Badge
                          className={`bg-[${toHslColor(row.original.type)}]`}
                        >
                          {FACILITY_TYPES?.[row.original.type]}
                        </Badge>
                      </CardContent>
                    </div>
                  </Card>
                </a>
              ))}
            </div>
          )}
        </TableView>
      </div>
      <footer className="flex items-center justify-between p-4">
        <TablePagination table={table} />
      </footer>
    </div>
  );
}
