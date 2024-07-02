import type { Booking } from "@/mod.ts";
import { getSession, Session } from "@/mod.ts";
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
import { CardContent } from "netzo/components/card.tsx";
import { Combobox } from "netzo/components/combobox.tsx";
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
import { CardBookings } from "./bookings.tsx";

type PageSessionProps = {
  id: string;
  session: Session;
  bookings: Booking[];
};

export function PageSession(props: PageSessionProps) {
  const form = useForm<Session>({
    defaultValues: getSession(props.session),
  });

  const onSubmit = async (data: Session) => {
    const response = await fetch(`/api/sessions/${props.session.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(getSession(data)),
    });
    if (response.ok) globalThis.location.reload();
  };

  return (
    <Form {...form}>
      <form
        id="sessions.patch"
        className="h-full overflow-y-auto"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <SessionHeader form={form} />

        <div className="flex flex-col gap-4 p-4">
          <div className="grid lg:grid-cols-2 gap-4">
            <SessionCardFormUpdate {...props} form={form} />
            <CardBookings
              {...props}
              defaultValues={{
                sportId: props.session.sportId,
                sessionIds: [props.session.id],
              }}
            />
          </div>
        </div>
      </form>
    </Form>
  );
}

function SessionHeader(props: { form: UseFormReturn<Session> }) {
  const original = props.form.getValues();
  const { name, image } = original;
  return (
    <header className="flex items-center justify-between p-4">
      <div className="flex flex-row items-center justify-between gap-4">
        <Breadcrumb className="text-xl font-bold">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <a href="/sessions">Crear Sesión</a>
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
          endpoint="/api/sessions"
          actions={["duplicate", "copyId", "remove"]}
        />
        <Button
          type="reset"
          variant="secondary"
          disabled={!props.form.formState.isDirty}
        >
          Descartar
        </Button>
        <Button
          type="submit"
          disabled={!props.form.formState.isDirty}
        >
          {props.form.formState.isLoading
            ? <i className="i-mdi-loading h-4 w-4 animate-spin" />
            : "Guardar"}
        </Button>
      </div>
    </header>
  );
}

function SessionCardFormUpdate(
  { form, ...props }: PageSessionProps & { form: UseFormReturn<Session> },
) {
  const toOptions = ({ id, name }) => ({ value: id, label: name });
  const sportOptions = props.sports.map(toOptions);

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
        name="sportId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Deporte</FormLabel>
            <FormControl>
              <Combobox {...field} options={sportOptions} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </CardContent>
  );
}
