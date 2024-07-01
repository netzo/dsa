import { PageOrder } from "@/islands/order.tsx";
import type { Item, Order } from "@/mod.ts";
import { db } from "@/netzo.config.ts";
import { defineRoute } from "fresh/server.ts";
import type { NetzoState } from "netzo/mod.ts";

export default defineRoute<NetzoState>(async (req, ctx) => {
  const { id } = ctx.params;
  const menuId = ctx.url.searchParams.get("menuId");
  const [order, allItems] = await Promise.all([
    db.get<Order>("orders", id),
    db.find<Item>("items"),
  ]);

  const items = menuId
    ? allItems.filter((item) => item.menuIds.includes(menuId))
    : allItems;

  // render entire page as island for simplicity
  return <PageOrder {...{ id, order, items }} />;
});
