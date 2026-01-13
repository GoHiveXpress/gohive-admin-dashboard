import { BaseColumnSchema } from "@/components/Tables/types";
import { Badge } from "@/components/ui/badge";

// Types
export type OrderHistory = {
    id: string;
    orderId: string;
    status: "Delivered" | "Pending" | "Canceled" | "Placed" | "Prepared" | "Picked Up";
    date: string;
    vendor: string;
    location: string;
    amount: string;
    customer: string;
    rider: string;
    item: string;
};

// Column Config - No Action Column
export const orderHistoryColumns: BaseColumnSchema<OrderHistory>[] = [
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
                case "Pending":
                case "Placed":
                case "Prepared":
                case "Picked Up":
                    variantClass = "bg-[#FDB900]/10 text-[#FDB900]";
                    dotClass = "bg-[#FDB900]";
                    break;
                case "Canceled":
                    variantClass = "bg-destructive/10 text-destructive";
                    dotClass = "bg-destructive";
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
                    {row.status}
                </Badge>
            );
        },
    },
    { key: "date", header: "Date" },
    { key: "vendor", header: "Vendor" },
    {
        key: "location",
        header: "Location",
        render: (row) => <div className="truncate max-w-[150px]">{row.location}</div>,
    },
    {
        key: "amount",
        header: "Amount",
        render: (row) => <span className="font-semibold">{row.amount}</span>,
    },
];