//src/app/(gatedPages)/rider-management/[id]/page.tsx
import RiderDetailsClient from "./client";

export default function RiderDetailsPage({ params }: { params: { id: string } }) {
  return <RiderDetailsClient id={params.id} />;
}