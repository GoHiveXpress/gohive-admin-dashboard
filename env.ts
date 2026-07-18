// src/env.ts

import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const isDevelopment = process.env.NODE_ENV !== "production";

export const env = createEnv({
	server: {
		NODE_ENV: z.enum(["development", "test", "production"]),
		NEXTAUTH_SECRET: z.string(),
		NEXTAUTH_URL: z.string().url(),
	},

	client: {
		NEXT_PUBLIC_ADMIN_API_BASE_URL: z.string().regex(/^https?:\/\/.+/, "Invalid API base URL"),
	},

	runtimeEnv: {
		NODE_ENV: process.env.NODE_ENV,
		NEXTAUTH_SECRET:
			process.env.NEXTAUTH_SECRET ??
			(isDevelopment ? "dev-nextauth-secret-change-me" : undefined),
		NEXTAUTH_URL:
			process.env.NEXTAUTH_URL ??
			(isDevelopment ? "http://localhost:3000" : undefined),
		NEXT_PUBLIC_ADMIN_API_BASE_URL:
			process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL ??
			(isDevelopment ? "http://localhost:5000/api" : undefined),
	},

	skipValidation: !!process.env.SKIP_ENV_VALIDATION,
	emptyStringAsUndefined: true,
});

export default env;
