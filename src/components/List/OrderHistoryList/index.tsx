/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/Tables";
import { getColumns } from "@/components/Tables/columns/columnFactory";
import { orderHistoryColumns } from "@/components/Tables/columns/orderHistoryColumns";
import { useCustomerOrders, useOrders } from "@/hooks/customerManagement";
import { Skeleton } from "@/components/ui/skeleton";

export default function OrderHistoryList({ customerId }: { customerId?: string }) {
	const {
		data: customerOrdersResponse,
		isLoading: isCustomerOrdersLoading,
		error: customerOrdersError,
	} = useCustomerOrders(customerId!);

	const {
		data: allOrdersResponse,
		isLoading: isAllOrdersLoading,
		error: allOrdersError,
	} = useOrders({}); // General list could use filters, but for now empty

	const isLoading = customerId ? isCustomerOrdersLoading : isAllOrdersLoading;
	const error = customerId ? customerOrdersError : allOrdersError;
	const orders = customerId ? customerOrdersResponse?.data : allOrdersResponse?.data;

	if (isLoading) {
		return (
			<div className="space-y-4">
				<Skeleton className="h-10 w-full" />
				<Skeleton className="h-64 w-full" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="text-destructive p-8 text-center">Failed to load order history.</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Filters Section */}
			<div className="mb-6 flex flex-wrap gap-3">
				<Button variant="secondary" className="bg-[#FDB900] text-white hover:bg-[#e5a800]">
					All
				</Button>
				<Button variant="outline" className="bg-white">
					A-Z
				</Button>
				<Button variant="outline" className="min-w-[100px] justify-between bg-white">
					status <Icon icon="ph:caret-down" className="ml-2" />
				</Button>
				<Button variant="outline" className="min-w-[100px] justify-between bg-white">
					date <Icon icon="ph:caret-down" className="ml-2" />
				</Button>
				<Button variant="outline" className="min-w-[100px] justify-between bg-white">
					Location <Icon icon="ph:caret-down" className="ml-2" />
				</Button>
			</div>

			{/* Table - Modal/Action removed */}
			<DataTable columns={getColumns(orderHistoryColumns)} data={orders || []} title="" />
		</div>
	);
}

/* eslint-enable */
