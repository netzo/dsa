import { defineRoute } from "$fresh/server.ts";
import { PagePublications } from "@/islands/publications.tsx";
import type { Publication } from "@/mod.ts";
import { db } from "@/netzo.config.ts";

// NOTE: cannot pass functions as props from routes (server) to islands (client)
export default defineRoute(async (req, ctx) => {
  const publications = await db.find<Publication>("publications");

  // render entire page as island for simplicity
  return <PagePublications publications={publications} />;
});
