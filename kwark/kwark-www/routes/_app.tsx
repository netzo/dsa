import { defineApp } from "$fresh/server.ts";
import type { NetzoState } from "netzo/mod.ts";
import { Navbar } from "../islands/Navbar.tsx";
import { Footer } from "../components/Footer.tsx";
import { Head } from "netzo/components/layout/head.tsx";

export default defineApp<NetzoState>((req, ctx) => {
  return (
    <html className="h-full overflow-hidden">
      <head>
        <Head
          {...{
            title: "Next-gen manufacturing - Kwark Group",
            description: "The solution for next-gen manufacturing leaders",
            favicon: "/favicon.svg",
            image: "/favicon.svg",
          }}
        />
      </head>
      <body className="h-full overflow-y-auto">
        <Navbar />
        <ctx.Component />
        <Footer />
      </body>
    </html>
  );
});
