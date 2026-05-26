// Config
import "dotenv/config";
import express from "express";
import cors from "cors";
import fs from "node:fs";
import path from "node:path";
import { getEnv } from "./lib/env";
import keepAliveCron from "./lib/cron";

// Sentry
import * as Sentry from "@sentry/node";

// Clerk
import { clerkMiddleware } from "@clerk/express";
import { clerkWebhookHandler } from "./webhooks/clerk";

// Routes
import groupRouter from "./routes/groupRoutes";
import meRouter from "./routes/meRoutes";
// import streamRouter from "./routes/streamRoutes";
// import checkoutRouter from "./routes/checkoutRoutes";
// import adminRouter from "./routes/adminRoutes";
// import orderRouter from "./routes/orderRoutes";

import { sentryClerkUserMiddleware } from "./middleware/sentryClerkIUser";

const env = getEnv();
const app = express();

const rawJson = express.raw({ type: "application/json", limit: "1mb" });

app.post("/webhooks/clerk", rawJson, (req, res) => {
  void clerkWebhookHandler(req, res);
});

app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());
app.use(sentryClerkUserMiddleware);

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});
app.use("/api/me", meRouter);
app.use("/api/group", groupRouter);
// app.use("/api/stream", streamRouter);
// app.use("/api/checkout", checkoutRouter);
// app.use("/api/admin", adminRouter);
// app.use("/api/orders", orderRouter);

const publicDir = path.join(process.cwd(), "public");
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
  app.get("/{*any}", (req, res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD") {
      next();
      return;
    }

    if (req.path.startsWith("/api") || req.path.startsWith("/webhooks")) {
      next();
      return;
    }

    res.sendFile(path.join(publicDir, "index.html"), (err) => next(err));
  });
}

// Sentry will be attached to the response object
Sentry.setupExpressErrorHandler(app);

app.use(
  (
    err: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    const sentryId = (res as express.Response & { sentry?: string }).sentry;

    res.status(500).json({
      message: err,
      error: "Internal server error",
      ...(sentryId !== undefined && { sentryId }),
    });
  },
);

app.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`);

  if (env.NODE_ENV === "production") {
    keepAliveCron.start();
  }
});
