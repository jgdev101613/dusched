import dotenv from "dotenv";

dotenv.config();

export const ENV = {
  // Backend Config
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,

  // Database Config
  DATABASE_URL: process.env.DATABASE_URL,

  // Clerk Config
  CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY,
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
  CLERK_WEKHOOK_SECRET: process.env.CLERK_WEKHOOK_SECRET,
  // Sentry Config
  SENTRY_DSN: process.env.SENTRY_DSN,

  // Stream Config
  STREAM_API_KEY: process.env.STREAM_API_KEY,
  STREAM_API_SECRET: process.env.STREAM_API_SECRET,

  // Imagekit Config
  IMAGEKIT_PUBLIC_KEY: process.env.IMAGEKIT_PUBLIC_KEY,
  IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY,
  IMAGEKIT_URL_ENDPOINT: process.env.IMAGEKIT_URL_ENDPOINT,
};
