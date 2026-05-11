import { createRoute, z } from "@hono/zod-openapi";

import { success } from "../../../shared/api-envelope";

export const healthRoute = createRoute({
  method: "get",
  path: "/api/v1/health",
  summary: "Health check",
  description: "Returns service health and runtime details.",
  tags: ["System"],
  responses: {
    200: {
      description: "Service is healthy",
      content: {
        "application/json": {
          schema: z.object({
            success: z.literal(true),
            data: z.object({
              status: z.literal("ok"),
              runtime: z.string(),
            }),
          }),
        },
      },
    },
  },
});

export const buildHealthResponse = () =>
  success({
    status: "ok" as const,
    runtime: "node",
  });
