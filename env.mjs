import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    // This is optional because it's only used in development.
    // See https://next-auth.js.org/deployment.
    NEXTAUTH_URL: z.string().url().optional(),
    AUTH_SECRET: z.string().min(1),
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
    GITHUB_ID: z.string().optional(),
    GITHUB_SECRET: z.string().optional(),
    LinuxDo_CLIENT_ID: z.string().optional(),
    LinuxDo_CLIENT_SECRET: z.string().optional(),
    DATABASE_URL: z.string().min(1),
    RESEND_API_KEY: z.string().optional(),
    CLOUDFLARE_ZONE_ID: z.string().min(1),
    CLOUDFLARE_ZONE_NAME: z.string().min(1),
    CLOUDFLARE_API_KEY: z.string().min(1),
    CLOUDFLARE_EMAIL: z.string().min(1),
    SCREENSHOTONE_BASE_URL: z.string().optional(),
    GITHUB_TOKEN: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().min(1),
    NEXT_PUBLIC_OPEN_SIGNUP: z.string().min(1).default("1"),
    NEXT_PUBLIC_SHORT_DOMAINS: z.string().min(1).default(""),
    // 将邮件相关变量设置为可选，以便在禁用邮件功能时不会出错
    NEXT_PUBLIC_EMAIL_DOMAINS: z.string().default("dummy.com"),
    NEXT_PUBLIC_EMAIL_R2_DOMAIN: z.string().default("dummy.com"),
  },
  runtimeEnv: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    AUTH_SECRET: process.env.AUTH_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GITHUB_ID: process.env.GITHUB_ID,
    GITHUB_SECRET: process.env.GITHUB_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_OPEN_SIGNUP: process.env.NEXT_PUBLIC_OPEN_SIGNUP,
    NEXT_PUBLIC_SHORT_DOMAINS: process.env.NEXT_PUBLIC_SHORT_DOMAINS,
    NEXT_PUBLIC_EMAIL_DOMAINS: process.env.NEXT_PUBLIC_EMAIL_DOMAINS,
    NEXT_PUBLIC_EMAIL_R2_DOMAIN: process.env.NEXT_PUBLIC_EMAIL_R2_DOMAIN,
    CLOUDFLARE_ZONE_ID: process.env.CLOUDFLARE_ZONE_ID,
    CLOUDFLARE_ZONE_NAME: process.env.CLOUDFLARE_ZONE_NAME,
    CLOUDFLARE_API_KEY: process.env.CLOUDFLARE_API_KEY,
    CLOUDFLARE_EMAIL: process.env.CLOUDFLARE_EMAIL,
    SCREENSHOTONE_BASE_URL: process.env.SCREENSHOTONE_BASE_URL,
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
    LinuxDo_CLIENT_ID: process.env.LinuxDo_CLIENT_ID,
    LinuxDo_CLIENT_SECRET: process.env.LinuxDo_CLIENT_SECRET,
  },
});
