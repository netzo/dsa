import { defineApp } from "$fresh/server.ts";
import { Nav /* , NetzoToolbar */ } from "@/islands/mod.tsx";
import { Head } from "netzo/components/head.tsx";
import { cn } from "netzo/components/utils.ts";
import type { NetzoState } from "netzo/mod.ts";

const denoJson = await Deno.readTextFile("deno.json");

export default defineApp<NetzoState>((req, ctx) => {
  ctx.state.denoJson = JSON.parse(denoJson);
  const { isAuthenticated, sessionUser } = ctx.state?.auth ?? {};
  // assert isAuthenticated explicitly (undefined if auth not enabled)
  const mustAuth = isAuthenticated === false;

  // NOTE: until https://github.com/denoland/fresh/pull/2297 is merged
  // the following check is required to handle /auth?error=... pages
  const atAuthPage = ctx.url.pathname.startsWith("/auth");

  return (
    <html className="h-full overflow-hidden">
      <head>
        <Head
          title="DSA Socios"
          description="Aplicación de socios del Deportivo San Agustín"
          favicon="/favicon.svg"
          image="/cover.svg"
        />
      </head>
      {mustAuth || atAuthPage
        ? (
          <body className={cn("h-screen bg-background")}>
            <main className="grid h-screen">
              <ctx.Component />
            </main>
          </body>
        )
        : (
          <body
            className={cn(
              "h-screen bg-background",
              "md:grid md:grid-cols-[250px_auto]",
            )}
          >
            <Nav state={ctx.state} />
            <main className="grid h-screen">
              <ctx.Component />
            </main>
            {/* <NetzoToolbar sessionUser={sessionUser} /> */}
          </body>
        )}
    </html>
  );
});
