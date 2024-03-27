import { defineRoute } from "$fresh/server.ts";
import { PageOrder } from "@/islands/order.tsx";
import { db } from "@/netzo.config.ts";
import type { Item } from "../../../database/items.ts";
import type { Order } from "../../../database/orders.ts";

export default defineRoute(async (req, ctx) => {
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
