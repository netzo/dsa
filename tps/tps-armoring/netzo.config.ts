import { microsoft365 } from "netzo/integrations/apis/microsoft365.ts";
import { netzodb } from "netzo/integrations/databases/netzodb.ts";
import { defineConfig } from "netzo/mod.ts";
import * as netzo from "netzo/plugins/mod.ts";
import { unocss } from "netzo/plugins/unocss/plugin.ts";
import unocssConfig from "./unocss.config.ts";

export const db = netzodb();

export const apiMicrosoft365 = microsoft365({
  baseURL: Deno.env.get("MICROSOFT_BASE_URL")!,
  clientId: Deno.env.get("MICROSOFT_CLIENT_ID")!,
  clientSecret: Deno.env.get("MICROSOFT_CLIENT_SECRET")!,
  accessTokenUrl: Deno.env.get("MICROSOFT_ACCESS_TOKEN_URL")!,
});

export default defineConfig({
  plugins: [
    netzo.environments(),
    netzo.auth({ providers: { netzo: {} } }),
    netzo.api({
      apiKey: Deno.env.get("NETZO_API_KEY"),
      collections: [
        { name: "incidents", idField: "id" },
        { name: "units", idField: "id" },
      ],
    }),
    unocss(unocssConfig),
  ],
});
