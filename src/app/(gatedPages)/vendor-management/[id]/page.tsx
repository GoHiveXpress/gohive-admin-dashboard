import VendorDetailsClient from "./client";

export default function VendorDetailsPage({ params }: { params: { id: string } }) {
  return <VendorDetailsClient id={params.id} />;
}