import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  DOCS_ENABLED: z
    .string()
    .optional()
    .transform((value) => value !== 'false'),
  STATIC_ASSETS_DIR: z.string().default('dist/client'),
  SERVE_STATIC: z
    .string()
    .optional()
    .transform((value) => value !== 'false'),
});

export type AppConfig = {
  nodeEnv: 'development' | 'test' | 'production';
  port: number;
  docsEnabled: boolean;
  staticAssetsDir: string;
  serveStatic: boolean;
};

export const loadConfig = (): AppConfig => {
  const parsed = envSchema.parse(process.env);

  return {
    nodeEnv: parsed.NODE_ENV,
    port: parsed.PORT,
    docsEnabled: parsed.DOCS_ENABLED,
    staticAssetsDir: parsed.STATIC_ASSETS_DIR,
    serveStatic: parsed.SERVE_STATIC,
  };
};
