import { defineRoute } from "$fresh/server.ts";
import { PageSession } from "@/islands/session.tsx";
import { db } from "@/netzo.config.ts";
import type { Booking } from "../../../database/bookings.ts";
import type { Session } from "../../../database/sessions.ts";

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
