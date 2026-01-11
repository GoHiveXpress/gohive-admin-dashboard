//src/components/_widgets/TotalRiders/index.tsx
"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";
import { ROUTES, getRoute } from "@/constants/routes";

export default function TotalRiders() {
  return (
    <div className="bg-white rounded-[20px] p-5 shadow-sm border border-border/50 flex flex-col justify-between h-full">
      <div className="flex justify-between items-start">
        <div className="h-12 w-12 rounded-full border-2 border-primary/20 flex items-center justify-center">
            <Icon icon="ph:moped-fill" className="text-primary" width="24" />
        </div>
        <div className="bg-primary text-foreground text-[10px] font-bold px-3 py-1 rounded-full">
            Total Riders
        </div>
      </div>
      <div>
        <h2 className="text-3xl font-bold text-foreground mt-4 mb-1">547</h2>
        <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-secondary flex items-center gap-1">
                450 <span className="text-muted-foreground font-normal">Online</span>
            </span>
            
            {/* LINK WRAPPER START */}
            <Link 
              href={getRoute(ROUTES.ACTIVE_USERS, { tab: 'riders' })} 
              className="cursor-pointer hover:bg-muted/50 p-1 rounded-full transition-colors"
            >
              <Icon icon="ph:dots-three-vertical-bold" className="text-muted-foreground" width="20" />
            </Link>
            {/* LINK WRAPPER END */}

        </div>
      </div>
    </div>
  );
}