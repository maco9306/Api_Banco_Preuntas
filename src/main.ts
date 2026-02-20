import "dotenv/config";
import { env } from "./infrastructure/config/env";
import { buildContainer } from "./container";
import { buildApp } from "./app";

async function bootstrap() {
  const deps = await buildContainer();
  const app = buildApp(deps);

  const PORT = Number(env.PORT ?? 3000);
  app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error("Error al iniciar:", err);
  process.exit(1);
});
