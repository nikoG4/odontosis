import { existsSync } from "node:fs";
import { join } from "node:path";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import cookieParser from "cookie-parser";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({ origin: true, credentials: true });
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const appDistPath = join(process.cwd(), "apps", "app", "dist");
  const appIndexPath = join(appDistPath, "index.html");
  if (existsSync(appIndexPath)) {
    app.useStaticAssets(appDistPath);
    app.setBaseViewsDir(appDistPath);

    const express = app.getHttpAdapter().getInstance();
    const serveApp = (_req: unknown, res: any) => res.sendFile(appIndexPath);
    express.get("/", serveApp);
    express.get(/^\/(?!auth|clinic|users|patients|appointments|clinical-notes|treatments|payments|dashboard|health).*/, serveApp);
  }

  await app.listen(process.env.PORT || 3001, "0.0.0.0");
}

bootstrap();
