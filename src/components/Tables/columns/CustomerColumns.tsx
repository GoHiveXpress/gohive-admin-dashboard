//src/components/Tables/columns/CustomerManagementColumns.tsx
import { BaseColumnSchema } from "../types";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@iconify/react";
import {Button} from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import Link from "next/link";

// --- Types ---
export type CustomerData = {
    _id: string;
    name: string;
    email: string;
    phone: string;
    accountStatus: "Active" | "Inactive" | "Suspend";
    orderCount: number;
};

export type OrderData = {
    _id: string;
    orderId: string;
    customer: string | { name: string };
    vendor: string | { vendorProfile: { businessName: string } };
    rider?: string | { name: string };
    status: string;
};

// --- Customer Columns ---
export const customerColumnsConfig: BaseColumnSchema<CustomerData>[] = [
    {
        key: "name",
        header: "Name",
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
        key: "accountStatus",
        header: "Status",
        render: (row) => {
            let variantClass = "";
            let dotClass = "";

            const status = row.accountStatus || "Active";

            switch (status) {
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
                    {status}
                </Badge>
            );
        },
    },
    {
        key: "orderCount",
        header: "Orders",
        render: (row) => <span className="text-foreground font-medium pl-4">{row.orderCount || 0}</span>,
    },
    {
        key: "action",
        header: "Action", // Added Action header for better visibility
        render: (row) => (
            <Link href={ROUTES.CUSTOMER_DETAILS(row._id)}>
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
        render: (row) => <span className="text-foreground">{typeof row.customer === 'object' ? row.customer.name : row.customer}</span>,
    },
    {
        key: "vendor",
        header: "Vendor",
        render: (row) => (
            <div className="flex flex-col">
                <span className="text-foreground">
                    {typeof row.vendor === 'object' ? row.vendor.vendorProfile.businessName : row.vendor}
                </span>
            </div>
        ),
    },
    {
        key: "rider",
        header: "Rider",
        render: (row) => <span className="text-foreground">{typeof row.rider === 'object' ? row.rider.name : (row.rider || "N/A")}</span>,
    },
    {
        key: "status",
        header: "Status",
        render: (row) => {
            let variantClass = "";
            let dotClass = "";

            const status = row.status || "pending";

            switch (status.toLowerCase()) {
                case "delivered":
                    variantClass = "bg-secondary/10 text-secondary";
                    dotClass = "bg-secondary";
                    break;
                case "picked up":
                case "picked_up":
                case "ready":
                    variantClass = "bg-[#FDB900]/10 text-[#FDB900]";
                    dotClass = "bg-[#FDB900]";
                    break;
                case "canceled":
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
                case "prepared":
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
                    {status}
                </Badge>
            );
        },
    },
];