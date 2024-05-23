import { getSession, type Session, toDateTime } from "@/mod.ts";
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
import { IconCopy } from "netzo/components/icon-copy.tsx";
import { useState } from "preact/hooks";

export function PageSessions(props: { sessions: Session[] }) {
  // table requires useState for data (useSignal/signal not supported)
  const [data, setData] = useState<Session[]>(props.sessions ?? []);

  const table = useTable<Session>({
    data,
    columns: [
      {
        id: "actions",
        cell: (props) => (
          <TableRowActions {...props} endpoint="/api/sessions" />
        ),
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
                href={`/sessions/${id}`}
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
        accessorKey: "sportId",
        header: (props) => (
          <TableColumnHeader
            {...props}
            title="Deporte"
          />
        ),
        cell: ({ row }) => {
          const { id, name = "", image } = row.original.sport ?? {};
          return (
            <div className="flex items-center py-1">
              <Avatar className="h-7 w-7 mr-3">
                <AvatarImage src={image} />
                <AvatarFallback>{name[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
              <a
                href={`/sports/${id}`}
                className="whitespace-nowrap text-center font-medium text-primary hover:underline"
              >
                {name}
              </a>
              <IconCopy value={id} tooltip="Copy ID" />
            </div>
          );
        },
        filterFn: (row, id, value) =>
          value.includes(row.getValue(id)),
      },
      {
        accessorKey: "phones",
        header: (props) => <TableColumnHeader {...props} title="Telefonos" />,
        cell: ({ row }) => {
          const { phones = {} } = row.original;
          const ICONS = {
            work: "mdi-phone",
            mobile: "mdi-cellphone",
            personal: "mdi-cellphone-lock",
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
            personal: "mdi-email-lock",
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
          column: "sportId",
          title: "Deporte",
          options: [...new Set(props.sessions.map((item) => item.sport).flat())]
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
    },
    meta: {},
  });

  const onClickCreate = async () => {
    const name = globalThis.prompt("Enter session name");
    if (name) {
      const response = await fetch(`/api/sessions`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(getSession({ name })),
      });
      if (response.ok) {
        const data = await response.json();
        globalThis.location.href = `/sessions/${data.id}`;
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
