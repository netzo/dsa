import { defineRoute } from "$fresh/server.ts";
import { PageUser } from "@/islands/user.tsx";
import type { Booking, User } from "@/mod.ts";
import { Account } from "@/mod.ts";
import { db } from "@/netzo.config.ts";

export default defineRoute(async (req, ctx) => {
  const { id } = ctx.params;
  const [user, accounts, allBookings] = await Promise.all([
    db.get<User>("users", id),
    db.find<Account>("accounts"),
    db.find<Booking>("bookings"),
  ]);

  const bookings = allBookings.filter((booking) =>
    booking.userIds.includes(user?.id)
  );

  // render entire page as island for simplicity
  return <PageUser {...{ id, user, accounts, bookings }} />;
});
