import { defineRoute } from "$fresh/server.ts";
import { PagePublications } from "@/islands/publications.tsx";
import { db } from "@/netzo.config.ts";
import type { Publication } from "../../../database/publications.ts";

// NOTE: cannot pass functions as props from routes (server) to islands (client)
export default defineRoute(async (req, ctx) => {
  const publications = await db.find<Publication>("publications");

  // render entire page as island for simplicity
  return <PagePublications publications={publications} />;
});
