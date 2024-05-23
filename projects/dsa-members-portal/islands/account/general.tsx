import type { Account } from "@/mod.ts";
import { Statement, toMXN, User, Vehicle } from "@/mod.ts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "netzo/components/card.tsx";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  UseFormReturn,
} from "netzo/components/form.tsx";
import { Input } from "netzo/components/input.tsx";
import type { PageAccountProps } from "./mod.tsx";

type CardGeneralProps = {
  id: string;
  account: Account;
  users: User[];
  vehicles: Vehicle[];
  statements: Statement[];
};

export function AccountMetrics(props: PageAccountProps) {
  const totalStatements = props.statements.length;
  const totalDue = props.statements.reduce(
    (acc, statement) => statement.amount + acc,
    0,
  );

  const contributions = props.statements.filter((statement) =>
    statement.type === "contribution"
  );
  const totalContributions = contributions.length;
  const totalContributionsDue = totalContributions
    ? (contributions.reduce((acc, statement) => statement.amount + acc, 0) /
      totalContributions)
    : 0;

  const order = props.statements.filter((statement) =>
    statement.type === "order"
  );
  const totalOrders = order.length;
  const totalOrdersDue = totalOrders
    ? (order.reduce((acc, statement) => statement.amount + acc, 0) /
      totalOrders)
    : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle
            title="El número total de estados de cuenta de la cuenta."
            className="text-sm font-medium"
          >
            Total
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
            Por Pagar (aportaciones)
          </CardTitle>
          <div className="w-4 h-4 mdi-currency-usd text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {toMXN(totalContributionsDue)}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle
            title="El valor total de todas las órdenes por pagar."
            className="text-sm font-medium"
          >
            Por Pagar (ordenes)
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

export function AccountCardFormUpdate(
  { form }: { form: UseFormReturn<Account> },
) {
  return (
    <CardContent>
      <FormField
        control={form.control}
        name="accountNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Número de Cuenta</FormLabel>
            <FormControl>
              <Input {...field} disabled={true} />
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
