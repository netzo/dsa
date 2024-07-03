import { toQRCode, useTableUtils, type Guest } from "@/mod.ts";
import { USER_STATUS_OPTIONS } from "@/utils/constants.ts";
import { useSignal } from "@preact/signals";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "netzo/components/avatar.tsx";
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

export function CardGuests(props: {
  guests: Guest[];
}) {
  // table requires useState for data (useSignal/signal not supported)
  const [data, setData] = useState<Guest[]>(props.guests ?? []);
  const active = useSignal<Guest>({});

  const {
    create,
    update,
    duplicate,
    remove,
    copyId,
    downloadAsCsv,
  } = useTableUtils<Guest>({
    endpoint: "/datastore/guests",
    data,
    setData,
    active,
    getDefault: () => ({}),
  });

  const table = useTable<Guest>({
    data,
    columns: [
      {
        id: "actions",
        title: "Acciones",
        cell: (props) => {
          const { id } = props.row.original;

          return (
            <div className="flex flex-row items-center justify-center gap-2">
              <TableRowActions>
                <DialogFormGuest
                  method="PATCH"
                  defaultValues={props.row.original}
                  redirectUrl="/settings?nav=guests"
                  cta="Guardar cambios"
                >
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    Editar
                  </DropdownMenuItem>
                </DialogFormGuest>
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
          const { id, name = "", image } = row.original;
          return (
            <div className="flex items-center p-1">
              <Avatar className="h-7 w-7 mr-3">
                <AvatarImage src={image} />
                <AvatarFallback>{name[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex items-center py-1">
                <a
                  href={`/users/${id}`}
                  className="whitespace-nowrap text-center font-medium text-primary hover:underline"
                >
                  {name.toUpperCase()}
                </a>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "email",
        title: "Email",
        header: (props) => <TableColumnHeader {...props} />,
        cell: ({ row }) => {
          const { email = "" } = row.original;
          return (
            <div className="flex items-center p-1">
              <a
                href={`mailto:${email}`}
                target="_blank"
                className="w-max text-blue-500 underline"
              >
                {email?.toLowerCase()}
              </a>
            </div>
          );
        },
      },
      {
        accessorKey: "status",
        title: "Estado",
        header: (props) => <TableColumnHeader {...props} />,
        cell: ({ row }) => {
          const { status } = row.original ?? {};
          if (!status) return null;

          const userStatus = USER_STATUS_OPTIONS.find(
            (option) => option.value === status,
          );

          if (!userStatus) return;

          return (
            <div
              className={cn(
                "flex items-center justify-center p-1 bg-opacity-20",
                userStatus.className,
              )}
            >
              <span className="w-max">
                {userStatus.label}
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
            `${globalThis?.location?.origin}/users/${id}`,
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
        column: "name",
        placeholder: "Filtrar por nombre...",
      },

      sorting: [
        { id: "name", desc: false },
      ],
      filters: [
        {
          column: "status",
          title: "Estado",
          options: USER_STATUS_OPTIONS.map(({ value, label }) => ({
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
          <DialogFormGuest
            method="POST"
            defaultValues={{}}
            redirectUrl="/settings?nav=guests"
          >
            <Button variant="default" size="sm" className="ml-2">
              <i className="i-mdi-plus" />
            </Button>
          </DialogFormGuest>
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
              downloadAsCsv(data, "guests");
            }}
          >
            <i className="i-mdi-download" />
          </Button>
        </div>
      </header>
      <div className="border rounded-md">
        <TableView table={table} />
      </div>
      <footer className="flex items-center justify-between ">
        <TablePagination table={table} />
      </footer>
    </div>
  );
}

export function DialogFormGuest(
  props: {
    method: "POST" | "PATCH";
    defaultValues: Guest | Guest;
    redirectUrl?: string;
    children: ComponentChildren;
    cta?: string;
  },
) {
  const [open, setOpen] = useState(false);
  const redirect = props.redirectUrl || "/guests";

  const form = useForm<Guest>({ defaultValues: props.defaultValues });

  const url = props.method === "PATCH"
    ? `/datastore/guests/${props.defaultValues.id}`
    : "/datastore/guests";
  const id = props.method === "PATCH" ? "guests.patch" : "guests.create";

  const onSubmit = async ({
    customer,
    salesperson,
    ...data
  }: Guest) => {
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
                Registrar nueva sucursal
              </DialogTitle>
            )}
            {props.method === "PATCH" && (
              <DialogTitle>
                Editar sucursal
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
              name="type"
              label="Tipo"
              form={form}
            />
            <FormFieldInput
              name="name"
              label="Nombre"
              form={form}
            />
            <FormFieldInput
              name="status"
              label="Estado"
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
