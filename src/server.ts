import { access, readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { serve } from "@hono/node-server";

import { createApp } from "./app";
import { loadConfig } from "./config/env";

const config = loadConfig();
const app = createApp(config);

const mimeByExtension: Record<string, string> = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
};

const canServeStatic = (pathname: string, method: string) => {
  if (!config.serveStatic || method !== "GET") {
    return false;
  }

  if (pathname.startsWith("/api/") || pathname === "/openapi.json" || pathname === "/docs") {
    return false;
  }

  return true;
};

const resolveAssetPath = (pathname: string) => {
  const cleaned = pathname === "/" ? "index.html" : pathname.slice(1);
  return normalize(join(config.staticAssetsDir, cleaned));
};

const serveAsset = async (pathname: string): Promise<Response | null> => {
  const requested = resolveAssetPath(pathname);

  try {
    await access(requested);
    const content = await readFile(requested);
    const extension = extname(requested);

    return new Response(content, {
      status: 200,
      headers: {
        "content-type": mimeByExtension[extension] ?? "application/octet-stream",
        "cache-control": extension === ".html" ? "no-cache" : "public, max-age=31536000, immutable",
      },
    });
  } catch {
    try {
      const indexPath = join(config.staticAssetsDir, "index.html");
      const fallback = await readFile(indexPath);

      return new Response(fallback, {
        status: 200,
        headers: {
          "content-type": "text/html; charset=utf-8",
          "cache-control": "no-cache",
        },
      });
    } catch {
      return null;
    }
  }
};

serve({
  port: config.port,
  fetch: async (request) => {
    const url = new URL(request.url);

    if (canServeStatic(url.pathname, request.method)) {
      const staticResponse = await serveAsset(url.pathname);

      if (staticResponse) {
        return staticResponse;
      }
    }

    return app.fetch(request);
  },
});

console.info(`Server running on http://localhost:${config.port}`);
