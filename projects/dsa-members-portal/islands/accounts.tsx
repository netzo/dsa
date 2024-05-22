import type { Account } from "@/mod.ts";
import { getAccount, toDateTime } from "@/mod.ts";
import { Avatar, AvatarFallback } from "netzo/components/avatar.tsx";
import { Badge } from "netzo/components/badge.tsx";
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
import { IconCopy } from "netzo/components/icon-copy.tsx";
import { useState } from "preact/hooks";

export function PageAccounts(props: { accounts: Account[] }) {
  // table requires useState for data (useSignal/signal not supported)
  const [data, setData] = useState<Account[]>(props.accounts ?? []);

  const table = useTable<Account>({
    data,
    columns: [
      {
        id: "actions",
        cell: (props) => (
          <TableRowActions {...props} endpoint="/api/accounts" />
        ),
      },
      {
        accessorKey: "accountNumber",
        header: (props) => (
          <TableColumnHeader {...props} title="Número de Cuenta" />
        ),
        cell: ({ row }) => {
          const { id, accountNumber } = row.original;

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
      },
      {
        accessorKey: "users",
        header: (props) => <TableColumnHeader {...props} title="Usuarios" />,
        cell: ({ row }) => {
          const { users = [] } = row.original;
          return (
            <a
              href={`/accounts/${row.original.id}/users`}
              className="hover:underline"
            >
              <Badge variant="secondary" className="w-max">
                <i className="mdi-radiobox-marked mr-1" />
                {users.length} socios
              </Badge>
            </a>
          );
        },
      },
      {
        accessorKey: "user",
        header: (props) => <TableColumnHeader {...props} title="Usuario" />,
        cell: ({ row }) => {
          const { email, phone } = row.original;
          return (
            <div className="flex gap-2">
              {email && (
                <a
                  href={`mailto:${email}`}
                  title={email}
                  target="_blank"
                  className="mdi-email"
                />
              )}
              {phone && (
                <a
                  href={`tel:${phone}`}
                  title={email}
                  target="_blank"
                  className="mdi-phone"
                />
              )}
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
    // NOTE: columnVisibility, search, sorting, and filters use table.getColumn() and MUST
    // reference nested columns with underscore syntax (e.g. "data.name" is "data_name")
    initialState: {
      search: {
        column: "accountNumber",
        placeholder: "Buscar por numero de accion...",
      },
      sorting: [
        { id: "accountNumber", desc: false },
        { id: "updatedAt", desc: true },
      ],
      filters: [],
    },
    meta: {}
  });

  const onClickCreate = async () => {
    const accountnumber = globalThis.prompt("Ingresa el numero de accion");
    if (accountnumber) {
      const response = await fetch(`/api/accounts`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(getAccount({ accountnumber })),
      });
      if (response.ok) {
        const data = await response.json();
        globalThis.location.href = `/accounts/${data.id}`;
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
