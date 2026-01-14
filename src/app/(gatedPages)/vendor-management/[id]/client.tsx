"use client";

import RouteWrapper from "@/layouts/RouteWrapper";
import VendorDetailsIndex from "@/components/Vendor/VendorDetails";

interface ClientProps {
  id: string;
}

export default function VendorDetailsClient({ id }: ClientProps) {
  return (
    <RouteWrapper 
      middleSlot={<VendorDetailsIndex vendorId={id} />} 
    />
  );
}