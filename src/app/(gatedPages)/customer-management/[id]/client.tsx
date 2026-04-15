// src/app/(gatedPages)/customer-management/[id]/client.tsx

"use client";

import RouteWrapper from "@/layouts/RouteWrapper";
import SingleCustomerView from "@/components/Customer";

import { useParams } from "next/navigation";

export default function SingleCustomerProfile() {
	const params = useParams();
	const id = params?.id as string;

	return (
		<RouteWrapper
			middleSlot={
				<div className="w-full">
					<SingleCustomerView id={id} />
				</div>
			}
		/>
	);
}
