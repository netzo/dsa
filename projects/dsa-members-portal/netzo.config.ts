import { netzodb } from "netzo/integrations/databases/netzodb.ts";
import { defineConfig } from "netzo/mod.ts";
import * as netzo from "netzo/plugins/mod.ts";
import { unocss } from "netzo/plugins/unocss/plugin.ts";
import unocssConfig from "./unocss.config.ts";

export const db = netzodb();

export default defineConfig({
  plugins: [
    netzo.environments(),
    // netzo.auth({ providers: { netzo: {} } }),
    netzo.api({
      apiKey: undefined, // Deno.env.get("NETZO_API_KEY"),
      collections: [
        { name: "accounts", idField: "id" },
        { name: "amenities", idField: "id" },
        { name: "bookings", idField: "id" },
        { name: "facilities", idField: "id" },
        { name: "items", idField: "id" },
        { name: "menus", idField: "id" },
        { name: "orders", idField: "id" },
        { name: "publications", idField: "id" },
        { name: "services", idField: "id" },
        { name: "sessions", idField: "id" },
        { name: "sports", idField: "id" },
        { name: "statements", idField: "id" },
        { name: "users", idField: "id" },
        { name: "vehicles", idField: "id" },
      ],
    }),
    unocss(unocssConfig),
  ],
});
