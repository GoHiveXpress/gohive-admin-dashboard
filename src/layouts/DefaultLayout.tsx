// src/layouts/DefaultLayout.tsx

"use client";

import React, { type ReactNode } from "react";
import Header from "@src/components/Header";
import Footer from "@src/components/Footer";

export default function DefaultLayout({ children }: { children: ReactNode }) {
	return (
		<div className="bg-background text-foreground flex min-h-screen flex-col selection:bg-[hsl(var(--brand))] selection:text-white">
			{/* Fixed Header */}
			<Header />

			{/* Main Content */}
			<main className="animate-in fade-in mx-auto w-full flex-1 duration-500">
				{children}
			</main>

			{/* Professional Footer */}
			<Footer />
		</div>
	);
}
