//src/components/Tables/columns/RiderManagementColumns.tsx
import { BaseColumnSchema } from "../types";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import Link from "next/link"; 


export type RiderData = {
    id: string;
    name: string;
    email: string;
    phone: string;
    status: string; 
    kyc: string; 
    rating: number;
};

export const riderColumnsConfig: BaseColumnSchema<RiderData>[] = [
    {
        key: "name",
        header: "Name",
        render: (row) => (
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-secondary" />
                <span className="text-foreground font-medium">{row.name}</span>
            </div>
        ),
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
        render: (row) => (
            <Badge
                variant="outline"
                className="border-none px-3 py-1 rounded-full font-medium bg-secondary/10 text-secondary"
            >
                <div className="w-2 h-2 rounded-full mr-2 bg-secondary" />
                {/* This will now display 'Online', 'Offline', etc. */}
                {row.status}
            </Badge>
        ),
    },
    {
        key: "kyc",
        header: "KYC",
        render: (row) => (
            <Badge
                className="border-none px-4 py-1 rounded-[6px] font-medium bg-secondary text-white hover:bg-secondary/90"
            >
                <div className="w-2 h-2 rounded-full mr-2 bg-white" />
                {/* This will now display 'Approved', 'Pending', etc. */}
                {row.kyc}
            </Badge>
        ),
    },
    {
        key: "rating",
        header: "Rating",
        render: (row) => (
            <div className="flex items-center gap-1">
                <Icon icon="ph:star-fill" className="text-primary w-5 h-5" />
                <span className="text-foreground font-medium">{row.rating.toFixed(1)}</span>
            </div>
        ),
    },
    {
        key: "action",
        header: "",
        render: (row) => (
            <Link href={`/rider-management/${row.id}`}>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-foreground hover:bg-muted">
                    <Icon icon="ph:eye" width="20" />
                </Button>
            </Link>
        ),
    },
];