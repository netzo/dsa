import type { Publication } from "@/mod.ts";
import { getPublication, PUBLICATION_TYPES, toHslColor } from "@/mod.ts";
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
import { useState } from "preact/hooks";

export function PagePublications(props: { publications: Publication[] }) {
  // table requires useState for data (useSignal/signal not supported)
  const [data, setData] = useState<Publication[]>(props.publications ?? []);

  const table = useTable<Publication>({
    data,
    columns: [
      {
        id: "actions",
        cell: (props) => (
          <TableRowActions {...props} endpoint="/api/publications" />
        ),
      },
      {
        accessorKey: "type",
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
      },
    ],
    // NOTE: columnVisibility, search, sorting, and filters use table.getColumn() and MUST
    // reference nested columns with underscore syntax (e.g. "data.name" is "data_name")
    initialState: {
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
          options: [
            ...new Set(props.publications.map((item) => item.type).flat()),
          ]
            .sort()
            .map((
              value,
            ) => (value
              ? { label: ({/* TODO */})?.[value] ?? value, value }
              : { label: "*no data", value: "" })
            ),
        },
      ],
    },
    meta: {},
  });

  const onClickCreate = async () => {
    const name = globalThis.prompt("Enter publication name");
    if (name) {
      const response = await fetch(`/api/publications`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(getPublication({ name })),
      });
      if (response.ok) {
        const data = await response.json();
        globalThis.location.href = `/publications/${data.id}`;
      }
    }
  };

  return (
    <div className="grid grid-rows-[min-content_auto_min-content] h-screen">
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
                <Card
                  key={`card-${index}`}
                  className="w-full hover:bg-accent hover:cursor-pointer"
                >
                  <img
                    src={row.original.image}
                    alt={row.original.name}
                    className="object-cover w-full h-[200px]"
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
                      {row.original?.type && (
                        <Badge
                          className={`bg-[${toHslColor(row.original.type)}]`}
                        >
                          {PUBLICATION_TYPES[row.original.type]}
                        </Badge>
                      )}

                      <div className="flex gap-1">
                        {row.original.contact?.email && (
                          <a
                            key={`phone-${row.original.contact.email}`}
                            href={`mailto:${row.original.contact.email}`}
                            target="_blank"
                            title={`email: ${row.original.contact.email}`}
                            className="mdi-email"
                          />
                        )}
                        {row.original.contact?.phone && (
                          <a
                            key={`phone-${row.original.contact.phone}`}
                            href={`phone:${row.original.contact.phone}`}
                            target="_blank"
                            title={`phone: ${row.original.contact.phone}`}
                            className="mdi-phone"
                          />
                        )}
                      </div>
                    </CardContent>
                  </div>
                </Card>
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
