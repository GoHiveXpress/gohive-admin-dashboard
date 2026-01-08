import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
// Fixed: Using default import for cn
import cn from "@/lib/utils";
import "../styles/fonts.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
	title: "Gohive Admin",
	description: "Admin dashboard",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}
			>
				{children}
			</body>
		</html>
	);
}
