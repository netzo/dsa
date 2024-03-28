// see https://v0.dev/t/C2Fk3YauyQ4
import type { Item } from "@/mod.ts";
import { getItem, toMXN } from "@/mod.ts";
import {
  TableActionsReload,
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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "netzo/components/card.tsx";
import { Input } from "netzo/components/input.tsx";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "netzo/components/resizable.tsx";
import { ScrollArea } from "netzo/components/scroll-area.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "netzo/components/select.tsx";

const defaultLayout = [50, 50];

export function PageOrder(props: {
  id: string;
  order: Order;
  items: Booking[];
}) {
  const table = useTable<Item>(props.items, {
    endpoint: "/api/items",
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
        options: [
          ...new Set(props.items.map((item) => item.type).flat()),
        ]
          .sort()
          .map((
            value,
          ) => (value
            ? { label: ({/* TODO */ })?.[value] ?? value, value }
            : { label: "*no data", value: "" })
          ),
      },
    ],
    columns: [
      {
        id: "actions",
        cell: (props) => <TableRowActions {...props} endpoint="/api/items" />,
      },
      {
        accessorKey: "type",
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
      },
    ],
  });

  const onClickCreate = async () => {
    const name = globalThis.prompt("Enter item name");
    if (name) {
      const response = await fetch(`/api/items`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(getItem({ name })),
      });
      if (response.ok) {
        const data = await response.json();
        globalThis.location.href = `/items/${data.id}`;
      }
    }
  };

  const width = globalThis?.innerWidth; // const { width = 0 } = useWindowSize(); causes unnecessary re-renders

  return (
    <ResizablePanelGroup
      direction={(!width || width > 768) ? "horizontal" : "vertical"}
    >
      <ResizablePanel
        defaultSize={defaultLayout[0]}
        minSize={30}
        className="grid grid-rows-[min-content_auto_min-content] h-screen"
      >
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

        <div className="flex-1 overflow-y-auto @container">
          <TableView table={table}>
            {(table) => (
              <div className="grid grid-cols-1 @md:grid-cols-2 @xl:grid-cols-3 @3xl:grid-cols-4 @5xl:grid-cols-5 gap-4 p-4">
                {table.getRowModel().rows?.map((row, index) => (
                  <Card
                    key={`card-${index}`}
                    className="flex flex-col w-full h-full hover:bg-accent hover:cursor-pointer"
                  >
                    <img
                      src={row.original.image}
                      alt={row.original.name}
                      className="object-cover w-full h-[200px]"
                    />
                    <CardHeader className="p-3">
                      <CardTitle
                        title={row.original.name}
                        className="text-base font-semibold"
                      >
                        {row.original.name}
                      </CardTitle>
                      <CardDescription
                        title={row.original.description}
                        className="text-sm font-normal line-clamp-3"
                      >
                        {row.original.description}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="px-3 flex-1 flex items-center justify-between">
                      {
                        /* <div className="text-xs text-gray-500">
                        {sentenceCase(row.original.sectionId)}
                      </div> */
                      }
                      <span className="text-primary">
                        {toMXN(row.original.price)}
                      </span>
                    </CardFooter>
                    <CardContent className="p-3 flex items-center justify-between gap-1 text-sm font-medium">
                      <Button variant="secondary" size="icon">
                        <i className="mdi-minus" />
                      </Button>
                      <Input
                        className="w-full mx-2"
                        value="0"
                        type="number"
                      />
                      <Button variant="secondary" size="icon">
                        <i className="mdi-plus" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TableView>
        </div>

        <footer className="flex items-center justify-between p-4">
          <TablePagination table={table} />
        </footer>
      </ResizablePanel>

      <ResizableHandle withHandle />

      <ResizablePanel defaultSize={defaultLayout[1]}>
        <div className="flex flex-col w-full p-4 space-y-4">
          <header className="flex items-center justify-between">
            <input
              className="w-full border border-gray-200 rounded-md p-2"
              placeholder="Buscar productos..."
              type="text"
            />
            <Select>
              <SelectTrigger id="filter">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="type1">Type 1</SelectItem>
                <SelectItem value="type2">Type 2</SelectItem>
              </SelectContent>
            </Select>
          </header>
          <ScrollArea className="flex-grow overflow-auto">
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-gray-200">
                <div>Crema de chile poblano</div>
                <div>$72.00</div>
                <div>
                  <input
                    className="w-12 border border-gray-200 rounded-md p-1 text-center"
                    defaultValue="1"
                    type="number"
                  />
                </div>
                <div>$72.00</div>
                <i className="mdi-delete cursor-pointer" />
              </div>

              {/* Add more items for the first ScrollArea */}
            </div>
          </ScrollArea>

          <ScrollArea className="flex-grow overflow-auto">
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-gray-200">
                <div>Ensalada capresse</div>
                <div>$145.00</div>
                <div>
                  <input
                    className="w-12 border border-gray-200 rounded-md p-1 text-center"
                    defaultValue="1"
                    type="number"
                  />
                </div>
                <div>$145.00</div>
                <i className="mdi-delete cursor-pointer" />
              </div>

              {/* Add more items for the second ScrollArea */}
            </div>
          </ScrollArea>

          <ScrollArea className="flex-grow overflow-auto">
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-gray-200">
                <div>Tacos de arrachera (4 piezas)</div>
                <div>$230.00</div>
                <div>
                  <input
                    className="w-12 border border-gray-200 rounded-md p-1 text-center"
                    defaultValue="1"
                    type="number"
                  />
                </div>
                <div>$230.00</div>
                <i className="mdi-delete cursor-pointer" />
              </div>

              {/* Add more items for the third ScrollArea */}
            </div>
          </ScrollArea>

          <ScrollArea className="flex-grow overflow-auto">
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-gray-200">
                <div>Club sandwich</div>
                <div>$160.00</div>
                <div>
                  <input
                    className="w-12 border border-gray-200 rounded-md p-1 text-center"
                    defaultValue="1"
                    type="number"
                  />
                </div>
                <div>$160.00</div>
                <i className="mdi-delete cursor-pointer" />
              </div>

              {/* Add more items for the fourth ScrollArea */}
            </div>
          </ScrollArea>
          <div className="flex justify-between">
            <div>
              <div>Total</div>
              <div>Descuento: $0.00</div>
              <div>IVA: $98</div>
            </div>
            <div className="text-3xl font-bold">$607.00</div>
          </div>
          <Button className="w-full">Cargo a cuenta</Button>
          <Button className="w-full bg-purple">Pago con tarjeta</Button>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
