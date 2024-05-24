import { defineRoute } from "fresh/server.ts";
import { PageSessions } from "@/islands/sessions.tsx";
import type { Amenity, Session } from "@/mod.ts";
import { db } from "@/netzo.config.ts";

// NOTE: cannot pass functions as props from routes (server) to islands (client)
export default defineRoute(async (req, ctx) => {
  const [sessions, amenities] = await Promise.all([
    db.find<Session>("sessions"),
    db.find<Amenity>("amenities"),
  ]);

  // render entire page as island for simplicity
  return (
    <PageSessions
      sessions={sessions.map((session) => ({
        ...session,
        amenity: amenities.find((a) => a.id === session.amenityId),
      }))}
    />
  );
});
