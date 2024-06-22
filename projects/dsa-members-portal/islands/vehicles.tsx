import { getPublication, getVehicle, Vehicle } from "@/mod.ts";
import { Button } from "netzo/components/button.tsx";
import { Combobox } from "netzo/components/combobox.tsx";
import {
    DialogFooter,
    DialogHeader,
    DialogTitle,
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

export function FormCreateVehicle(props: { defaultValues: Vehicle }) {
  const form = useForm<Vehicle>({
    defaultValues: getVehicle(props.defaultValues),
  });

  const onSubmit = async (data: Vehicle) => {
    const response = await fetch(`/api/vehicles`, {
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
          Crear Vehículo
        </DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form
          id="vehicles.create"
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
        <Button form="vehicles.create" type="submit">
          {form.formState.isLoading
            ? <i className="i-mdi-loading h-4 w-4 animate-spin" />
            : "Create"}
        </Button>
      </DialogFooter>
    </>
  );
}
