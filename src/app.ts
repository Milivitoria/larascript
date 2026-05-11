import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import type { Context } from "hono";

import { buildEchoResponse, echoRoute } from "./api/routes/v1/echo";
import { buildHealthResponse, healthRoute } from "./api/routes/v1/health";
import { type AppConfig, loadConfig } from "./config/env";
import { failure } from "./shared/api-envelope";

const validationErrorResponse = (c: Context, details: unknown) =>
  c.json(failure("VALIDATION_ERROR", "Request validation failed", details), 422);

export const createApp = (inputConfig?: AppConfig) => {
  const config = inputConfig ?? loadConfig();

  const app = new OpenAPIHono({
    defaultHook: (result, c) => {
      if (!result.success) {
        return validationErrorResponse(c, result.error.issues);
      }

      return;
    },
  });

  app.use("*", async (c, next) => {
    const startedAt = Date.now();
    await next();
    const durationMs = Date.now() - startedAt;
    console.info(`${c.req.method} ${c.req.path} ${c.res.status} ${durationMs}ms`);
  });

  app.doc("/openapi.json", {
    openapi: "3.1.0",
    info: {
      title: "Larascript API",
      version: "1.0.0",
      description: "Default OpenAPI document for Larascript REST API.",
    },
  });

  if (config.docsEnabled) {
    app.get("/docs", swaggerUI({ url: "/openapi.json" }));
  }

  app.openapi(healthRoute, (c) => c.json(buildHealthResponse()));
  app.openapi(echoRoute, (c) => {
    const { message } = c.req.valid("query");
    return c.json(buildEchoResponse(message));
  });

  app.notFound((c) => c.json(failure("NOT_FOUND", "Route not found"), 404));

  app.onError((error, c) => {
    console.error(error);
    return c.json(
      failure(
        "INTERNAL_ERROR",
        config.nodeEnv === "production" ? "Internal server error" : error.message,
      ),
      500,
    );
  });

  return app;
};
