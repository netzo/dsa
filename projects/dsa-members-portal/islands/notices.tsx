import { getNotice, type Notice, NOTICE_TYPES, toDateTime } from "@/mod.ts";
import { useSignal } from "@preact/signals";
import { Badge } from "netzo/components/badge.tsx";
import {
  TableActionsReload,
  TableFilters,
  TablePagination,
  TableSearch,
  TableView,
  useTable,
} from "netzo/components/blocks/table/table.tsx";
import { Button } from "netzo/components/button.tsx";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "netzo/components/resizable.tsx";
import { cn } from "netzo/components/utils.ts";

const defaultLayout = [50, 50];

export function PageNotices(props: {
  notice: Notice;
  notices: Notice[];
}) {
  const notice = useSignal(props.notice);

  const width = globalThis?.innerWidth; // const { width = 0 } = useWindowSize(); causes unnecessary re-renders

  const table = useTable<Notice>(props.notices, {
    endpoint: "/api/notices",
    idField: "id",
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
        column: "type",
        title: "Tipo",
        options: [...new Set(props.notices.map((item) => item.type).flat())]
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

  const onClickSelect = (value: Notice) => notice.value = value;

  const onClickCreate = async () => {
    const name = globalThis.prompt("Enter notice name");
    if (name) {
      const response = await fetch(`/api/notices`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(getNotice({ name })),
      });
      if (response.ok) {
        const data = await response.json();
        globalThis.location.href = "/notices"; // `/notices/${props.id}`;
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
        className="grid grid-rows-[min-content_auto_min-content] h-screen"
      >
        <header className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center flex-1 space-x-2">
              <TableActionsReload table={table} />
              <TableSearch table={table} />
            </div>
            <div className="flex items-center space-x-2">
              <Button className="ml-2" onClick={onClickCreate}>
                Crear
              </Button>
            </div>
          </div>
          <div className="flex items-center flex-1 space-x-2">
            <TableFilters table={table} />
          </div>
        </header>

        <div className="overflow-y-auto p-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <TableView table={table}>
                {(table) =>
                  table.getRowModel().rows?.length
                    ? table.getRowModel().rows.map((row) => (
                      <div
                        className={cn(
                          "flex space-y-2 rounded-lg border hover:bg-accent hover:cursor-pointer",
                          notice.value.id === row.original.id &&
                            "bg-muted",
                        )}
                      >
                        <div
                          key={`notices-${row.original.id}`}
                          className={cn("flex-1 p-3 text-sm")}
                          onClick={() => onClickSelect(row.original)}
                        >
                          <div className="flex gap-4 items-center pb-2">
                            <h4 className="font-semibold line-clamp-1">
                              {row.original.name}
                            </h4>
                            <span
                              className={cn(
                                "ml-auto text-xs min-w-fit",
                                notice.value.id === row.original.id
                                  ? "text-foreground"
                                  : "text-muted-foreground",
                              )}
                            >
                              {toDateTime(row.original.updatedAt)}
                            </span>
                          </div>
                          <p className="line-clamp-2 text-xs text-muted-foreground">
                            {row.original.description}
                          </p>
                          <div className="flex gap-2">
                            <NoticeIcon type={row.original.type} />
                          </div>
                        </div>
                        <div className="grid place-items-center p-3">
                          <img
                            src={row.original.image}
                            alt={row.original.name}
                            className="w-auto h-16 object-cover rounded-sm"
                          />
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
          <NoticePreview
            {...props}
            key={notice.value.id}
            notice={notice.value}
          />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

function NoticePreview(props: { notice: Notice }) {
  return (
    <div
      className="grid h-full overflow-y-auto p-6 text-sm"
      dangerouslySetInnerHTML={{ __html: props.notice.notes }}
    />
  );
}

function NoticeIcon({ type }: { type: string }) {
  const props = NOTICE_TYPES?.[type] ?? NOTICE_TYPES.other;

  return (
    <Badge variant="default" className={`${props.className}`}>
      <i className={`${props.icon} mr-1`} />
      {props.text}
    </Badge>
  );
}
