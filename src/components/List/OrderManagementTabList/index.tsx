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
import { useOrders, useOrderStats } from "@/hooks/customerManagement";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export default function OrderManagementTabList() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
    const [status, setStatus] = useState("all");
    const [search, setSearch] = useState("");

    const { data: orderResponse, isLoading, error } = useOrders({ status, search });
    const { data: statsResponse } = useOrderStats();
    
    const orders = orderResponse?.data || [];
    const stats = statsResponse?.data || {
        pending: 0,
        payment_failed: 0,
        placed: 0,
        accepted: 0,
        preparing: 0,
        ready: 0,
        picked_up: 0,
        delivered: 0,
        rejected: 0,
        cancelled: 0,
        expired: 0,
    };

    const handleViewOrder = (order: OrderData) => {
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
                <div className="flex flex-wrap gap-2">
                    <Badge className="bg-[#FDB900] text-white hover:bg-[#FDB900] rounded-full px-3 py-1 font-normal text-[10px]">
                        <span className="font-bold mr-1">{stats.pending}</span> pending
                    </Badge>
                    <Badge className="bg-destructive text-white hover:bg-destructive rounded-full px-3 py-1 font-normal text-[10px]">
                        <span className="font-bold mr-1">{stats.payment_failed}</span> payment_failed
                    </Badge>
                    <Badge className="bg-secondary text-white hover:bg-secondary rounded-full px-3 py-1 font-normal text-[10px]">
                        <span className="font-bold mr-1">{stats.placed}</span> placed
                    </Badge>
                    <Badge className="bg-green-600 text-white hover:bg-green-600 rounded-full px-3 py-1 font-normal text-[10px]">
                        <span className="font-bold mr-1">{stats.accepted}</span> accepted
                    </Badge>
                    <Badge className="bg-blue-500 text-white hover:bg-blue-500 rounded-full px-3 py-1 font-normal text-[10px]">
                        <span className="font-bold mr-1">{stats.preparing}</span> preparing
                    </Badge>
                    <Badge className="bg-cyan-500 text-white hover:bg-cyan-500 rounded-full px-3 py-1 font-normal text-[10px]">
                        <span className="font-bold mr-1">{stats.ready}</span> ready
                    </Badge>
                    <Badge className="bg-[#FF4500] text-white hover:bg-[#FF4500] rounded-full px-3 py-1 font-normal text-[10px]">
                        <span className="font-bold mr-1">{stats.picked_up}</span> picked_up
                    </Badge>
                    <Badge className="bg-green-700 text-white hover:bg-green-700 rounded-full px-3 py-1 font-normal text-[10px]">
                        <span className="font-bold mr-1">{stats.delivered}</span> delivered
                    </Badge>
                    <Badge className="bg-rose-700 text-white hover:bg-rose-700 rounded-full px-3 py-1 font-normal text-[10px]">
                        <span className="font-bold mr-1">{stats.rejected}</span> rejected
                    </Badge>
                    <Badge className="bg-[#A52A2A] text-white hover:bg-[#A52A2A] rounded-full px-3 py-1 font-normal text-[10px]">
                        <span className="font-bold mr-1">{stats.cancelled}</span> cancelled
                    </Badge>
                    <Badge className="bg-gray-500 text-white hover:bg-gray-500 rounded-full px-3 py-1 font-normal text-[10px]">
                        <span className="font-bold mr-1">{stats.expired}</span> expired
                    </Badge>
                </div>
            </div>

            {/* Order Filters */}
            <div className="flex flex-wrap gap-3 items-center mt-4">
                <Button variant="outline" className="h-10 w-10 p-0 rounded-lg border-border bg-white">
                    <Icon icon="ph:sliders-horizontal" width="20" />
                </Button>
                
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="h-10 rounded-lg border-border bg-white px-4 font-medium justify-between min-w-[120px]">
                            {status === "all" ? "Status" : status} <Icon icon="ph:caret-down" className="ml-2" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[180px]">
                        <DropdownMenuItem onClick={() => setStatus("all")}>All Status</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatus("placed")}>Placed</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatus("preparing")}>Preparing</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatus("ready")}>Ready</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatus("picked_up")}>Picked up</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatus("delivered")}>Delivered</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatus("cancelled")}>Cancelled</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

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
            {isLoading ? (
                <div className="w-full h-64 flex items-center justify-center">
                    <Icon icon="line-md:loading-one-column-up-loop" className="w-10 h-10 text-secondary" />
                </div>
            ) : error ? (
                <div className="w-full h-64 flex items-center justify-center text-destructive font-medium">
                    Failed to load orders.
                </div>
            ) : (
                <DataTable
                    columns={getColumns(getCustomerOrderManagementColumns(handleViewOrder))}
                    data={orders}
                    title=""
                />
            )}

            {/* Modal */}
            <OrderProcessModal 
                isOpen={isModalOpen} 
                onClose={handleCloseModal} 
                data={selectedOrder} 
            />
        </div>
    );
}