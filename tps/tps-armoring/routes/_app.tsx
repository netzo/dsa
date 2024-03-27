import { Partial } from "$fresh/runtime.ts";
import { defineApp } from "$fresh/server.ts";
import { Head } from "netzo/components/head.tsx";
import { cn } from "netzo/components/utils.ts";
import type { NetzoState } from "netzo/mod.ts";
import { Nav, NetzoToolbar } from "../islands/mod.tsx";

export default defineApp<NetzoState>((req, ctx) => {
  const { isAuthenticated, sessionUser } = ctx.state?.auth ?? {};
  // assert isAuthenticated explicitly (undefined if auth not enabled)
  const mustAuth = isAuthenticated === false;

  return (
    <html className="h-full overflow-hidden">
      <head>
        <Head
          title="TPS Armoring"
          description="A demo app for TPS Armoring"
          favicon="/favicon.svg"
          image="/cover.svg"
        />
      </head>
      {mustAuth
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
            <Partial name="main">
              <main className="grid h-screen">
                <ctx.Component />
              </main>
            </Partial>
            <NetzoToolbar sessionUser={sessionUser} />
          </body>
        )}
    </html>
  );
});
