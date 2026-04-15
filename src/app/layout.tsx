// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import { cn } from "@/lib/utils";
import "../styles/fonts.css";
import ReactQueryProvider from "@src/providers/ReactQueryProvider";
import { Toaster } from "@src/components/ui/sonner";
import { type ReactNode } from "react";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
	title: "Gohive Admin",
	description: "Admin dashboard",
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en">
			<body
				className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}
			>
				<ReactQueryProvider>
					{children}
					<Toaster richColors position="top-right" />
				</ReactQueryProvider>
			</body>
		</html>
	);
}
