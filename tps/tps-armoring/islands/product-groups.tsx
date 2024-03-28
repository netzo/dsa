import type { ProductGroup } from "@/mod.ts";
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
import { buttonVariants } from "netzo/components/button.tsx";
import { IconCopy } from "netzo/components/icon-copy.tsx";
import { cn } from "netzo/components/utils.ts";

export function PageProductGroups(props: { productGroups: ProductGroup[] }) {
  const table = useTable<ProductGroup>(props.productGroups, {
    endpoint: "/api/product-groups",
    idField: "GroupId",
    search: {
      column: "GroupName",
      placeholder: "Search by name...",
    },
    filters: [
      {
        column: "dataAreaId",
        title: "Área de Datos",
        options: [
          ...new Set(props.productGroups.map((item) => item.dataAreaId).flat()),
        ]
          .sort()
          .map(
            (
              value,
            ) => (value
              ? { label: value.dataAreaId, value: value.dataAreaId }
              : { label: "*no data", value: "" }),
          ),
      },
    ],
    columns: [
      {
        id: "actions",
        cell: (props) => (
          <TableRowActions {...props} endpoint="/api/product-groups" />
        ),
      },
      {
        accessorKey: "GroupName",
        header: (props) => <TableColumnHeader {...props} title="Nombre" />,
        cell: ({ row }) => {
          const { GroupId: id, GroupName: name = "" } = row.original;
          return (
            <div className="flex items-center py-1">
              <Avatar className="h-7 w-7 mr-3">
                {/* <AvatarImage src={image} /> */}
                <AvatarFallback>{name[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
              <a
                href={`/api/product-groups?GroupId=${id}`}
                target="_blank"
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
        accessorKey: "dataAreaId",
        header: (props) => (
          <TableColumnHeader {...props} title="Área de Datos" />
        ),
      },
      {
        accessorKey: "DefaultForecastAllocationKeyId",
        header: (props) => (
          <TableColumnHeader
            {...props}
            title="ID de Asignación de Pronóstico Predeterminado"
          />
        ),
      },
      {
        accessorKey: "RevRecRevenueType",
        header: (props) => (
          <TableColumnHeader {...props} title="Tipo de Ingresos" />
        ),
      },
      {
        accessorKey: "AMFixedAssetGroup",
        header: (props) => (
          <TableColumnHeader {...props} title="Grupo de Activos Fijos AM" />
        ),
      },
    ],
  });

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
          <a
            href="https://www.dynamics.com"
            target="_blank"
            className={cn(
              buttonVariants({ variant: "default" }),
              "ml-2 bg-[#1358D0] text-white",
            )}
          >
            <i className="mdi-microsoft-dynamics-365" />
            Open in MS 365
          </a>
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
