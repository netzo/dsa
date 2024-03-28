import type { Order } from "@/mod.ts";
import { getOrder, toDateTime } from "@/mod.ts";
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
import { IconCopy } from "netzo/components/icon-copy.tsx";

export function PageOrders(props: { orders: Order[] }) {
  const table = useTable<Order>(props.orders, {
    endpoint: "/api/orders",
    idField: "id",
    search: {
      column: "orderNumber",
      placeholder: "Buscar por numero de accion...",
    },
    sorting: [
      { id: "orderNumber", desc: false },
      { id: "updatedAt", desc: true },
    ],
    filters: [],
    columns: [
      {
        id: "actions",
        cell: (props) => <TableRowActions {...props} endpoint="/api/orders" />,
      },
      {
        accessorKey: "orderNumber",
        header: (props) => (
          <TableColumnHeader {...props} title="Número de Orden" />
        ),
        cell: ({ row }) => {
          const { id, orderNumber } = row.original;

          return (
            <div className="flex items-center py-1">
              <a
                href={`/orders/${id}`}
                className="whitespace-nowrap text-center font-medium text-primary hover:underline"
              >
                <Avatar className="h-7 w-7 mr-3">
                  <AvatarFallback className="text-white bg-[#16a34a]">
                    {orderNumber}
                  </AvatarFallback>
                </Avatar>
              </a>
              <IconCopy value={id} tooltip="Copy ID" />
            </div>
          );
        },
      },
      {
        accessorKey: "user",
        header: (props) => <TableColumnHeader {...props} title="User" />,
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
  });

  const onClickCreate = async () => {
    const ordernumber = globalThis.prompt("Ingresa el numero de accion");
    if (ordernumber) {
      const response = await fetch(`/api/orders`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(getOrder({ ordernumber })),
      });
      if (response.ok) {
        const data = await response.json();
        globalThis.location.href = `/orders/${data.id}`;
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
