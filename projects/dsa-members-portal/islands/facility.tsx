import type { Facility } from "@/mod.ts";
import { Booking, getFacility } from "@/mod.ts";
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
import { Textarea } from "netzo/components/textarea.tsx";
import { CardBookingsList, FormCreateBooking } from "./bookings.tsx";

type PageFacilityProps = {
  id: string;
  facility: Facility;
  bookings: Booking[];
};

export function PageFacility(props: PageFacilityProps) {
  const form = useForm<Facility>({
    defaultValues: getFacility(props.facility),
  });

  const onSubmit = async (data: Facility) => {
    const response = await fetch(`/api/facilities/${props.facility.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(getFacility(data)),
    });
    if (response.ok) globalThis.location.reload();
  };

  return (
    <Form {...form}>
      <form
        id="facilities.patch"
        className="h-full overflow-y-auto"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FacilityHeader form={form} />

        <div className="flex flex-col gap-4 p-4">
          <div className="grid lg:grid-cols-2 gap-4">
            <FacilityCardFormUpdate {...props} form={form} />
            <CardBookings
              {...props}
              defaultValues={{ facilityId: props.facility.id }}
            />
          </div>
        </div>
      </form>
    </Form>
  );
}

function FacilityHeader(props: { form: UseFormReturn<Facility> }) {
  const original = props.form.getValues();
  const { name, image } = original;
  return (
    <header className="flex items-center justify-between p-4">
      <div className="flex flex-row items-center justify-between gap-4">
        <Breadcrumb className="text-xl font-bold">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <a href="/facilities">Instalaciones</a>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Avatar className="h-7 w-7 !text-xs">
                <AvatarImage src={image} />
                <AvatarFallback>
                  {name?.[0]?.toUpperCase()}
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
          endpoint="/api/facilities"
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

function FacilityCardFormUpdate({ form }: { form: UseFormReturn<Facility> }) {
  return (
    <CardContent>
      <img
        src={form.getValues().image}
        className="w-full h-auto rounded-lg mb-5"
      />
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
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descripción</FormLabel>
            <FormControl>
              <Textarea {...field} />
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

export function CardBookings(
  props: PageFacilityProps & { defaultValues: Booking },
) {
  // IMPORTANT: wrap entire Card in Dialog for FormCreateBooking
  return (
    <Dialog>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pt-2">
          <CardTitle>
            Facility Bookings
          </CardTitle>
          <DialogTrigger asChild>
            <Button variant="default" size="sm" className="ml-2">
              Crear Reserva
            </Button>
          </DialogTrigger>
          <DialogContent>
            <FormCreateBooking defaultValues={props.defaultValues} />
          </DialogContent>
        </CardHeader>
        <CardContent>
          <CardBookingsList {...props} />
        </CardContent>
      </Card>
    </Dialog>
  );
}
