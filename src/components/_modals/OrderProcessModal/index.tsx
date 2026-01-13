"use client";

import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { OrderHistory } from "@/components/Tables/columns/orderHistoryColumns";

interface OrderProcessModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: OrderHistory | null;
}

export default function OrderProcessModal({ isOpen, onClose, data }: OrderProcessModalProps) {
    if (!isOpen || !data) return null;

    // Timeline Configuration based on status
    const steps = [
        { label: "Placed", key: "placed" },
        { label: "Prepared", key: "prepared" },
        { label: "Picked Up", key: "picked_up" },
        { label: "Delivered", key: "delivered" },
    ];

    // Helper to determine step state (completed, current, error, pending)
    const getStepState = (stepIndex: number) => {
        // Mock logic for demonstration. Real logic would depend on specific timestamps or status codes
        if (data.status === "Delivered") return "completed";
        if (data.status === "Canceled") {
            if (stepIndex === 0) return "completed";
            if (stepIndex === 1) return "error"; // Show Red X on Prepared for demo
            return "pending";
        }
        // Pending logic
        if (stepIndex === 0) return "completed";
        if (stepIndex === 1) return "completed"; // Assume prepared
        if (stepIndex === 2) return "completed"; // Assume picked up
        return "pending"; 
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-[600px] rounded-[20px] shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
                
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
                    <div className="bg-[#F9FAFB] rounded-lg p-4 grid grid-cols-5 gap-4 text-sm">
                        {/* Headers */}
                        <div className="font-semibold text-muted-foreground">Order ID</div>
                        <div className="font-semibold text-muted-foreground">Item</div>
                        <div className="font-semibold text-muted-foreground">Vendor</div>
                        <div className="font-semibold text-muted-foreground">Customer</div>
                        <div className="font-semibold text-muted-foreground">Rider</div>

                        {/* Values */}
                        <div className="font-medium text-foreground">{data.orderId || "#OD4567"}</div>
                        <div className="font-medium text-foreground">{data.item || "Food"}</div>
                        <div className="font-medium text-foreground">{data.vendor}</div>
                        <div className="font-medium text-foreground">{data.customer || "John Doe"}</div>
                        <div className="font-medium text-foreground">{data.rider || "James"}</div>
                    </div>

                    {/* Timeline Visual */}
                    <div className="relative px-4">
                        {/* Connecting Line background */}
                        <div className="absolute top-[14px] left-[30px] right-[30px] h-[3px] bg-gray-200 -z-10" />
                        
                        {/* Colored Progress Line (Adjust width based on status) */}
                        <div 
                            className={`absolute top-[14px] left-[30px] h-[3px] transition-all duration-500 -z-0
                                ${data.status === 'Canceled' ? 'bg-destructive w-[33%]' : 'bg-[#FDB900]'}
                                ${data.status === 'Delivered' ? 'w-[85%]' : ''}
                                ${data.status === 'Pending' ? 'w-[60%]' : ''}
                            `} 
                        />

                        <div className="flex justify-between items-start">
                            {steps.map((step, index) => {
                                const state = getStepState(index);
                                
                                return (
                                    <div key={step.key} className="flex flex-col items-center gap-2">
                                        {/* Circle Icon */}
                                        <div className={`
                                            w-8 h-8 rounded-full flex items-center justify-center text-white text-sm z-10 border-[3px]
                                            ${state === 'completed' ? 'bg-[#FDB900] border-[#FDB900]' : ''}
                                            ${state === 'error' ? 'bg-destructive border-destructive' : ''}
                                            ${state === 'pending' ? 'bg-gray-200 border-gray-200' : ''}
                                        `}>
                                            {state === 'completed' && <Icon icon="ph:check-bold" />}
                                            {state === 'error' && <Icon icon="ph:x-bold" />}
                                        </div>
                                        
                                        {/* Label */}
                                        <span className="text-xs font-medium text-foreground">{step.label}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Conditional Action Button (Only for Canceled) */}
                    {data.status === "Canceled" && (
                        <div className="pt-2">
                            <Button className="w-full h-12 rounded-lg bg-secondary hover:bg-secondary/90 text-white font-medium text-base">
                                Resolve Cancelation
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}