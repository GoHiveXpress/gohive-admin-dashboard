//src/components/List/VendorList/index.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icon } from "@iconify/react";
import { DataTable } from "@/components/Tables";
import { getColumns } from "@/components/Tables/columns/columnFactory";
import { vendorColumnsConfig, VendorData } from "@/components/Tables/columns/VendorManagementColumns";
import { useVendors } from "@/hooks/vendorManagement";
import { Loader2 } from "lucide-react";

export default function VendorList() {
    const { data, isLoading } = useVendors();

    // Map backend data to table format
    const vendorTableData: VendorData[] = data?.data?.map((vendor) => ({
        id: vendor._id,
        name: vendor.vendorProfile?.businessName || vendor.name, // Prefer Business Name
        email: vendor.email,
        phone: vendor.phone || "N/A",
        // Logic: Verified email = Active status for now (customize as needed)
        status: vendor.vendorProfile?.isApproved ? "Active" : "Inactive", 
        // Logic: Approved profile = Verified KYC
        kyc: vendor.vendorProfile?.isApproved ? "Verified" : "Unverified",
        rating: 0.0, // Backend doesn't provide rating yet, defaulting to 0
    })) || [];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-secondary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Filters Row */}
            <div className="flex flex-wrap gap-3 items-center">
                {/* Search Bar */}
                <div className="relative w-full sm:w-[300px]">
                    <Icon
                        icon="ph:magnifying-glass"
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5"
                    />
                    <Input
                        placeholder="Search"
                        className="pl-10 h-12 rounded-lg border-border bg-white"
                    />
                </div>

                {/* Filter Icon Button */}
                <Button
                    variant="outline"
                    className="h-12 w-12 p-0 rounded-lg border-border bg-white"
                >
                    <Icon icon="ph:sliders-horizontal" width="20" />
                </Button>

                {/* All (Active Filter) */}
                <Button
                    className="h-12 rounded-lg px-6 font-medium bg-primary text-primary-foreground hover:bg-primary/90"
                >
                    All
                </Button>

                {/* A-Z */}
                <Button
                    variant="outline"
                    className="h-12 rounded-lg border-border bg-white px-6 font-medium"
                >
                    A-Z
                </Button>

                {/* Status Dropdown */}
                <Button
                    variant="outline"
                    className="h-12 rounded-lg border-border bg-white px-6 font-medium justify-between min-w-[120px]"
                >
                    status <Icon icon="ph:caret-down" className="ml-2" />
                </Button>

                {/* Location Dropdown */}
                <Button
                    variant="outline"
                    className="h-12 rounded-lg border-border bg-white px-6 font-medium justify-between min-w-[130px]"
                >
                    Location <Icon icon="ph:caret-down" className="ml-2" />
                </Button>
            </div>

            {/* Table */}
            <DataTable
                columns={getColumns(vendorColumnsConfig)}
                data={vendorTableData}
                title=""
            />
        </div>
    );
}