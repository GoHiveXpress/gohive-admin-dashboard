// src/app/(gatedPages)/error.tsx
// A crash inside one screen shows this card; the sidebar and top bar stay usable.

"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export default function GatedPageError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<div
			role="alert"
			className="mx-auto mt-16 flex max-w-md flex-col items-center gap-4 rounded-2xl border bg-white p-8 text-center shadow-sm"
		>
			<div className="bg-destructive/10 text-destructive flex size-12 items-center justify-center rounded-full">
				<AlertTriangle className="size-6" aria-hidden />
			</div>
			<div className="space-y-1">
				<h2 className="text-foreground text-lg font-semibold">This page failed to load</h2>
				<p className="text-muted-foreground text-sm">
					Something went wrong while showing this screen. Try again, or go back to the
					dashboard.
				</p>
				{error.digest && (
					<p className="text-muted-foreground pt-2 font-mono text-xs">
						Ref: {error.digest}
					</p>
				)}
			</div>
			<div className="flex gap-2">
				<Button onClick={reset}>Try again</Button>
				<Button variant="outline" asChild>
					<Link href={ROUTES.DASHBOARD}>Go to dashboard</Link>
				</Button>
			</div>
		</div>
	);
}
