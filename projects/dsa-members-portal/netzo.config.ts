import { datastore } from "netzo/datastore/mod.ts";
import { defineConfig } from "netzo/mod.ts";
import { loader } from "netzo/plugins/loader/plugin.ts";
import * as netzo from "netzo/plugins/mod.ts";
import { unocss } from "netzo/plugins/unocss/plugin.ts";
import unocssConfig from "./unocss.config.ts";

export const db = datastore();

export default defineConfig({
  plugins: [
    netzo.environments(),
    // netzo.auth({
    //   logo: "/favicon.svg",
    //   title: "Deportivo San Agustin",
    //   description: "Portal de socios del Deportivo San Agustin",
    //   image: { src: "/cover.jpg" },
    //   caption:
    //     "Al iniciar sesión aceptas los <a>términos y condiciones</a> de uso.",
    //   providers: { email: {}, netzo: {}, google: {} },
    // }),
    // netzo.database({ apiKey: undefineDeno.env.get("NETZO_API_KEY") }),
    netzo.datastore({ apiKey: undefined }), // Deno.env.get("NETZO_API_KEY"),
    netzo.netzolabs({ denoJson: JSON.parse(await Deno.readTextFile("deno.json")) }),
    loader(),
    unocss(unocssConfig),
  ],
});
