import {
  AccountCardFormUpdate,
  AccountMetrics,
} from "@/islands/account/general.tsx";
import type { Account, Entry, Guest, Statement, User, Vehicle } from "@/mod.ts";
import { getAccount, updateSearchParam } from "@/mod.ts";
import { type Signal } from "@preact/signals";
import { Avatar, AvatarFallback } from "netzo/components/avatar.tsx";
import { TableRowActions } from "netzo/components/blocks/table/table.tsx";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "netzo/components/breadcrumb.tsx";
import { Button, buttonVariants } from "netzo/components/button.tsx";
import { Form, useForm, type UseFormReturn } from "netzo/components/form.tsx";
import { Separator } from "netzo/components/separator.tsx";
import { cn } from "netzo/components/utils.ts";
import { CardEntries } from "./entries.tsx";
import { CardGuests } from "./guests.tsx";
import { CardStatements } from "./statements.tsx";
import { CardUsers } from "./users.tsx";
import { CardVehicles } from "./vehicles.tsx";

export type PageAccountProps = {
  id: string;
  nav: Signal<string>;
  tab: Signal<string>;
  account: Account;
  users: User[];
  entries: Entry[];
  guests: Guest[];
  vehicles: Vehicle[];
  statements: Statement[];
};

export function PageAccount(props: PageAccountProps) {
  const navItems = [
    { label: "General", value: "general" },
    { label: "Asociados", value: "users" },
    { label: "Invitados", value: "guests" },
    { label: "Accesos", value: "entries" },
    { label: "Vehiculos", value: "vehicles" },
    { label: "Estados de Cuenta", value: "statements" },
  ];
  if (!navItems.some((item) => item.value === props.nav.value)) {
    props.nav.value = navItems[0].value; // set to first tab if invalid
    updateSearchParam("nav", props.nav.value);
  }
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
    <div className="flex flex-col h-screen">
      <AccountHeader form={form} />
      <Separator />
      <div className="md:block h-full ">
        <div className="grid grid-rows-auto lg:grid-cols-[250px_auto] h-[calc(100%-44px-32px)] gap-4">
          <aside className="h-full overflow-y-auto p-4">
            <nav className={cn("flex flex-col space-y-2")}>
              {navItems.map((navItem) => (
                <button
                  key={navItem.value}
                  onClick={() => {
                    props.nav.value = navItem.value;
                    updateSearchParam("nav", props.nav.value);
                  }}
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    props.nav.value === navItem.value
                      ? "bg-muted hover:bg-muted"
                      : "hover:bg-transparent hover:underline",
                    "justify-start",
                  )}
                >
                  {navItem.label}
                </button>
              ))}
            </nav>
          </aside>
          <div className="h-full overflow-y-auto py-4 pr-4">
            {props.nav.value === "entries" &&
              (
                <div className="w-full h-full">
                  <CardEntries
                    entries={props.entries}
                  />
                </div>
              )}
            {props.nav.value === "guests" &&
              (
                <div className="w-full h-full">
                  <CardGuests guests={props.guests} />
                </div>
              )}
            {props.nav.value === "users" &&
              (
                <div className="w-full h-full">
                  <CardUsers users={props.users} />
                </div>
              )}
            {props.nav.value === "vehicles" &&
              (
                <div className="w-full h-full">
                  <CardVehicles vehicles={props.vehicles} />
                </div>
              )}
            {props.nav.value === "statements" &&
              (
                <div className="w-full h-full">
                  <CardStatements statements={props.statements} />
                </div>
              )}
            {props.nav.value === "general" &&
              (
                <div className="w-full h-full">
                  <Form {...form}>
                    <form
                      id="accounts.patch"
                      className="h-full overflow-y-auto"
                      onSubmit={form.handleSubmit(onSubmit)}
                    >
                      <div className="flex flex-col gap-4 p-4">
                        <AccountMetrics {...props} />
                        <div className="flex items-left justify-end md:items-center space-x-2">
                          <div className="flex flex-row items-center gap-4">
                            <TableRowActions
                              row={{ original: props.account }}
                              endpoint="/api/accounts"
                              actions={["duplicate", "copyId", "remove"]}
                            />
                            <Button
                              type="reset"
                              variant="secondary"
                              disabled={!form.formState.isDirty}
                            >
                              Descartar
                            </Button>
                            <Button
                              type="submit"
                              disabled={!form.formState.isDirty}
                            >
                              {form.formState.isLoading
                                ? (
                                  <i className="mdi-loading h-4 w-4 animate-spin" />
                                )
                                : "Guardar"}
                            </Button>
                          </div>
                        </div>
                        <AccountCardFormUpdate form={form} />
                      </div>
                    </form>
                  </Form>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}

function AccountHeader(props: { form: UseFormReturn<Account> }) {
  const original = props.form.getValues();
  const { accountNumber } = original;
  return (
    <header className="flex flex-row items-start justify-between p-4 gap-y-2">
      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-center justify-between gap-4">
          <Breadcrumb className="text-xl font-bold">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <a href="/accounts">Acciones</a>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <Avatar className="h-7 w-7 !text-xs">
                  <AvatarFallback className="text-white bg-[#16a34a]">
                    {accountNumber}
                  </AvatarFallback>
                </Avatar>
                Mi Acción
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <p className="hidden lg:block text-xs text-muted-foreground">
          Gestion de asociados, invitados, accesos, vehículos y estados de
          cuenta.
        </p>
      </div>
      <div className="flex items-left md:items-center space-x-2">
        <div className="flex flex-row items-center gap-4">
          {
            /* <TableRowActions
            row={{ original }}
            endpoint="/api/accounts"
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
              ? <i className="mdi-loading h-4 w-4 animate-spin" />
              : "Guardar"}
          </Button> */
          }
          <a
            href={`/netpay-statement-payment.png`}
            target="_blank"
            title="Pagar estados de cuenta pendientes con NetPay"
            className={cn(
              buttonVariants(),
              "netpay-button",
            )}
          >
            <i className="mdi mdi-credit-card-outline mr-1" />
            Configurar NetPay
          </a>
        </div>
      </div>
    </header>
  );
}
