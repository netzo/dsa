import { type Statement, toDateTime, toMXN, useTableUtils } from "@/mod.ts";
import { STATEMENT_TYPE_OPTIONS } from "@/utils/constants.ts";
import { useSignal } from "@preact/signals";
import {
  TableActionsReload,
  TableColumnHeader,
  TableFilters,
  TablePagination,
  TableSearch,
  TableView,
  TableViewOptions,
  useTable,
} from "netzo/components/blocks/table/table.tsx";
import { Button } from "netzo/components/button.tsx";
import { IconCopy } from "netzo/components/icon-copy.tsx";
import { cn } from "netzo/components/utils.ts";
import { useState } from "preact/hooks";

export function CardStatements(props: { statements: Statement[] }) {
  // table requires useState for data (useSignal/signal not supported)
  const [data, setData] = useState<Statement[]>(props.statements ?? []);
  const active = useSignal<Statement>({});

  const {
    create,
    update,
    duplicate,
    remove,
    copyId,
    downloadAsCsv,
  } = useTableUtils<Statement>({
    endpoint: "/database/statements",
    data,
    setData,
    active,
    getDefault: () => ({}),
  });

  const table = useTable<Statement>({
    data,
    columns: [
      {
        accessorKey: "type",
        title: "Tipo",
        header: (props) => <TableColumnHeader {...props} />,
        cell: ({ row }) => {
          const { id } = row.original;
          return (
            <div className="flex items-center py-1 ml-3">
              <a
                href={`/statements/${id}`}
                className="whitespace-nowrap text-center font-medium text-primary hover:underline"
              >
                {id}
              </a>
              <IconCopy value={id} tooltip="Copy ID" />
            </div>
          );
        },
      },
      {
        accessorKey: "tipo",
        title: "Tipo",
        header: (props) => <TableColumnHeader {...props} />,
        cell: ({ row }) => {
          const { type } = row.original;
          if (!type) return null;
          const props = STATEMENT_TYPE_OPTIONS.find(({ id }) => id === type);
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
        accessorKey: "createdAt",
        title: "Fecha y hora",
        header: (props) => <TableColumnHeader {...props} />,
        cell: ({ row }) => {
          const { createdAt = "" } = row.original;
          return (
            <div className="flex items-center p-1">
              <span className="w-max">{toDateTime(createdAt)}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "amount",
        title: "Total",
        header: (props) => <TableColumnHeader {...props} />,
        cell: ({ row }) => {
          const { amount } = row.original;
          return (
            <div className="ml-auto text-sm font-semibold tracking-wider">
              {toMXN(amount)}
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
      filters: [],
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
              downloadAsCsv(data, "statements");
            }}
          >
            <i className="mdi-download" />
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
