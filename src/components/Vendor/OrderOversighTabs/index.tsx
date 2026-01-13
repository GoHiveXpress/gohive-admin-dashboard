"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icon } from "@iconify/react";
import LiveOrderVendorCards from "@/components/cards/LiveOrderVendorCards";

export default function OrderOversightTabs() {
    return (
        <div className="w-full">
            {/* Order Oversight Specific Filters */}
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

                {/* Filter Icon */}
                <Button
                    variant="outline"
                    className="h-12 w-12 p-0 rounded-lg border-border bg-white"
                >
                    <Icon icon="ph:sliders-horizontal" width="20" />
                </Button>

                {/* All */}
                <Button
                    className="h-12 rounded-lg px-6 font-medium bg-primary text-primary-foreground hover:bg-primary/90"
                >
                    All
                </Button>

                {/* Today */}
                <Button
                    variant="outline"
                    className="h-12 rounded-lg border-border bg-white px-6 font-medium"
                >
                    Today
                </Button>

                {/* Delayed Dropdown */}
                <Button
                    variant="outline"
                    className="h-12 rounded-lg border-border bg-white px-6 font-medium justify-between min-w-[130px]"
                >
                    Delayed <Icon icon="ph:caret-down" className="ml-2" />
                </Button>
            </div>

            {/* Live Orders Section */}
            <LiveOrderVendorCards />
        </div>
    );
}