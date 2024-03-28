import { defineRoute } from "$fresh/server.ts";
import { PageSession } from "@/islands/session.tsx";
import type { Booking, Session } from "@/mod.ts";
import { db } from "@/netzo.config.ts";

export default defineRoute(async (req, ctx) => {
  const { id } = ctx.params;
  const [session, amenities, allBookings] = await Promise.all([
    db.get<Session>("sessions", id),
    db.find<Amenity>("amenities"),
    db.find<Booking>("bookings"),
  ]);

  const bookings = allBookings.filter((booking) =>
    booking.sessionIds.includes(session?.id)
  );

  // render entire page as island for simplicity
  return <PageSession {...{ id, session, amenities, bookings }} />;
});
