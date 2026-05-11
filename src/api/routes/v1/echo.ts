import { createRoute, z } from "@hono/zod-openapi";

import { success } from "../../../shared/api-envelope";

export const echoRoute = createRoute({
  method: "get",
  path: "/api/v1/echo",
  summary: "Echo message",
  description: "Echoes a required message query parameter.",
  tags: ["Utility"],
  request: {
    query: z.object({
      message: z.string().min(1).max(200),
    }),
  },
  responses: {
    200: {
      description: "Message echoed",
      content: {
        "application/json": {
          schema: z.object({
            success: z.literal(true),
            data: z.object({
              message: z.string(),
            }),
          }),
        },
      },
    },
  },
});

export const buildEchoResponse = (message: string) =>
  success({
    message,
  });
