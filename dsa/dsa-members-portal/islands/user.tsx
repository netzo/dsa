import type { Booking } from "@/mod.ts";
import { getUser, toMXN, toPercent, User } from "@/mod.ts";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
  type UseFormReturn,
} from "netzo/components/form.tsx";
import { Input } from "netzo/components/input.tsx";
import { CardBookings } from "./bookings.tsx";

type PageUserProps = {
  id: string;
  user: User;
  bookings: Booking[];
};

export function PageUser(props: PageUserProps) {
  const form = useForm<User>({
    defaultValues: getUser(props.user),
  });

  const onSubmit = async (data: User) => {
    const response = await fetch(`/api/users/${props.user.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(getUser(data)),
    });
    if (response.ok) globalThis.location.reload();
  };

  return (
    <Form {...form}>
      <form
        id="users.patch"
        className="h-full overflow-y-auto"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <UserHeader form={form} />

        <div className="flex flex-col gap-4 p-4">
          <UserMetrics {...props} />
          <div className="grid lg:grid-cols-2 gap-4">
            <UserCardFormUpdate {...props} form={form} />
            <CardBookings
              {...props}
              defaultValues={{
                accountId: props.user.accountId,
                userIds: [props.user.id],
              }}
            />
          </div>
        </div>
      </form>
    </Form>
  );
}

function UserHeader(props: { form: UseFormReturn<User> }) {
  const original = props.form.getValues();
  const { name, image } = original;
  return (
    <header className="flex items-center justify-between p-4">
      <div className="flex flex-row items-center justify-between gap-4">
        <Breadcrumb className="text-xl font-bold">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <a href="/users">Usuarios</a>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Avatar className="h-7 w-7 !text-xs">
                <AvatarImage src={image} />
                <AvatarFallback>
                  {name?.[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {name}
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex flex-row items-center gap-4">
        <TableRowActions
          row={{ original }}
          endpoint="/api/users"
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

function UserMetrics(props: PageUserProps) {
  const totalBookings = props.bookings.length;

  const total = props.bookings.reduce(
    (acc, booking) => booking.amount + acc,
    0,
  );

  const totalOrders =
    props.bookings.filter((booking) => booking.type === "order").length;

  const totalDue = props.bookings
    .filter((booking) => booking.type === "order")
    .reduce((acc, booking) => booking.amount + acc, 0);

  const totalOrdersDue = totalOrders ? totalDue / totalOrders : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle
            title="The total number of bookings associated with the data."
            className="text-sm font-medium"
          >
            Total Bookings
          </CardTitle>
          <div className="w-4 h-4 mdi-tag text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalBookings}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle
            title="The total value of all bookings associated with the data."
            className="text-sm font-medium"
          >
            Total por Pagar
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
            title="The average value of each booking made by the data."
            className="text-sm font-medium"
          >
            Total Ordenes
          </CardTitle>
          <div className="w-4 h-4 mdi-currency-usd-circle text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {toMXN(totalOrders)}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle
            title="The percentage of waitingingings that have been successfully converted into won bookings."
            className="text-sm font-medium"
          >
            Total por Pagar (Ordenes)
          </CardTitle>
          <div className="w-4 h-4 mdi-history text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {toPercent(totalOrdersDue)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function UserCardFormUpdate(
  { form, ...props }: PageUserProps & { form: UseFormReturn<User> },
) {
  const toOptions = ({ id, name }) => ({ value: id, label: name });

  return (
    <CardContent>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nombre</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="image"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Imagen</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input {...field} type="email" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Teléfono</FormLabel>
            <FormControl>
              <Input {...field} type="phone" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </CardContent>
  );
}
