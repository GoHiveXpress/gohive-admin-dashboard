"use client";

import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { OrderHistory } from "@/components/Tables/columns/orderHistoryColumns";
import { useOrder } from "@/hooks/customerManagement";
import { Skeleton } from "@/components/ui/skeleton";

interface OrderProcessModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: OrderHistory | null;
} 

export default function OrderProcessModal({ isOpen, onClose, data }: OrderProcessModalProps) {
    // Poll for the latest order data in real time
    const { data: orderResponse, isLoading } = useOrder(data?._id || "");
    const currentOrder = orderResponse?.data || data;

    if (!isOpen || !currentOrder) return null;

    const orderStatus = currentOrder.status;

    // Timeline Configuration aligned with exact backend statuses
    const steps = [
        { label: "Placed", key: "placed" },
        { label: "Accepted", key: "accepted" },
        { label: "Preparing", key: "preparing" },
        { label: "Ready", key: "ready" },
        { label: "Picked Up", key: "picked_up" },
        { label: "Delivered", key: "delivered" },
    ];

    const isErrorState = ["cancelled", "rejected", "payment_failed", "expired"].includes(orderStatus);

    // Helper to determine step state
    const getStepState = (stepKey: string) => {
        if (isErrorState) {
            if (stepKey === "placed") return "completed";
            if (stepKey === "accepted") return "error";
            return "pending";
        }

        const statusesOrder = ["pending", "payment_failed", "placed", "accepted", "preparing", "ready", "picked_up", "delivered"];
        const currentIdx = statusesOrder.indexOf(orderStatus);
        const stepIdx = statusesOrder.indexOf(stepKey);

        if (currentIdx >= stepIdx) return "completed";
        return "pending";
    };

    // Calculate Progress Line Width
    let progressWidth = "0%";
    if (isErrorState) {
        progressWidth = "20%"; // Stop early at accepted error
    } else {
        const statusesOrder = ["placed", "accepted", "preparing", "ready", "picked_up", "delivered"];
        const currentIdx = statusesOrder.indexOf(orderStatus);
        if (currentIdx !== -1) {
            // max index is 5, percentages calculate to 0%, 20%, 40%, 60%, 80%, 100%
            progressWidth = `${(currentIdx / (steps.length - 1)) * 100}%`;
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-[700px] rounded-[20px] shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
                
                {/* Header */}
                <div className="flex items-center justify-between p-6 pb-2">
                    <h2 className="text-xl font-bold text-foreground">Order Summary</h2>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={onClose}
                        className="rounded-full bg-muted/50 hover:bg-muted h-8 w-8"
                    >
                        <Icon icon="ph:x-bold" />
                    </Button>
                </div>

                {/* Content */}
                <div className="p-6 pt-2 space-y-8">
                    
                    {/* Data Grid */}
                    {isLoading ? (
                        <div className="space-y-2">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    ) : (
                        <div className="bg-[#F9FAFB] rounded-lg p-4 grid grid-cols-4 gap-4 text-sm text-center">
                            <div className="flex flex-col gap-1">
                                <span className="font-semibold text-muted-foreground">Order ID</span>
                                <span className="font-bold text-foreground">{currentOrder.orderId}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="font-semibold text-muted-foreground">Vendor</span>
                                <span className="font-medium text-foreground">
                                    {typeof currentOrder.vendor === 'object' ? currentOrder.vendor?.vendorProfile?.businessName : currentOrder.vendor}
                                </span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="font-semibold text-muted-foreground">Customer</span>
                                <span className="font-medium text-foreground">
                                    {typeof currentOrder.customer === 'object' ? currentOrder.customer?.name : currentOrder.customer}
                                </span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="font-semibold text-muted-foreground">Rider</span>
                                <span className="font-medium text-foreground">
                                    {typeof currentOrder.rider === 'object' ? currentOrder.rider?.name : (currentOrder.rider || "N/A")}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Timeline Visual */}
                    <div className="relative px-6">
                        {/* Connecting Line background */}
                        <div className="absolute top-[14px] left-[40px] right-[40px] h-[3px] bg-gray-200 -z-10" />
                        
                        {/* Colored Progress Line */}
                        <div 
                            className={`absolute top-[14px] left-[40px] h-[3px] transition-all duration-500 -z-0
                                ${isErrorState ? 'bg-destructive' : 'bg-[#FDB900]'}
                            `}
                            style={{ width: `calc(${progressWidth} - 20px)` }}
                        />

                        <div className="flex justify-between items-start relative z-10 w-full">
                            {steps.map((step) => {
                                const state = getStepState(step.key);
                                
                                return (
                                    <div key={step.key} className="flex flex-col items-center gap-2 -mx-4 group">
                                        {/* Circle Icon */}
                                        <div className={`
                                            w-8 h-8 rounded-full flex items-center justify-center text-white text-sm border-[3px] transition-colors
                                            ${state === 'completed' ? 'bg-[#FDB900] border-[#FDB900]' : ''}
                                            ${state === 'error' ? 'bg-destructive border-destructive' : ''}
                                            ${state === 'pending' ? 'bg-white border-gray-200 text-gray-300' : ''}
                                        `}>
                                            {state === 'completed' && <Icon icon="ph:check-bold" />}
                                            {state === 'error' && <Icon icon="ph:x-bold" />}
                                            {state === 'pending' && <span className="w-2 h-2 rounded-full bg-gray-200"></span>}
                                        </div>
                                        
                                        {/* Label */}
                                        <span className={`text-xs font-semibold whitespace-nowrap 
                                            ${state === 'completed' || state === 'error' ? 'text-foreground' : 'text-muted-foreground'}`
                                        }>
                                            {step.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Conditional Action Button */}
                    {isErrorState && (
                        <div className="pt-4 flex justify-between items-center bg-destructive/5 px-4 py-3 rounded-lg border border-destructive/20">
                           <div className="flex items-center gap-2 text-destructive text-sm font-semibold">
                               <Icon icon="ph:warning-circle-bold" width="20" />
                               Order was {orderStatus.replace('_', ' ')}
                           </div>
                           <Button className="h-9 px-4 rounded-md bg-destructive hover:bg-destructive/90 text-white font-medium text-sm transition-all shadow-sm">
                                View Details
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}