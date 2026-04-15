import { BaseColumnSchema } from "@/components/Tables/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";

export type OrderData = {
    _id: string;
    orderId: string;
    customer: { name: string; email: string };
    vendor: { vendorProfile: { businessName: string } };
    rider?: { name: string; phone: string };
    status: string;
    // Extra fields if needed for the modal
    item?: string;
    date?: string;
    location?: string;
    amount?: string;
};

// Function wrapper to inject the onView handler
export const getCustomerOrderManagementColumns = (
    onView: (row: OrderData) => void
): BaseColumnSchema<OrderData>[] => [
    {
        key: "orderId",
        header: "Order ID",
        render: (row) => <span className="text-foreground font-medium">{row.orderId}</span>,
    },
    {
        key: "customer",
        header: "Customer",
        render: (row) => <span className="text-foreground">{row.customer?.name || "N/A"}</span>,
    },
    {
        key: "vendor",
        header: "Vendor",
        render: (row) => <span className="text-foreground">{row.vendor?.vendorProfile?.businessName || "N/A"}</span>,
    },
    {
        key: "rider",
        header: "Rider",
        render: (row) => <span className="text-foreground">{row.rider?.name || "N/A"}</span>,
    },
    {
        key: "status",
        header: "Status",
        render: (row) => {
            let variantClass = "";
            let dotClass = "";

            // Normalize backend status to UI status
            const status = row.status || "pending";

            switch (status) {
                case "delivered":
                    variantClass = "bg-secondary/10 text-secondary";
                    dotClass = "bg-secondary";
                    break;
                case "picked_up":
                case "ready":
                    variantClass = "bg-[#FDB900]/10 text-[#FDB900]";
                    dotClass = "bg-[#FDB900]";
                    break;
                case "cancelled":
                case "rejected":
                case "expired":
                    variantClass = "bg-destructive/10 text-destructive";
                    dotClass = "bg-destructive";
                    break;
                case "placed":
                case "accepted":
                case "pending":
                    variantClass = "bg-green-500/10 text-green-500";
                    dotClass = "bg-green-500";
                    break;
                case "preparing":
                    variantClass = "bg-blue-500/10 text-blue-500";
                    dotClass = "bg-blue-500";
                    break;
                default:
                    variantClass = "bg-muted text-muted-foreground";
                    dotClass = "bg-muted-foreground";
            }

            return (
                <Badge
                    variant="outline"
                    className={`border-none px-3 py-1 rounded-full font-medium ${variantClass}`}
                >
                    <div className={`w-2 h-2 rounded-full mr-2 ${dotClass}`} />
                    {status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")}
                </Badge>
            );
        },
    },
    {
        key: "action",
        header: "Action",
        render: (row) => (
            <Button
                variant="ghost"
                size="icon"
                onClick={() => onView(row)}
                className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-muted"
            >
                <Icon icon="ph:eye" width="20" />
            </Button>
        ),
    },
];