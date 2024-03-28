import { FormCreateUser } from "@/islands/users.tsx";
import type { Account } from "@/mod.ts";
import {
  getAccount,
  Statement,
  STATEMENT_TYPES,
  toMXN,
  User,
  USER_TYPES,
  Vehicle,
  VEHICLE_TYPES,
} from "@/mod.ts";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "netzo/components/avatar.tsx";
import { TableRowActions } from "netzo/components/blocks/table/table.tsx";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "netzo/components/breadcrumb.tsx";
import { Button } from "netzo/components/button.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "netzo/components/card.tsx";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "netzo/components/dialog.tsx";
import { Form, useForm, type UseFormReturn } from "netzo/components/form.tsx";
import { IconCopy } from "netzo/components/icon-copy.tsx";
import { cn } from "netzo/components/utils.ts";
import { FormCreateVehicle } from "./vehicles.tsx";

type PageAccountProps = {
  id: string;
  account: Account;
  users: User[];
  vehicles: Vehicle[];
  statements: Statement[];
};

export function PageAccount(props: PageAccountProps) {
  const form = useForm<Account>({
    defaultValues: getAccount(props.account),
  });

  const onSubmit = async (data: Account) => {
    const response = await fetch(`/api/accounts/${props.account.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(getAccount(data)),
    });
    if (response.ok) globalThis.location.reload();
  };

  return (
    <Form {...form}>
      <form
        id="accounts.patch"
        className="h-full overflow-y-auto"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <AccountHeader form={form} />

        <div className="flex flex-col gap-4 p-4">
          <AccountMetrics {...props} />
          <div className="grid lg:grid-cols-3 gap-4">
            {
              /* <AccountCardFormUpdate {...props} form={form} />
            <div className="grid gap-4"> */
            }
            <CardUsers
              {...props}
              defaultValues={{ accountId: props.account.id }}
            />
            <CardVehicles
              {...props}
              defaultValues={{ accountId: props.account.id }}
            />
            {/* </div> */}
            <CardStatements
              {...props}
              defaultValues={{ accountId: props.account.id }}
            />
          </div>
        </div>
      </form>
    </Form>
  );
}

function AccountHeader(props: { form: UseFormReturn<Account> }) {
  const original = props.form.getValues();
  const { accountNumber } = original;
  return (
    <header className="flex items-center justify-between p-4">
      <div className="flex flex-row items-center justify-between gap-4">
        <Breadcrumb className="text-xl font-bold">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <a href="/accounts">Cuentas</a>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Avatar className="h-7 w-7 !text-xs">
                <AvatarFallback className="text-white bg-[#16a34a]">
                  {accountNumber}
                </AvatarFallback>
              </Avatar>
              Mi Cuenta
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex flex-row items-center gap-4">
        <TableRowActions
          row={{ original }}
          endpoint="/api/accounts"
          actions={["duplicate", "copyId", "remove"]}
        />
        <Button
          type="reset"
          variant="secondary"
          disabled={!props.form.formState.isDirty}
        >
          Discard
        </Button>
        <Button
          type="submit"
          disabled={!props.form.formState.isDirty}
        >
          {props.form.formState.isLoading
            ? <i className="mdi-loading h-4 w-4 animate-spin" />
            : "Save"}
        </Button>
      </div>
    </header>
  );
}

function AccountMetrics(props: PageAccountProps) {
  const totalStatements = props.statements.length;

  const total = props.statements.reduce(
    (acc, statement) => statement.amount + acc,
    0,
  );

  const totalContributions =
    props.statements.filter((statement) => statement.type === "contribution")
      .length;

  const totalOrders =
    props.statements.filter((statement) => statement.type === "order").length;

  const totalDue = props.statements
    .filter((statement) => statement.type === "order")
    .reduce((acc, statement) => statement.amount + acc, 0);

  const totalContributionsDue = totalContributions
    ? total / totalContributions
    : 0;

  const totalOrdersDue = totalOrders ? totalDue / totalOrders : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle
            title="El número total de estados de cuenta de la cuenta."
            className="text-sm font-medium"
          >
            Total Estados de Cuenta
          </CardTitle>
          <div className="w-4 h-4 mdi-file-document text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalStatements}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle
            title="El valor total por pagar."
            className="text-sm font-medium"
          >
            Por Pagar
          </CardTitle>
          <div className="w-4 h-4 mdi-currency-usd text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {toMXN(totalDue)}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle
            title="El valor total de todas las órdenes por pagar."
            className="text-sm font-medium"
          >
            Por Pagar {totalContributions} aportaciones
          </CardTitle>
          <div className="w-4 h-4 mdi-currency-usd text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {toMXN(totalOrdersDue)}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle
            title="El valor total de todas las órdenes por pagar."
            className="text-sm font-medium"
          >
            Por Pagar ({totalOrders} ordenes)
          </CardTitle>
          <div className="w-4 h-4 mdi-currency-usd text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {toMXN(totalOrdersDue)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// function AccountCardFormUpdate({ form }: { form: UseFormReturn<Account> }) {
//   return (
//     <CardContent>
//       <FormField
//         control={form.control}
//         name="name"
//         render={({ field }) => (
//           <FormItem>
//             <FormLabel>Nombre</FormLabel>
//             <FormControl>
//               <Input {...field} />
//             </FormControl>
//             <FormMessage />
//           </FormItem>
//         )}
//       />
//       <FormField
//         control={form.control}
//         name="email"
//         render={({ field }) => (
//           <FormItem>
//             <FormLabel>Email</FormLabel>
//             <FormControl>
//               <Input {...field}  type="email" />
//             </FormControl>
//             <FormMessage />
//           </FormItem>
//         )}
//       />
//       <FormField
//         control={form.control}
//         name="phone"
//         render={({ field }) => (
//           <FormItem>
//             <FormLabel>Teléfono</FormLabel>
//             <FormControl>
//               <Input {...field} type="phone" />
//             </FormControl>
//             <FormMessage />
//           </FormItem>
//         )}
//       />
//     </CardContent>
//   );
// }

export function CardUsers(
  props: PageAccountProps & { defaultValues: User },
) {
  // IMPORTANT: wrap entire Card in Dialog for FormCreateUser
  return (
    <Dialog>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pt-2">
          <CardTitle>
            Usuarios
          </CardTitle>
          <DialogTrigger asChild>
            <Button variant="default" size="sm" className="ml-2">
              Crear Usuario
            </Button>
          </DialogTrigger>
          <DialogContent>
            <FormCreateUser defaultValues={props.defaultValues} />
          </DialogContent>
        </CardHeader>
        <CardContent>
          <CardUsersList {...props} />
        </CardContent>
      </Card>
    </Dialog>
  );
}

function CardUsersList(props: PageAccountProps) {
  if (!props.users.length) {
    return (
      <div className="grid place-items-center w-full h-full py-20">
        <div className="text-center">
          <i className="mdi-tag text-4xl text-muted-foreground mb-2" />
          <h2 className="text-xl font-medium text-muted-foreground mb-1">
            No se encontraron usuarios
          </h2>
          <p className="text-sm text-muted-foreground">
            Crea un nuevo usuario para comenzar
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {props.users.map((user, index) => (
        <div
          className={cn(
            "flex items-center",
            (index < props.users.length - 1) && "b-b-1 py-2",
          )}
        >
          <Avatar className="h-7 w-7 mr-3">
            <AvatarImage src={user.image} />
            <AvatarFallback>{user.name[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <div className="flex items-center py-1">
              <a
                href={`/users/${user.id}`}
                className="whitespace-nowrap text-center font-medium text-primary hover:underline"
              >
                {user.name}
              </a>
              <IconCopy value={user.id} tooltip="Copy ID" />
            </div>
            <a
              href={`mailto:${user.email}`}
              target="_blank"
              className="text-xs text-muted-foreground"
            >
              {user.email}
            </a>
          </div>
          <div className="ml-auto text-sm font-semibold tracking-wider">
            {USER_TYPES?.[user.type]}
          </div>
        </div>
      ))}
    </div>
  );
}

export function CardVehicles(
  props: PageAccountProps & { defaultValues: Vehicle },
) {
  // IMPORTANT: wrap entire Card in Dialog for FormCreateVehicle
  return (
    <Dialog>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pt-2">
          <CardTitle>
            Vehículo
          </CardTitle>
          <DialogTrigger asChild>
            <Button variant="default" size="sm" className="ml-2">
              Crear Vehículo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <FormCreateVehicle defaultValues={props.defaultValues} />
          </DialogContent>
        </CardHeader>
        <CardContent>
          <CardVehiclesList {...props} />
        </CardContent>
      </Card>
    </Dialog>
  );
}

function CardVehiclesList(props: PageAccountProps) {
  const GROUPS = [
    {
      id: "car",
      title: "Carro",
      icon: { className: "mdi-car-hatchback" },
    },
    {
      id: "suv",
      title: "Camioneta",
      icon: { className: "mdi-car-sports-utility-vehicle" },
    },
    {
      id: "pickup",
      title: "Pickup",
      icon: { className: "mdi-car-lifted-pickup" },
    },
    {
      id: "truck",
      title: "Camion",
      icon: { className: "mdi-truck" },
    },
    {
      id: "motorcycle",
      title: "Motocicleta",
      icon: { className: "mdi-motorbike" },
    },
    {
      id: "other",
      title: "Otro",
      icon: { className: "mdi-car" },
    },
  ];
  const getGroup = (vehicle: Vehicle) => {
    return GROUPS.find((group) => group.id === vehicle.type);
  };

  if (!props.vehicles.length) {
    return (
      <div className="grid place-items-center w-full h-full py-20">
        <div className="text-center">
          <i className="mdi-tag text-4xl text-muted-foreground mb-2" />
          <h2 className="text-xl font-medium text-muted-foreground mb-1">
            No se encontraron vehículos
          </h2>
          <p className="text-sm text-muted-foreground">
            Crea un nuevo vehículo para comenzar
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {props.vehicles.map((vehicle, index) => (
        <div
          className={cn(
            "flex items-center",
            (index < props.vehicles.length - 1) && "b-b-1 py-2",
          )}
        >
          <div
            {...getGroup(vehicle)?.icon}
            className={cn("w-6 h-6 mr-3", getGroup(vehicle)?.icon?.className)}
          />
          <div className="ml-4 space-y-1">
            <div className="flex items-center py-1">
              <a
                href={`/vehicles/${vehicle.id}`}
                className="whitespace-nowrap text-center font-medium text-primary hover:underline"
              >
                {`${vehicle.data?.brand} ${vehicle.data?.model} ${vehicle.data?.year}`}
              </a>
              <IconCopy value={vehicle.id} tooltip="Copy ID" />
            </div>
            <span className="text-xs text-muted-foreground">
              {VEHICLE_TYPES?.[vehicle.type]} | color: {vehicle.data?.color}
            </span>
          </div>
          <div className="ml-auto p-1 text-sm text-white font-semibold tracking-wider bg-black dark:(text-black bg-white)">
            {vehicle.plateNumber}
          </div>
        </div>
      ))}
    </div>
  );
}

export function CardStatements(
  props: PageAccountProps & { defaultValues: Statement },
) {
  // IMPORTANT: wrap entire Card in Dialog for FormCreateStatement
  return (
    <Card>
      <CardHeader className="h-[70px] flex flex-row items-center justify-between pt-2">
        <CardTitle>
          Estados de Cuenta
        </CardTitle>
      </CardHeader>
      <CardContent className="max-h-[500px] overflow-y-auto">
        <CardStatementsList {...props} />
      </CardContent>
    </Card>
  );
}

function CardStatementsList(props: PageAccountProps) {
  const GROUPS = [
    {
      id: "contribution",
      title: "Aportación",
      icon: { className: "mdi-bank" },
    },
    {
      id: "order",
      title: "Orden",
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
                {STATEMENT_TYPES?.[statement.type]}
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
