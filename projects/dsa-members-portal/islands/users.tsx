import { getPublication, getUser, toDateTime, User } from "@/mod.ts";
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
import { Combobox } from "netzo/components/combobox.tsx";
import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "netzo/components/dialog.tsx";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "netzo/components/form.tsx";
import { IconCopy } from "netzo/components/icon-copy.tsx";
import { Input } from "netzo/components/input.tsx";

export function PageUsers(props: { users: User[] }) {
  const table = useTable<User>(props.users, {
    endpoint: "/api/users",
    idField: "id",
    search: {
      column: "name",
      placeholder: "Buscar por nombre...",
    },
    sorting: [
      { id: "updatedAt", desc: true },
      { id: "name", desc: false },
      { id: "accountNumber", desc: true },
    ],
    filters: [
      {
        column: "accountId",
        title: "Cuenta",
        options: [...new Set(props.users.map((item) => item.account).flat())]
          .sort()
          .map(
            (
              value,
            ) => (value
              ? { label: value.name, value: value.id }
              : { label: "*no data", value: "" }),
          ),
      },
    ],
    columns: [
      {
        id: "actions",
        cell: (props) => <TableRowActions {...props} endpoint="/api/users" />,
      },
      {
        accessorKey: "name",
        header: (props) => <TableColumnHeader {...props} title="Nombre" />,
        cell: ({ row }) => {
          const { id, name = "", image } = row.original;
          return (
            <div className="flex items-center py-1">
              <Avatar className="h-7 w-7 mr-3">
                <AvatarImage src={image} />
                <AvatarFallback>{name[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
              <a
                href={`/users/${id}`}
                className="whitespace-nowrap text-center font-medium text-primary hover:underline"
              >
                {name}
              </a>
              <IconCopy value={id} tooltip="Copy ID" />
            </div>
          );
        },
      },
      {
        accessorKey: "accountId",
        header: (props) => (
          <TableColumnHeader {...props} title="Número de Cuenta" />
        ),
        cell: ({ row }) => {
          if (!row.original.account) return null;
          const { id, accountNumber } = row.original.account ?? {};

          return (
            <div className="flex items-center py-1">
              <a
                href={`/accounts/${id}`}
                className="whitespace-nowrap text-center font-medium text-primary hover:underline"
              >
                <Avatar className="h-7 w-7 mr-3">
                  <AvatarFallback className="text-white bg-[#16a34a]">
                    {accountNumber}
                  </AvatarFallback>
                </Avatar>
              </a>
              <IconCopy value={id} tooltip="Copy ID" />
            </div>
          );
        },
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
      },
      {
        accessorKey: "phones",
        header: (props) => <TableColumnHeader {...props} title="Telefonos" />,
        cell: ({ row }) => {
          const { phones = {} } = row.original;
          const ICONS = {
            work: "mdi-phone",
            mobile: "mdi-cellphone",
            useral: "mdi-cellphone-lock",
          } as const;
          const items = Object.entries(phones)
            .filter(([name, value]) => value)
            .map(([name, value]) => ({ name, value, className: ICONS[name] }));
          return (
            <div className="flex gap-1">
              {items.map((item, index) => (
                <a
                  key={`phone-${index}`}
                  href={`tel:${item.value}`}
                  target="_blank"
                  title={`${item.name}: ${item.value}`}
                  className={item.className}
                />
              ))}
            </div>
          );
        },
      },
      {
        accessorKey: "emails",
        header: (props) => <TableColumnHeader {...props} title="Emails" />,
        cell: ({ row }) => {
          const { emails = {} } = row.original;
          const ICONS = {
            work: "mdi-email",
            useral: "mdi-email-lock",
          } as const;
          const items = Object.entries(emails)
            .filter(([name, value]) => value)
            .map(([name, value]) => ({ name, value, className: ICONS[name] }));
          return (
            <div className="flex gap-1">
              {items.map((item, index) => (
                <a
                  key={`mail-${index}`}
                  href={`mailto:${item.value}`}
                  target="_blank"
                  title={`${item.name}: ${item.value}`}
                  className={item.className}
                />
              ))}
            </div>
          );
        },
      },
      {
        accessorKey: "updatedAt",
        header: (props) => (
          <TableColumnHeader {...props} title="Actualizado en" />
        ),
        cell: ({ row }) => {
          const { updatedAt } = row.original;
          return <div>{toDateTime(updatedAt)}</div>;
        },
      },
    ],
  });

  const onClickCreate = async () => {
    const name = globalThis.prompt("Enter user name");
    if (name) {
      const response = await fetch(`/api/users`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(getUser({ name })),
      });
      if (response.ok) {
        const data = await response.json();
        globalThis.location.href = `/users/${data.id}`;
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
      <div className="overflow-y-auto">
        <div className="border rounded-md mx-4">
          <TableView table={table} />
        </div>
      </div>
      <footer className="flex items-center justify-between p-4">
        <TablePagination table={table} />
      </footer>
    </div>
  );
}

export function FormCreateUser(props: { defaultValues: User }) {
  const form = useForm<User>({
    defaultValues: getUser(props.defaultValues),
  });

  const onSubmit = async (data: User) => {
    const response = await fetch(`/api/users`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(getPublication(data)),
    });

    if (response.ok) globalThis.location.reload();
  };

  // NOTE: must manually invoke submit because submit button isteleported
  // by dialog out of form (see https://github.com/shadcn-ui/ui/issues/709)
  return (
    <>
      <DialogHeader className="text-left">
        <DialogTitle>
          Crear Usuario
        </DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form
          id="users.create"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado</FormLabel>
                <FormControl>
                  <Combobox
                    {...field}
                    options={[
                      "waiting",
                      "won",
                      "rescheduled",
                      "cancelled",
                    ].map((value) => ({
                      label: value,
                      value,
                    }))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cantidad</FormLabel>
                <FormControl>
                  <Input {...field} type="number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>

      <DialogFooter>
        <Button form="users.create" type="submit">
          {form.formState.isLoading
            ? <i className="mdi-loading h-4 w-4 animate-spin" />
            : "Create"}
        </Button>
      </DialogFooter>
    </>
  );
}
