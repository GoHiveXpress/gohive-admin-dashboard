//src/app/(gatedPages)/rider-management/[id]/client.tsx
"use client";

import RouteWrapper from "@/layouts/RouteWrapper";


interface ClientProps {
  id: string;
}

export default function RiderDetailsClient({ id }: ClientProps) {
  return (
    <RouteWrapper 
      middleSlot={<div className="text-2xl font-semibold">Rider Details</div>} 
    />
  );
}