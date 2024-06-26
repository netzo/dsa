import { toQRCode, useTableUtils, type Vehicle } from "@/mod.ts";
import { ENTRY_TYPE_OPTIONS, VEHICLE_TYPE_OPTIONS } from "@/utils/constants.ts";
import { useSignal } from "@preact/signals";
import { Avatar, AvatarFallback } from "netzo/components/avatar.tsx";
import {
  TableActionsReload,
  TableColumnHeader,
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
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "netzo/components/card.tsx";
import {
  Dialog,
  DialogContent,
  DialogContentControlled,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "netzo/components/dialog.tsx";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "netzo/components/dropdown-menu.tsx";
import { FormFieldInput } from "netzo/components/form-fields.tsx";
import { Form, useForm } from "netzo/components/form.tsx";
import { cn } from "netzo/components/utils.ts";
import type { ComponentChildren } from "preact";
import { useState } from "preact/hooks";

export function CardVehicles(props: { vehicles: Vehicle[] }) {
  // table requires useState for data (useSignal/signal not supported)
  const [data, setData] = useState<Vehicle[]>(props.vehicles ?? []);
  const active = useSignal<Vehicle>({});

  const {
    create,
    update,
    duplicate,
    remove,
    copyId,
    downloadAsCsv,
  } = useTableUtils<Vehicle>({
    endpoint: "/database/vehicles",
    data,
    setData,
    active,
    getDefault: () => ({}),
  });

  const table = useTable<Vehicle>({
    data,
    columns: [
      {
        id: "actions",
        title: "Acciones",
        cell: (props) => {
          const { id } = props.row.original;

          return (
            <div className="flex w-max flex-row items-center justify-left gap-2">
              <TableRowActions>
                <DialogFormVehicle
                  method="PATCH"
                  defaultValues={props.row.original}
                  redirectUrl="/settings?nav=vehicles"
                  cta="Guardar cambios"
                >
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    Editar
                  </DropdownMenuItem>
                </DialogFormVehicle>
                <DropdownMenuItem
                  onSelect={() => duplicate(props.row.original)}
                >
                  Duplicar
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => copyId(props.row.original)}
                >
                  Copiar ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-500"
                  onSelect={() => remove(props.row.original)}
                >
                  Eliminar
                </DropdownMenuItem>
              </TableRowActions>
            </div>
          );
        },
      },
      {
        accessorKey: "name",
        title: "Nombre",
        header: (props) => <TableColumnHeader {...props} />,
        cell: ({ row }) => {
          const { id, data = {} } = row.original;
          return (
            <div className="flex items-center p-1 gap-2">
              <Avatar className="h-7 w-7">
                {/* <AvatarImage src={image} /> */}
                <AvatarFallback>
                  {data?.model?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <a
                href={`/vehicles/${id}`}
                className="whitespace-nowrap text-center font-medium text-primary hover:underline"
              >
                {`${data?.brand} ${data?.model} ${data?.year}`}
              </a>
            </div>
          );
        },
      },
      {
        accessorKey: "type",
        title: "Tipo",
        header: (props) => <TableColumnHeader {...props} />,
        cell: ({ row }) => {
          const { type } = row.original;
          if (!type) return null;
          const props = VEHICLE_TYPE_OPTIONS.find(({ value }) =>
            value === type
          );
          if (!props) return type;
          return (
            <div className={"flex gap-2 items-center justify-center p-1"}>
              <i
                {...props.icon}
                className={cn(props.icon.className, "mb-2px")}
              />
              <span className="w-max">{props.label}</span>
            </div>
          );
        },
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
      },
      {
        accessorKey: "plateNumber",
        title: "Placas",
        header: (props) => <TableColumnHeader {...props} />,
        cell: ({ row }) => {
          const { plateNumber } = row.original;
          if (!plateNumber) return null;
          return (
            <div className="flex items-center p-1">
              <div className="vehicle-plate-number">
                {plateNumber?.toUpperCase()}
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "color",
        title: "Color",
        header: (props) => <TableColumnHeader {...props} />,
        cell: ({ row }) => {
          const { color = "" } = row.original;
          if (!color || color === "") return null;
          return (
            <div
              className={cn(
                "flex w-full items-center justify-center p-1",
              )}
              style={{ backgroundColor: `${color}50` }} // Red color with 50% opacity
              // style={{ backgroundColor: `${color}50` }} // Red color with 50% opacity
            >
              <span className="w-max">
                {color}50
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "actionQrcode",
        title: "Código QR",
        header: (props) => <TableColumnHeader {...props} />,
        cell: ({ row }) => {
          const { id, createdAt = "" } = row.original;
          const url = toQRCode(
            `${globalThis?.location?.origin}/vehicles/${id}`,
          );
          return (
            <div className="flex items-center justify-center p-1">
              <Dialog>
                <DialogTrigger asChild>
                  <img
                    className="w-8 h-8 cursor-pointer"
                    src={url}
                  />
                </DialogTrigger>
                <DialogContent>
                  <CardHeader>
                    <CardTitle>
                      Código QR
                    </CardTitle>
                    <CardDescription>
                      El código QR es único y no debe ser compartido. Este
                      código QR es válido por 24 horas a partir de su
                      generación.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <img
                      src={url}
                      style="width: 250px; height: 250px; margin: auto;"
                    />
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      onClick={() => {
                        globalThis?.navigator?.canShare({
                          title: "Código QR",
                          text: "Código QR",
                          url,
                        });
                      }}
                    >
                      Compartir
                    </Button>
                  </CardFooter>
                </DialogContent>
              </Dialog>
            </div>
          );
        },
      },
    ],
    // NOTE: columnVisibility, search, sorting, and filters use table.getColumn() and MUST
    // reference nested columns with underscore syntax (e.g. "data.name" is "data_name")
    initialState: {
      search: {
        column: "plateNumber",
        placeholder: "Filtrar por placa...",
      },

      sorting: [
        { id: "plateNumber", desc: false },
      ],
      filters: [
        {
          column: "type",
          title: "Tipo",
          options: ENTRY_TYPE_OPTIONS.map(({ value, label }) => ({
            value,
            label,
          })),
        },
        {
          column: "vehicle",
          title: "Vehículo",
          options: VEHICLE_TYPE_OPTIONS.map(({ value, label }) => ({
            value,
            label,
          })),
        },
      ],
    },
    meta: {
      setData,
      create,
      update,
      remove,
      duplicate,
      copyId,
      downloadAsCsv,
    },
  });

  return (
    <div className="grid grid-rows-[min-content_auto_min-content]">
      <header className="flex items-center justify-between pb-2">
        <div className="flex items-center flex-1 space-x-2">
          <TableActionsReload table={table} />
          <TableSearch table={table} />
          <TableFilters table={table} />
        </div>
        <div className="flex items-center space-x-2">
          <TableViewOptions table={table} />
          <DialogFormVehicle
            method="POST"
            defaultValues={{}}
            redirectUrl="/settings?nav=vehicles"
          >
            <Button variant="default" size="sm" className="ml-2">
              <i className="i-mdi-plus" />
            </Button>
          </DialogFormVehicle>
          <Button
            variant="outline"
            size="sm"
            title="Descargar CSV"
            className="text-[#44C082] border-[#44C082] ml-2"
            disabled={false}
            onClick={() => {
              const data = table.getFilteredRowModel().rows.map((r) =>
                r.original
              );
              downloadAsCsv(data, "vehicles");
            }}
          >
            <i className="i-mdi-download" />
          </Button>
        </div>
      </header>
      <div className="border rounded-md">
        <TableView table={table} />
      </div>
      <footer className="flex items-center justify-between">
        <TablePagination table={table} />
      </footer>
    </div>
  );
}

export function DialogFormVehicle(
  props: {
    method: "POST" | "PATCH";
    defaultValues: Vehicle | Vehicle;
    redirectUrl?: string;
    children: ComponentChildren;
    cta?: string;
  },
) {
  const [open, setOpen] = useState(false);
  const redirect = props.redirectUrl || "/vehicles";

  const form = useForm<Vehicle>({ defaultValues: props.defaultValues });

  const url = props.method === "PATCH"
    ? `/database/vehicles/${props.defaultValues.id}`
    : "/database/vehicles";
  const id = props.method === "PATCH" ? "vehicles.patch" : "vehicles.create";

  const onSubmit = async ({
    vehicles,
    ...data
  }: Vehicle) => {
    if (props.method === "PATCH") delete data.id;
    await fetch(url, {
      method: props.method,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    });
    setOpen(false);
    globalThis.location.href = `${redirect}`;
  };

  // NOTE: must manually invoke submit because submit button isteleported
  // by dialog out of form (see https://github.com/shadcn-ui/ui/issues/709)
  // WORKAROUND: use controlled <DialogContentControlled /> variant to prevent
  // dialog from closing when interacting with form elements like Select, Combobox...
  return (
    <Dialog open={open} onOpenChange={() => !open && setOpen(true)}>
      <DialogTrigger asChild>
        {props.children}
      </DialogTrigger>
      <DialogContentControlled
        className="sm:max-w-[625px] overflow-auto max-h-screen"
        onClickClose={() => setOpen(false)}
      >
        <DialogHeader className="text-left">
          <DialogTitle>
            {props.method === "POST" && (
              <DialogTitle>
                Registrar nuevo cliente
              </DialogTitle>
            )}
            {props.method === "PATCH" && (
              <DialogTitle>
                Editar cliente
              </DialogTitle>
            )}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            id={id}
            onSubmit={form.handleSubmit(onSubmit)}
            onReset={() => form.reset(props.defaultValues)}
          >
            <FormFieldInput
              name="accountId"
              form={form}
              type="hidden"
            />
            <FormFieldInput
              name="data.brand"
              label="Marca"
              form={form}
            />
            <FormFieldInput
              name="data.model"
              label="Modelo"
              form={form}
            />
            <FormFieldInput
              name="data.year"
              label="Año"
              form={form}
              type="number"
            />
            <FormFieldInput
              name="data.color"
              label="Color"
              form={form}
              type="color"
            />
            <FormFieldInput
              name="plateNumber"
              label="Placas"
              form={form}
            />
          </form>
        </Form>

        <DialogFooter>
          <Button form={id} type="submit">
            {form.formState.isLoading
              ? <i className="i-mdi-loading h-4 w-4 animate-spin" />
              : (
                props?.cta || "Crear"
              )}
          </Button>
        </DialogFooter>
      </DialogContentControlled>
    </Dialog>
  );
}
