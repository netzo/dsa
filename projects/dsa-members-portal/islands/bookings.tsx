import { Head } from "$fresh/runtime.ts";
import { Booking, getBooking, getPublication } from "@/mod.ts";
import {
  Calendar,
  momentLocalizer,
  Views,
} from "https://esm.sh/react-big-calendar@1.11.2?external=react,react-dom&target=es2022";
import { Button } from "netzo/components/button.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "netzo/components/card.tsx";
import { Combobox } from "netzo/components/combobox.tsx";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
} from "netzo/components/form.tsx";
import { Input } from "netzo/components/input.tsx";
import moment from "npm:moment@2.30.1";
import React, { useMemo } from "react";
import { FormCreateBooking } from "./bookings.tsx";

import * as dates from "./bookings.utils.ts";

const now = new Date();

const events = [
  {
    id: 1,
    title: "Torneo de Natacion",
    start: new Date(new Date().setHours(new Date().getHours() - 3)),
    end: new Date(new Date().setHours(new Date().getHours() + 3)),
  },
  {
    id: 2,
    title: "Ceremonia de premiacion",
    start: now,
    end: now,
  },
  {
    id: 3,
    title: "Clase de Yoga",
    start: new Date(2024, 3, 22, 15, 30, 0),
    end: new Date(2014, 3, 22, 19, 0, 0),
  },
  {
    id: 4,
    title: "Clase de Yoga",
    start: new Date(2024, 3, 22, 15, 30, 0),
    end: new Date(2014, 3, 22, 19, 0, 0),
  },
  {
    id: 5,
    title: "Cita de Rehabilitacion",
    start: new Date(2024, 3, 27, 15, 30, 0),
    end: new Date(2014, 3, 27, 19, 0, 0),
  },
  {
    id: 5,
    title: "Clase de Yoga",
    start: new Date(2024, 3, 29, 15, 30, 0),
    end: new Date(2024, 3, 29, 19, 0, 0),
  },
];

const mLocalizer = momentLocalizer(moment);

const ColoredDateCellWrapper = ({ children }) =>
  React.cloneElement(React.Children.only(children), {
    style: {
      backgroundColor: "lightblue",
    },
  });

/**
 * We are defaulting the localizer here because we are using this same
 * example on the main "About" page in Storybook
 */
export function PageBookings({
  localizer = mLocalizer,
  showDemoLink = true,
}) {
  const { components, defaultDate, max, views } = useMemo(
    () => ({
      components: {
        timeSlotWrapper: ColoredDateCellWrapper,
      },
      defaultDate: now,
      max: dates.add(dates.endOf(new Date(2015, 17, 1), "day"), -1, "hours"),
      views: Object.keys(Views).map((k) => Views[k]),
    }),
    [],
  );

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://esm.sh/react-big-calendar@1.11.2/lib/css/react-big-calendar.css"
        />
      </Head>
      <div className="grid grid-rows-[min-content_auto_min-content] h-screen">
        <header className="flex items-center justify-between p-4">
          <div className="flex items-center flex-1 space-x-2">
            {/* TODO */}
          </div>
          <div className="flex items-center space-x-2">
            {/* TODO */}
          </div>
        </header>
        <div className="flex-1 overflow-y-auto h-full w-full px-4">
          <Calendar
            components={components}
            defaultDate={defaultDate}
            events={events}
            localizer={localizer}
            max={max}
            showMultiDayTimes
            step={60}
            views={views}
          />
        </div>
        <footer className="flex items-center justify-between p-4">
          {/* TODO */}
        </footer>
      </div>
    </>
  );
}

export function CardBookings(
  props: PageAmenityProps & { defaultValues: Booking },
) {
  // IMPORTANT: wrap entire Card in Dialog for FormCreateBooking
  return (
    <Dialog>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pt-2">
          <CardTitle>
            Amenity Bookings
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

export function CardBookingsList(props: { bookings: Booking[] }) {
  if (!props.bookings.length) {
    return (
      <div className="grid place-items-center w-full h-full py-20">
        <div className="text-center">
          <i className="mdi-tag text-4xl text-muted-foreground mb-2" />
          <h2 className="text-xl font-medium text-muted-foreground mb-1">
            No se encontraron reservas
          </h2>
          <p className="text-sm text-muted-foreground">
            Crea una nueva reserva para comenzar
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {props.bookings.map((booking, index) => (
        <div
          className={cn(
            "flex items-center",
            (index < props.bookings.length - 1) && "b-b-1 py-2",
          )}
        >
          <div className="ml-4 space-y-1">
            <div className="flex items-center py-1">
              <a
                href={`/bookings/${booking.id}`}
                className="whitespace-nowrap text-center font-medium text-primary hover:underline"
              >
                {booking.name}
              </a>
              <IconCopy value={booking.id} tooltip="Copy ID" />
            </div>
          </div>
          <div className="ml-auto">
            {toMXN(booking.amount)}
          </div>
        </div>
      ))}
    </div>
  );
}

export function FormCreateBooking(props: { defaultValues: Booking }) {
  const form = useForm<Booking>({
    defaultValues: getBooking(props.defaultValues),
  });

  const onSubmit = async (data: Booking) => {
    const response = await fetch(`/api/bookings`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(getPublication(data)),
    });

    if (response.ok) globalThis.location.reload();
  };

  // NOTE: must manually invoke submit because submit button isteleported
  // by dialog out of form (see https://github.com/shadcn-ui/ui/issues/709)
  return (
    <>
      <DialogHeader className="text-left">
        <DialogTitle>
          Crear Reserva
        </DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form
          id="bookings.create"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado</FormLabel>
                <FormControl>
                  <Combobox
                    {...field}
                    options={[
                      "waiting",
                      "won",
                      "rescheduled",
                      "cancelled",
                    ].map((value) => ({
                      label: value,
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
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cantidad</FormLabel>
                <FormControl>
                  <Input {...field} type="number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>

      <DialogFooter>
        <Button form="bookings.create" type="submit">
          {form.formState.isLoading
            ? <i className="mdi-loading h-4 w-4 animate-spin" />
            : "Create"}
        </Button>
      </DialogFooter>
    </>
  );
}
