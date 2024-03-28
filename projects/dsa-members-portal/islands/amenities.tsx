import type { Amenity } from "@/mod.ts";
import { AMENITY_TYPES, getBooking, toHslColor } from "@/mod.ts";
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
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "netzo/components/dialog.tsx";
import { cn } from "netzo/components/utils.ts";
import { FormCreateBooking } from "./bookings.tsx";

export function PageAmenities(props: { amenities: Amenity[] }) {
  const table = useTable<Amenity>(props.amenities, {
    endpoint: "/api/amenities",
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
        column: "data_type",
        title: "Tipo",
        options: [
          ...new Set(props.amenities.map((item) => item.data.type).flat()),
        ]
          .sort()
          .map((
            value,
          ) => (value
            ? { label: AMENITY_TYPES?.[value], value }
            : { label: "*no data", value: "" })
          ),
      },
    ],
    columns: [
      {
        id: "actions",
        cell: (props) => (
          <TableRowActions {...props} endpoint="/api/amenities" />
        ),
      },
      {
        accessorKey: "data_type",
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
      },
    ],
  });

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
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default" className="ml-2">
                Crear Reserva
              </Button>
            </DialogTrigger>
            <DialogContent>
              <FormCreateBooking defaultValues={getBooking()} />
            </DialogContent>
          </Dialog>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto @container">
        <TableView table={table}>
          {(table) => (
            <div className="grid grid-cols-1 @md:grid-cols-2 @xl:grid-cols-3 @3xl:grid-cols-4 @5xl:grid-cols-5 gap-4 p-4">
              {table.getRowModel().rows?.map((row, index) => (
                <Dialog>
                  <DialogTrigger asChild>
                    <Card
                      key={`card-${index}`}
                      className="w-full hover:bg-accent hover:cursor-pointer"
                    >
                      <img
                        src={row.original.image}
                        alt={row.original.name}
                        className={cn(
                          ["sport"].includes(row.original.type)
                            ? "h-75px m-4 mb-0"
                            : "object-cover w-full h-[200px]",
                        )}
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
                        {row.original?.data?.type && (
                          <CardContent className="flex items-center justify-between gap-1 text-sm font-medium">
                            <Badge
                              className={`bg-[${toHslColor(row.original.data.type)
                                }]`}
                            >
                              {AMENITY_TYPES?.[row.original.data.type]}
                            </Badge>
                          </CardContent>
                        )}
                      </div>
                    </Card>
                  </DialogTrigger>
                  <DialogContent>
                    <FormCreateBooking defaultValues={props.defaultValues} />
                  </DialogContent>
                </Dialog>
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
