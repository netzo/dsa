import { defineRoute } from "fresh/server.ts";
import { PageOrders } from "@/islands/orders.tsx";
import type { Order } from "@/mod.ts";
import { db } from "@/netzo.config.ts";

// NOTE: cannot pass functions as props from routes (server) to islands (client)
export default defineRoute(async (req, ctx) => {
  const orders = await db.find<Order>("orders");

  // render entire page as island for simplicity
  return <PageOrders orders={orders} />;
});
