//src/layouts/AuthenticatedLayout.tsx
import React from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

type AuthenticatedLayoutProps = {
  children: React.ReactNode;
};

export default function AuthenticatedLayout({
  children,
}: AuthenticatedLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Sidebar - Fixed Position */}
      <Sidebar />

      {/* Main Content Area - Pushed right by sidebar width on desktop */}
      <div className="lg:pl-[280px] flex flex-col min-h-screen transition-all duration-300">
        <Navbar />
        
        <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}