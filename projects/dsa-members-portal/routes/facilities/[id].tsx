import { defineRoute } from "fresh/server.ts";
import { PageFacility } from "@/islands/facility.tsx";
import type { Booking, Facility } from "@/mod.ts";
import { db } from "@/netzo.config.ts";

export default defineRoute(async (req, ctx) => {
  const { id } = ctx.params;
  const [facility, allBookings] = await Promise.all([
    db.get<Facility>("facilities", id),
    db.find<Booking>("bookings"),
  ]);

  const bookings = allBookings.filter((booking) =>
    booking.facilityId === facility?.id
  );

  // render entire page as island for simplicity
  return <PageFacility {...{ id, facility, bookings }} />;
});
