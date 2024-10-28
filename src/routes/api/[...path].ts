import { APIEvent } from "@solidjs/start/server";
import { app } from "./elysia";

const handler = async (event: APIEvent) => await app.handle(event.request);

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
