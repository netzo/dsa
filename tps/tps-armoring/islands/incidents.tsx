import type { Unit } from "@/mod.ts";
import { getIncident, type Incident, toDateTime } from "@/mod.ts";
import { useSignal } from "@preact/signals";
import { Badge } from "netzo/components/badge.tsx";
import {
  TableActionsReload,
  TableFilters,
  TablePagination,
  TableRowActions,
  TableSearch,
  TableView,
  useTable,
} from "netzo/components/blocks/table/table.tsx";
import { Button } from "netzo/components/button.tsx";
import { Combobox } from "netzo/components/combobox.tsx";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "netzo/components/form.tsx";
import { Input } from "netzo/components/input.tsx";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "netzo/components/resizable.tsx";
import { SelectMultiple } from "netzo/components/select-multiple.tsx";
import { Separator } from "netzo/components/separator.tsx";
import { Textarea } from "netzo/components/textarea.tsx";
import { cn } from "netzo/components/utils.ts";

const defaultLayout = [50, 50];

export function PageIncidents(props: {
  incident: Incident;
  units: Unit[];
  incidents: Incident[];
}) {
  const incident = useSignal(props.incident);

  // const { width = 0 } = useWindowSize(); causes unnecessary re-renders
  const width = globalThis?.innerWidth;

  const table = useTable<Incident>(props.incidents, {
    endpoint: "/api/incidents",
    idField: "id",
    search: {
      column: "name",
      placeholder: "Search by name...",
    },
    filters: [
      {
        column: "type",
        title: "Tipo",
        options: [...new Set(props.incidents.map((item) => item.type).flat())]
          .sort()
          .map((
            value,
          ) => (value
            ? { label: ({/* TODO */})?.[value] ?? value, value }
            : { label: "*no data", value: "" })
          ),
      },
    ],
    // IMPORTANT: columns are required for search and filters
    columns: [
      {
        id: "name",
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
      },
      {
        accessorKey: "type",
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
      },
    ],
  });

  const onClickSelect = (value: Incident) => incident.value = value;

  const onClickCreate = async () => {
    const name = globalThis.prompt("Enter incident name");
    if (name) {
      const response = await fetch(`/api/incidents`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(getIncident({ name })),
      });
      if (response.ok) {
        const data = await response.json();
        // globalThis.location.href = `/incidents/${props.id}`;
      }
    }
  };

  return (
    <ResizablePanelGroup
      direction={(!width || width > 768) ? "horizontal" : "vertical"}
    >
      <ResizablePanel
        defaultSize={defaultLayout[0]}
        minSize={30}
        className="flex flex-col h-full"
      >
        <header className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center flex-1 space-x-2">
              <TableActionsReload table={table} />
              <TableSearch table={table} />
            </div>
            <div className="flex items-center space-x-2">
              <Button className="ml-2" onClick={onClickCreate}>
                Create
              </Button>
            </div>
          </div>
          <div className="flex items-center flex-1 space-x-2">
            <TableFilters table={table} />
          </div>
        </header>

        <Separator />

        <div className="overflow-y-auto p-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <TableView table={table}>
                {(table) =>
                  table.getRowModel().rows?.length
                    ? table.getRowModel().rows.map((row) => (
                      <div
                        key={`incidents-${row.original.id}`}
                        className={cn(
                          "space-y-2 rounded-lg border p-3 text-sm hover:bg-accent hover:cursor-pointer",
                          incident.value.id === row.original.id &&
                            "bg-muted",
                        )}
                        onClick={() => onClickSelect(row.original)}
                      >
                        <div className="flex gap-4 items-center pb-2">
                          <h4 className="font-semibold line-clamp-1">
                            {row.original.name}
                          </h4>
                          <span
                            className={cn(
                              "ml-auto text-xs min-w-fit",
                              incident.value.id === row.original.id
                                ? "text-foreground"
                                : "text-muted-foreground",
                            )}
                          >
                            {toDateTime(row.original.updatedAt)}
                          </span>
                        </div>
                        <p className="line-clamp-2 text-xs text-muted-foreground">
                          {row.original.notes.substring(0, 300)}
                        </p>
                        <div className="flex gap-2">
                          <IncidentIcon type={row.original.type} />
                        </div>
                      </div>
                    ))
                    : (
                      <div className="grid place-items-center h-full w-full">
                        No results.
                      </div>
                    )}
              </TableView>
            </div>
          </div>
        </div>

        <footer className="flex items-center justify-between p-4">
          <TablePagination table={table} />
        </footer>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={defaultLayout[1]}>
        <div className="grid h-full overflow-y-auto">
          <FormUpdate
            {...props}
            key={incident.value.id}
            incident={incident.value}
          />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

function FormUpdate(props: {
  incident: Incident;
  units: Unit[];
  incidents: Incident[];
}) {
  const form = useForm<Incident>({
    defaultValues: getIncident(props.incident),
  });

  const onSubmit = async (data: Incident) => {
    const response = await fetch(`/api/incidents/${props.incident.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.ok) globalThis.location.reload();
  };

  const toOptions = ({ id, name }) => ({ value: id, label: name });
  const unitOptions = props.units.map(toOptions);

  return (
    <Form {...form}>
      <form
        id="incidents.patch"
        className="space-y-2"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <header className="flex items-center justify-between p-4">
          <div className="flex items-center flex-1 space-x-2">
            <h3 className="text-lg font-semibold line-clamp-1 mr-4">
              {props.incident.name}
            </h3>
            <IncidentIcon type={props.incident.type} />
          </div>
          <div className="flex items-center space-x-2">
            <TableRowActions
              row={{ original: form.getValues() }}
              endpoint="/api/incidents"
              actions={["duplicate", "copyId", "remove"]}
            />
            <Button
              form="incidents.patch"
              variant="secondary"
              type="reset"
              disabled={!form.formState.isDirty}
            >
              Discard
            </Button>
            <Button
              form="incidents.patch"
              type="submit"
              disabled={!form.formState.isDirty}
            >
              {form.formState.isLoading
                ? <i className="mdi-loading h-4 w-4 animate-spin" />
                : "Save"}
            </Button>
          </div>
        </header>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-6 px-4">
              <FormLabel className="w-[100px]">Nombre</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-6 px-4">
              <FormLabel className="w-[100px]">Tipo</FormLabel>
              <FormControl>
                <Combobox
                  {...field}
                  options={[
                    "warning",
                    "warning",
                    "warning",
                    "critical",
                    "warning",
                    "notice",
                    "critical",
                    "maintenance",
                    "security",
                    "other",
                  ].map((value) => ({
                    label: ({/* TODO */})?.[value] ?? value,
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
          name="unitIds"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-6 px-4">
              <FormLabel className="w-[100px]">Unidades</FormLabel>
              <FormControl>
                <SelectMultiple {...field} options={unitOptions} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-6 px-4">
              <FormLabel className="w-[100px]">Notas</FormLabel>
              <FormControl>
                <Textarea {...field} rows="20" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

function IncidentIcon({ type }: { type: string }) {
  const props = ({
    "critical": {
      icon: "mdi-alert-circle",
      text: "Crítico",
      className: `bg-red hover:bg-red bg-opacity-80 text-white`,
    },
    "warning": {
      icon: "mdi-alert",
      text: "Advertencia",
      className: `bg-yellow hover:bg-yellow bg-opacity-80 text-white`,
    },
    "notice": {
      icon: "mdi-information",
      text: "Aviso",
      className: `bg-blue hover:bg-blue bg-opacity-80 text-white`,
    },
    "maintenance": {
      icon: "mdi-wrench",
      text: "Mantenimiento",
      className: `bg-purple hover:bg-purple bg-opacity-80 text-white`,
    },
    "security": {
      icon: "mdi-shield",
      text: "Seguridad",
      className: `bg-pink hover:bg-pink bg-opacity-80 text-white`,
    },
    other: {
      icon: "mdi-help",
      text: "Otro",
      className: `bg-gray hover:bg-gray bg-opacity-80 text-white`,
    },
  })?.[type];

  return (
    <Badge variant="default" className={`${props.className}`}>
      <i className={`${props.icon} mr-1`} />
      {props.text}
    </Badge>
  );
}
