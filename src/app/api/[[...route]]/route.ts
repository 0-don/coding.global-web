import { botRoute } from "@/server/bot/route";
import { chatRoute } from "@/server/chat/route";
import { searchRoute } from "@/server/search/route";
import { terminalRoute } from "@/server/terminal/route";
import { opentelemetry } from "@elysiajs/opentelemetry";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-node";
import { Elysia } from "elysia";

export const app = new Elysia({ prefix: "/api" })
  .use(
    process.env.NEXT_PUBLIC_POSTHOG_KEY
      ? opentelemetry({
          serviceName: "coding-global-web-api",
          spanProcessors: [
            new BatchSpanProcessor(
              new OTLPTraceExporter({
                url: "https://eu.i.posthog.com/i/v1/traces",
                headers: {
                  Authorization: `Bearer ${process.env.NEXT_PUBLIC_POSTHOG_KEY}`,
                },
              }),
            ),
          ],
        })
      : (app: Elysia) => app,
  )
  .use(chatRoute)
  .use(botRoute)
  .use(searchRoute)
  .use(terminalRoute);

export type App = typeof app;

export const GET = app.handle;
export const POST = app.handle;
export const PUT = app.handle;
export const DELETE = app.handle;
export const PATCH = app.handle;
