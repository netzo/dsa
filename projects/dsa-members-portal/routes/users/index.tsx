import { defineRoute } from "fresh/server.ts";
import { PageUsers } from "@/islands/users.tsx";
import type { Account, User } from "@/mod.ts";
import { db } from "@/netzo.config.ts";

// NOTE: cannot pass functions as props from routes (server) to islands (client)
export default defineRoute(async (req, ctx) => {
  const [users, accounts] = await Promise.all([
    db.find<User>("users"),
    db.find<Account>("accounts"),
  ]);

  // avoids calling accounts.find for each row (O(n^2) -> O(n))
  const accountsById = accounts.reduce((acc, a) => ({ ...acc, [a.id]: a }));

  // render entire page as island for simplicity
  return (
    <PageUsers
      users={users.map((user) => ({
        ...user,
        account: accountsById?.[user.accountId],
      }))}
    />
  );
});
