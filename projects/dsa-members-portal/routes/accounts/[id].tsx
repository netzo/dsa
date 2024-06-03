import { defineRoute } from "fresh/server.ts";
import type { Account, Statement, Vehicle } from "@/mod.ts";
import { generateHexColor } from "@/mod.ts";
import { db } from "@/netzo.config.ts";
import { signal } from "@preact/signals";
import { PageAccount } from "../../islands/account/mod.tsx";

export default defineRoute(async (req, ctx) => {
  const { id } = ctx.params;
  const nav = signal(ctx.url.searchParams.get("nav") || "categories");

  const [account2, allUsers2, allVehicles, allStatements] = await Promise.all([
    db.get<Account>("accounts", id),
    db.find<User>("users"),
    db.find<Vehicle>("vehicles"),
    db.find<Statement>("statements"),
  ]);

  const account = {
    ...account2,
    "email": "test@gmail.com",
    "phone": "528183818381",
  };

  const allUsers = allUsers2.map((user) => ({
    ...user,
    status: [
      "active",
      "active",
      "active",
      "active",
      "active",
      "inactive",
    ][Math.floor(Math.random() * 6)],
  }));

  const users = allUsers.filter((u) => u.accountId === account?.id);

  // NOTE: this simulates guests but they are not really guests
  const guests = allUsers.filter((u) =>
    u.accountId !== account?.id && u.type.startsWith("user")
  );

  function getRandomDate(fromDate: Date, toDate = new Date()) {
    const from = fromDate.getTime();
    const to = toDate.getTime();
    return new Date(from + Math.random() * (to - from));
  }

  const entries = Array.from({ length: 50 }, (_, i) => {
    const createdAt = getRandomDate(new Date(2024, 0, 1));
    return {
      type: ["entry", "exit"][Math.floor(Math.random() * 2)],
      name: users?.[Math.floor(Math.random() * users.length)]?.name,
      status: [
        "active",
        "active",
        "active",
        "active",
        "active",
        "inactive",
      ][Math.floor(Math.random() * 6)],
      userId: users?.[Math.floor(Math.random() * users.length)]?.id,
      createdAt,
      updatedAt: createdAt,
    };
  }).map((entry) => ({
    ...entry,
    user: users.find((u) => u.id === entry.userId),
  }));

  const vehicles = allVehicles
    .filter((v) => v.accountId === account?.id)
    .map((vehicle) => ({
      ...vehicle,
      color: generateHexColor(),
    }));

  const statements = allStatements
    .filter((s) => s.accountId === account?.id)
    .map((s, index) => ({
      ...s,
      type: "contribution", // orders don't really exist
      status: [0, 1, 2].includes(index) ? "pending" : "completed",
      // create a date for the 1st of each month starting from the first of may 2024
      // and decrementing one month at a time by using the index of the mapping function
      date: new Date(new Date(2024, 4, 1).setMonth(4 - index)),
    }))
    .sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  // render entire page as island for simplicity
  return (
    <PageAccount
      id={id}
      nav={nav}
      account={account}
      users={users}
      guests={guests}
      entries={entries}
      vehicles={vehicles}
      statements={statements}
    />
  );
});
