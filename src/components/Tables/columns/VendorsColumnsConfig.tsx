//src/components/Tables/columns/VendorsColumnsConfig.tsx
import { BaseColumnSchema } from "../types";
import { Icon } from "@iconify/react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Define the Vendor Data Type
export type VendorData = {
  rank: number;
  name: string;
  image: string;
  location: string;
  category: string;
  totalOrder: number;
  avgRating: number;
  deliveryTime: string;
  revenue: string;
  trend: "improving" | "stable" | "declining";
};

export const vendorsColumnConfig: BaseColumnSchema<VendorData>[] = [
  {
    key: "rank",
    header: "Rank",
    render: (row) => (
        <div className="flex items-center gap-2">
            {row.rank <= 3 && <Icon icon="ph:trophy-fill" className={
                row.rank === 1 ? "text-primary" : 
                row.rank === 2 ? "text-secondary" : 
                "text-[#CD7F32]"
            } width="18" />}
            <span className="font-bold">#{row.rank}</span>
        </div>
    )
  },
  {
    key: "name",
    header: "Vendor Name",
    render: (row) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 rounded-lg">
            <AvatarImage src={row.image} />
            <AvatarFallback className="rounded-lg bg-muted text-muted-foreground">V</AvatarFallback>
        </Avatar>
        <span className="font-semibold text-foreground">{row.name}</span>
      </div>
    ),
  },
  {
    key: "location",
    header: "Location",
    render: (row) => <span className="text-muted-foreground text-xs">{row.location}</span>
  },
  {
    key: "category",
    header: "Category",
  },
  {
    key: "totalOrder",
    header: "Total Order",
    render: (row) => row.totalOrder.toLocaleString()
  },
  {
    key: "avgRating",
    header: "Avg Rating",
    render: (row) => (
        <div className="flex items-center gap-1">
            <Icon icon="ph:star-fill" className="text-primary" />
            <span>{row.avgRating}</span>
        </div>
    )
  },
  {
    key: "deliveryTime",
    header: "Delivery Time",
  },
  {
    key: "revenue",
    header: "Revenue",
    render: (row) => <span className="font-semibold">{row.revenue}</span>
  },
  {
    key: "trend",
    header: "Trend",
    render: (row) => {
        const config = {
            improving: { icon: "ph:trend-up-bold", color: "text-secondary", label: "Improving" },
            stable: { icon: "ph:minus-bold", color: "text-primary", label: "Stable" },
            declining: { icon: "ph:trend-down-bold", color: "text-destructive", label: "Declining" }
        }[row.trend];

        return (
            <div className={`flex items-center gap-1 ${config.color} font-medium text-xs`}>
                <Icon icon={config.icon} />
                {config.label}
            </div>
        )
    }
  },
  {
    key: "action",
    header: "",
    render: () => (
        <button className="text-muted-foreground hover:text-foreground">
            <Icon icon="ph:dots-three-vertical-bold" width="20" />
        </button>
    )
  }
];