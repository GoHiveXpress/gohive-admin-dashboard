"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/Tables";
import { getColumns } from "@/components/Tables/columns/columnFactory";
import { 
    getCustomerOrderManagementColumns, 
    OrderData 
} from "@/components/Tables/columns/customerOrderManagementColumns";
import OrderProcessModal from "@/components/_modals/OrderProcessModal";

// Assuming we map OrderData to the shape required by OrderHistory in the modal
// or simply use OrderData if they are compatible. 
// For this example, we'll cast or match the type.

const ORDER_DATA: OrderData[] = [
    { id: "1", orderId: "#OD4567", customer: "Victor Kenny", vendor: "Chicken Republic", rider: "James James", status: "Delivered", item: "Rice", location: "Lagos", amount: "₦5000", date: "2023-10-10" },
    { id: "2", orderId: "#OD4589", customer: "Ade Ade", vendor: "Chicken Republic", rider: "James James", status: "Picked up", item: "Burger", location: "Lagos", amount: "₦3000", date: "2023-10-11" },
    { id: "3", orderId: "#OD2338", customer: "Kim Kim", vendor: "Unique", rider: "James James", status: "Canceled", item: "Pizza", location: "Lagos", amount: "₦8000", date: "2023-10-12" },
];

export default function OrderManagementTabList() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

    const handleViewOrder = (order: OrderData) => {
        // Map OrderData to the structure expected by the Modal if necessary
        // Assuming Modal expects generic order fields
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedOrder(null);
    };

    return (
        <div className="space-y-6">
            {/* Live Orders Stats Header */}
            <div>
                <h2 className="text-xl font-bold text-foreground mb-4">Live Orders</h2>
                <div className="flex flex-wrap gap-3">
                    <Badge className="bg-secondary text-white hover:bg-secondary rounded-full px-3 py-1 font-normal">
                        <span className="font-bold mr-1">3</span> In progress
                    </Badge>
                    <Badge className="bg-[#FF4500] text-white hover:bg-[#FF4500] rounded-full px-3 py-1 font-normal">
                        <span className="font-bold mr-1">3</span> En route
                    </Badge>
                    <Badge className="bg-[#FDB900] text-white hover:bg-[#FDB900] rounded-full px-3 py-1 font-normal">
                        <span className="font-bold mr-1">9</span> Pending
                    </Badge>
                    <Badge className="bg-[#FF6B6B] text-white hover:bg-[#FF6B6B] rounded-full px-3 py-1 font-normal">
                        <span className="font-bold mr-1">2</span> Delayed
                    </Badge>
                    <Badge className="bg-[#A52A2A] text-white hover:bg-[#A52A2A] rounded-full px-3 py-1 font-normal">
                        <span className="font-bold mr-1">0</span> Canceled
                    </Badge>
                </div>
            </div>

            {/* Order Filters */}
            <div className="flex flex-wrap gap-3 items-center mt-4">
                <Button variant="outline" className="h-10 w-10 p-0 rounded-lg border-border bg-white">
                    <Icon icon="ph:sliders-horizontal" width="20" />
                </Button>
                <Button variant="outline" className="h-10 rounded-lg border-border bg-white px-4 font-medium justify-between min-w-[100px]">
                    status <Icon icon="ph:caret-down" className="ml-2" />
                </Button>
                <Button variant="outline" className="h-10 rounded-lg border-border bg-white px-4 font-medium">
                    Vendor
                </Button>
                <Button variant="outline" className="h-10 rounded-lg border-border bg-white px-4 font-medium">
                    Location
                </Button>
            </div>

            {/* Map Placeholder */}
            <div className="w-full h-64 bg-[#F5F5F0] rounded-[20px] border border-border/20 flex items-center justify-center text-muted-foreground/30">
               <Icon icon="ph:map-trifold" className="w-12 h-12 opacity-20" />
            </div>

            {/* Legend */}
            <div className="flex justify-end gap-4 text-[10px] text-foreground font-medium">
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-secondary"></div> Placed</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Prepared</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#FDB900]"></div> Picked Up</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-700"></div> Delivered</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-destructive"></div> Canceled</div>
            </div>

            {/* Orders Table with Action Column */}
            <DataTable
                columns={getColumns(getCustomerOrderManagementColumns(handleViewOrder))}
                data={ORDER_DATA}
                title=""
            />

            {/* Modal */}
            <OrderProcessModal 
                isOpen={isModalOpen} 
                onClose={handleCloseModal} 
                data={selectedOrder} 
            />
        </div>
    );
}