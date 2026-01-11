import { BaseColumnSchema } from "../types";
import { Icon } from "@iconify/react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";

// Define the Data Type matching the screenshot
export type ActiveUserData = {
  id: string;
  name: string;
  userType: "Rider" | "Vendor";
  userId: string; // e.g. RGHV0923
  image: string;
  location: string;
  phone: string;
  status: "Active" | "Online" | "Offline";
  activeOrder: string | number; // e.g. "Yes", "No", or "12"
  rating: number;
};

export const activeUsersColumnConfig: BaseColumnSchema<ActiveUserData>[] = [
  {
    key: "name",
    header: "Name",
    render: (row) => (
      <div className="flex items-center gap-3">
        {/* Status Dot Indicator on Avatar */}
        <div className="relative">
            <div className={`absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${
                row.status === 'Active' || row.status === 'Online' ? 'bg-secondary' : 'bg-gray-300'
            }`} />
            <Avatar className="h-10 w-10 ml-3">
                <AvatarImage src={row.image} />
                <AvatarFallback className="bg-muted text-muted-foreground font-medium">
                    {row.name.charAt(0)}
                </AvatarFallback>
            </Avatar>
        </div>
        <div className="flex flex-col">
            <span className="font-bold text-foreground text-sm">{row.name}</span>
            <div className="flex items-center gap-1 border border-border rounded-full px-2 py-0.5 w-fit mt-0.5">
                <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                    {row.userType}'s ID Number: <span className="font-medium text-foreground">{row.userId}</span>
                </span>
            </div>
        </div>
      </div>
    ),
  },
  {
    key: "location",
    header: "Current Location",
    render: (row) => <span className="text-foreground text-sm">{row.location}</span>
  },
  {
    key: "phone",
    header: "Phone",
    render: (row) => <span className="text-foreground text-sm font-medium">{row.phone}</span>
  },
  {
    key: "status",
    header: "Status",
    render: (row) => (
        <Badge 
            variant="outline" 
            className="bg-secondary/10 text-secondary border-none hover:bg-secondary/20 px-3 py-1 rounded-full font-medium"
        >
            <div className="w-2 h-2 rounded-full bg-secondary mr-2" />
            {row.status}
        </Badge>
    )
  },
  {
    key: "activeOrder",
    header: "Active Order",
    render: (row) => {
        // Styling active orders (Green for Yes, Red for No, Gray for Numbers)
        let bgClass = "bg-muted text-foreground"; // Default gray for numbers
        let dotClass = "";

        if (row.activeOrder === "Yes") {
            bgClass = "bg-secondary/10 text-foreground border border-secondary/20";
            dotClass = "bg-secondary";
        } else if (row.activeOrder === "No") {
            bgClass = "bg-destructive/10 text-foreground border border-destructive/20";
            dotClass = "bg-destructive";
        }

        return (
            <Badge variant="secondary" className={`rounded-full px-4 py-1 font-normal ${bgClass}`}>
                {dotClass && <div className={`w-2 h-2 rounded-full ${dotClass} mr-2`} />}
                {row.activeOrder}
            </Badge>
        )
    }
  },
  {
    key: "rating",
    header: "Rating",
    render: (row) => (
        <div className="flex items-center gap-1 font-semibold text-foreground">
            <Icon icon="ph:star-fill" className="text-primary" width="16" />
            {row.rating.toFixed(1)}
        </div>
    )
  },
  {
    key: "action",
    header: "",
    render: () => (
        <Button variant="ghost" size="icon" className="h-8 w-8 text-foreground hover:bg-muted">
            <Icon icon="ph:dots-three-vertical-bold" width="20" />
        </Button>
    )
  }
];