// src/layouts/AuthenticatedLayout.tsx
import React from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

type AuthenticatedLayoutProps = {
	children: React.ReactNode;
};

export default function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
	return (
		<div className="min-h-screen bg-gray-50/50">
			{/* Sidebar - Fixed Position */}
			<Sidebar />

			{/* Main Content Area - Pushed right by sidebar width on desktop */}
			<div className="flex min-h-screen flex-col transition-all duration-300 lg:pl-[280px]">
				<Navbar />

				<main className="flex-1 overflow-x-hidden p-4 lg:p-8">{children}</main>
			</div>
		</div>
	);
}
