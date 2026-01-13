import { BaseColumnSchema } from "@/components/Tables/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";

export type OrderData = {
    id: string;
    orderId: string;
    customer: string;
    vendor: string;
    rider: string;
    status: "Delivered" | "Picked up" | "Canceled" | "Placed" | "Prepared";
    // Extra fields for the modal simulation
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
        render: (row) => <span className="text-foreground">{row.customer}</span>,
    },
    {
        key: "vendor",
        header: "Vendor",
        render: (row) => <span className="text-foreground">{row.vendor}</span>,
    },
    {
        key: "rider",
        header: "Rider",
        render: (row) => <span className="text-foreground">{row.rider}</span>,
    },
    {
        key: "status",
        header: "Status",
        render: (row) => {
            let variantClass = "";
            let dotClass = "";

            switch (row.status) {
                case "Delivered":
                    variantClass = "bg-secondary/10 text-secondary";
                    dotClass = "bg-secondary";
                    break;
                case "Picked up":
                    variantClass = "bg-[#FDB900]/10 text-[#FDB900]";
                    dotClass = "bg-[#FDB900]";
                    break;
                case "Canceled":
                    variantClass = "bg-destructive/10 text-destructive";
                    dotClass = "bg-destructive";
                    break;
                case "Placed":
                    variantClass = "bg-green-500/10 text-green-500";
                    dotClass = "bg-green-500";
                    break;
                case "Prepared":
                    variantClass = "bg-blue-500/10 text-blue-500";
                    dotClass = "bg-blue-500";
                    break;
            }

            return (
                <Badge
                    variant="outline"
                    className={`border-none px-3 py-1 rounded-full font-medium ${variantClass}`}
                >
                    <div className={`w-2 h-2 rounded-full mr-2 ${dotClass}`} />
                    {row.status}
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