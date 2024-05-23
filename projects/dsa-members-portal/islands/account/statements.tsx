import { type Statement, useTableUtils } from "@/mod.ts";

import {
  type Option,
  STATEMENT_TYPE_OPTIONS,
  USER_STATUS_OPTIONS,
} from "@/utils/constants.ts";
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
import {
  Dialog,
  DialogContentControlled,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "netzo/components/dialog.tsx";
import {
  FormFieldCombobox,
  FormFieldInput,
} from "netzo/components/form-fields.tsx";
import { Form, useForm } from "netzo/components/form.tsx";
import type { ComponentChildren } from "preact";
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
          const { type } = row.original;
          if (!type) return null;

          const props = STATEMENT_TYPE_OPTIONS.find(
            (option) => option.value === type,
          );

          if (!props) return;

          return (
            <div
              className={"flex items-center justify-center p-1"}
              style={{ backgroundColor: `${props.hexaColor}50` }}
            >
              <span className="w-max">{props.label}</span>
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
          <DialogFormStatement
            method="POST"
            defaultValues={{}}
            statusOptions={USER_STATUS_OPTIONS}
            redirectUrl="/settings?nav=statements"
          >
            <Button variant="default" size="sm" className="ml-2">
              <i className="mdi-plus" />
            </Button>
          </DialogFormStatement>
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

export function DialogFormStatement(
  props: {
    method: "POST" | "PATCH";
    defaultValues: Statement;
    statusOptions: Option[];
    redirectUrl?: string;
    children: ComponentChildren;
    cta?: string;
  },
) {
  const [open, setOpen] = useState(false);
  const redirect = props.redirectUrl || "/statements";

  const form = useForm<Statement>({ defaultValues: props.defaultValues });

  const url = props.method === "PATCH"
    ? `/database/statements/${props.defaultValues.id}`
    : "/database/statements";
  const id = props.method === "PATCH"
    ? "statements.patch"
    : "statements.create";

  const onSubmit = async ({
    ...data
  }: Statement) => {
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
              name="name"
              label="Nombre"
              form={form}
            />
            <FormFieldCombobox
              name="status"
              label="Estado"
              form={form}
              options={props.statusOptions}
            />
          </form>
        </Form>

        <DialogFooter>
          <Button form={id} type="submit">
            {form.formState.isLoading
              ? <i className="mdi-loading h-4 w-4 animate-spin" />
              : (
                props?.cta || "Crear"
              )}
          </Button>
        </DialogFooter>
      </DialogContentControlled>
    </Dialog>
  );
}

export function CardStatementsList(props: CardGeneralProps) {
  const GROUPS = [
    {
      id: "contribution",
      label: "Aportación",
      icon: { className: "mdi-bank" },
    },
    {
      id: "order",
      label: "Orden",
      icon: { className: "mdi-file-document-edit" },
    },
  ];
  const getGroup = (statement: Statement) => {
    return GROUPS.find((group) => group.id === statement.type);
  };

  if (!props.statements.length) {
    return (
      <div className="grid place-items-center w-full h-full py-20">
        <div className="text-center">
          <i className="mdi-tag text-4xl text-muted-foreground mb-2" />
          <h2 className="text-xl font-medium text-muted-foreground mb-1">
            No se encontraron estados de cuenta
          </h2>
          <p className="text-sm text-muted-foreground">
            Aqui se mostrarán los estados de cuenta
          </p>
        </div>
      </div>
    );
  }

  // sort by createdAt property:
  const statements = props.statements.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div>
      {statements.map((statement, index) => (
        <div
          className={cn(
            "flex items-center",
            (index < statements.length - 1) && "b-b-1 py-2",
          )}
        >
          <div
            {...getGroup(statement)?.icon}
            className={cn("w-6 h-6 mr-3", getGroup(statement)?.icon?.className)}
          />
          <div className="ml-4 space-y-1">
            <div className="flex items-center py-1">
              <a
                href={`/statements/${statement.id}`}
                className="whitespace-nowrap text-center font-medium text-primary hover:underline"
              >
                {STATEMENT_TYPE_OPTIONS.find((v) => v.type === statement.type)
                  .label}
              </a>
              <IconCopy value={statement.id} tooltip="Copy ID" />
            </div>
          </div>
          <div className="ml-auto text-sm font-semibold tracking-wider">
            {toMXN(statement.amount)}
          </div>
        </div>
      ))}
    </div>
  );
}
