import { defineRoute } from "$fresh/server.ts";
import { PageBookings } from "@/islands/bookings.tsx";
import type { Account } from "@/mod.ts";
import { type Booking } from "@/mod.ts";
import { db } from "@/netzo.config.ts";

// NOTE: cannot pass functions as props from routes (server) to islands (client)
export default defineRoute(async (req, ctx) => {
  const [bookings, accounts] = await Promise.all([
    db.find<Booking>("bookings"),
    db.find<Account>("accounts"),
  ]);

  // avoids calling accounts.find for each row (O(n^2) -> O(n))
  const accountsById = accounts.reduce((acc, a) => ({ ...acc, [a.id]: a }));

  // render entire page as island for simplicity
  return (
    <PageBookings
      bookings={bookings.map((booking) => ({
        ...booking,
        account: accountsById?.[booking.accountId],
      }))}
    />
  );
});
