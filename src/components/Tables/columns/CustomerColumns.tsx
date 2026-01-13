//src/components/Tables/columns/CustomerManagementColumns.tsx
import { BaseColumnSchema } from "../types";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@iconify/react";
import {Button} from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import Link from "next/link";

// --- Types ---
export type CustomerData = {
    id: string;
    name: string;
    email: string;
    phone: string;
    status: "Active" | "Inactive" | "Suspend";
    orders: number;
};

export type OrderData = {
    id: string;
    orderId: string;
    customer: string;
    vendor: string;
    rider: string;
    status: "Delivered" | "Picked up" | "Canceled" | "Placed" | "Prepared";
};

// --- Customer Columns ---
export const customerColumnsConfig: BaseColumnSchema<CustomerData>[] = [
    {
        key: "name",
        header: "Name",
        // UPDATED: Just text, no link here anymore
        render: (row) => <span className="text-foreground font-medium">{row.name}</span>,
    },
    {
        key: "email",
        header: "Email",
        render: (row) => <span className="text-foreground">{row.email}</span>,
    },
    {
        key: "phone",
        header: "Phone",
        render: (row) => <span className="text-foreground">{row.phone}</span>,
    },
    {
        key: "status",
        header: "Status",
        render: (row) => {
            let variantClass = "";
            let dotClass = "";

            switch (row.status) {
                case "Active":
                    variantClass = "bg-secondary/10 text-secondary";
                    dotClass = "bg-secondary";
                    break;
                case "Inactive":
                    variantClass = "bg-[#FDB900]/10 text-[#FDB900]";
                    dotClass = "bg-[#FDB900]";
                    break;
                case "Suspend":
                    variantClass = "bg-destructive/10 text-destructive";
                    dotClass = "bg-destructive";
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
        key: "orders",
        header: "Orders",
        render: (row) => <span className="text-foreground font-medium pl-4">{row.orders}</span>,
    },
    {
        key: "action",
        header: "",
        render: (row) => (
            // UPDATED: Link moved here, Icon changed to Eye
            <Link href={ROUTES.CUSTOMER_DETAILS(row.id)}>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-muted"
                >
                    <Icon icon="ph:eye" width="20" />
                </Button>
            </Link>
        ),
    },
];

// --- Order Columns ---
export const orderColumnsConfig: BaseColumnSchema<OrderData>[] = [
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
        render: (row) => (
            <div className="flex flex-col">
                <span className="text-foreground">{row.vendor}</span>
            </div>
        ),
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
];