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
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "netzo/components/navigation-menu.tsx";
import { Separator } from "netzo/components/separator.tsx";
import { cn } from "netzo/components/utils.ts";
import { useState } from "preact/hooks";
import { FormCreateBooking } from "./bookings.tsx";

const links: { title: string; href: string; icon: string }[] = [
  { title: "Servicios", href: "/amenities/services", icon: "i-mdi-room-service" },
  { title: "Deportes", href: "/amenities/sports", icon: "i-mdi-weight-lifter" },
  { title: "Eventos", href: "/amenities/events", icon: "i-mdi-calendar" },
  {
    title: "Gastronomia",
    href: "/amenities/food-and-drinks",
    icon: "i-mdi-food",
  },
];

export function PageAmenities(props: { amenities: Amenity[] }) {
  // table requires useState for data (useSignal/signal not supported)
  const [data, setData] = useState<Amenity[]>(props.amenities ?? []);

  const table = useTable<Amenity>({
    data,
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
    },
    meta: {},
  });

  return (
    <div className="grid grid-rows-[min-content_auto_min-content] h-screen">
      <header className="grid gap-2 p-4">
        <div className="flex items-center justify-between">
          <NavigationMenu>
            <NavigationMenuList>
              {links.map((link, i) => (
                <NavigationMenuItem key={`link-${i}`}>
                  <a href={link.href} className="aria-[current]:text-primary">
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      {link.title}
                    </NavigationMenuLink>
                  </a>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <Separator className="mb-4" />
        <div className="flex items-center justify-between">
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
                              className={`bg-[${
                                toHslColor(row.original.data.type)
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
