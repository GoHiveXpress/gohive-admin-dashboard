"use client";

import RouteWrapper from "@/layouts/RouteWrapper";
import CustomerManagementTab from "@/components/CustomerManagementTab";

export default function CustomerManagementClient() {
	return (
		<RouteWrapper
			middleSlot={
				<div className="w-full">
					<CustomerManagementTab />
				</div>
			}
		/>
	);
}
