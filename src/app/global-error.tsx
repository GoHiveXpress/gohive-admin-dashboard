// src/app/global-error.tsx
// Last-resort screen when the root layout itself crashes. Reports to Sentry.

"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
	useEffect(() => {
		Sentry.captureException(error);
	}, [error]);

	return (
		<html lang="en">
			<body className="flex min-h-screen items-center justify-center bg-white p-6 font-sans">
				<div className="max-w-md space-y-3 text-center">
					<h1 className="text-lg font-semibold">The dashboard failed to load</h1>
					<p className="text-sm text-gray-500">
						Something went wrong. Reload the page; if it keeps happening, tell the tech
						team.
					</p>
					{error.digest && (
						<p className="font-mono text-xs text-gray-400">Ref: {error.digest}</p>
					)}
					<button
						type="button"
						onClick={() => window.location.reload()}
						className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
					>
						Reload
					</button>
				</div>
			</body>
		</html>
	);
}
