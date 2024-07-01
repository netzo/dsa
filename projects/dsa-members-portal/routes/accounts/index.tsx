import { PageAccounts } from "@/islands/accounts.tsx";
import type { Account } from "@/mod.ts";
import { db } from "@/netzo.config.ts";
import { defineRoute } from "fresh/server.ts";
import type { NetzoState } from "netzo/mod.ts";

// NOTE: cannot pass functions as props from routes (server) to islands (client)
export default defineRoute<NetzoState>(async (req, ctx) => {
  const accounts = await db.find<Account>("accounts");

  // render entire page as island for simplicity
  return <PageAccounts accounts={accounts} />;
});
