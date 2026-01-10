//src/constants/SidebarMenuItems.tsx
import {
  LayoutDashboard,
  Store,
  ClipboardList,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { Icon } from "@iconify/react"; 

const CustomerIcon = ({ className }: { className?: string }) => {
  return (
    <Icon 
      icon="lineicons:emoji-smile-tongue" 
      className={className} 
    />
  );
};

const BikeIcon = ({ className }: { className?: string }) => {
  return (
    <Icon 
      icon="mingcute:ebike-line"
      className={className} 
    />
  );
};
const MessageSquareIcon = ({ className }: { className?: string }) => {
  return (
    <Icon 
      icon="icon-park-outline:message"
      className={className} 
    />
  );
};

const FinanceStatsIcon = ({ className }: { className?: string }) => {
  return (
    <Icon 
      icon="material-symbols:finance-mode"
      className={className} 
    />
  );
};

const BarChart3Icon = ({ className }: { className?: string }) => {
  return (
    <Icon 
      icon="material-symbols:finance-sharp"
      className={className} 
    />
  );
};

const UsersIcon = ({ className }: { className?: string }) => {
  return (
    <Icon 
      icon="fa7-solid:users"
      className={className} 
    />
  );
};

const SettingsIcon = ({ className }: { className?: string }) => {
  return (
    <Icon 
      icon="streamline-plump:cog"
      className={className} 
    />
  );
};

export const MENU_ITEMS = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    variant: "default", 
  },
  {
    label: "Customer Management",
    icon: CustomerIcon, 
    href: "/customers",
  },
  {
    label: "Vendor Management",
    icon: Store,
    href: "/vendors",
  },
  {
    label: "Rider Management",
    icon: BikeIcon,
    href: "/riders",
  },
  {
    label: "Order Lifecycle Management",
    icon: ClipboardList,
    href: "/orders",
  },
  {
    label: "Support & Communication",
    icon: MessageSquareIcon,
    href: "/support",
  },
  {
    label: "Finance & Settlements",
    icon: FinanceStatsIcon,
    href: "/finance",
  },
  {
    label: "Analytics & Reports",
    icon: BarChart3Icon,
    href: "/analytics",
  },
  {
    label: "User Management",
    icon: UsersIcon,
    href: "/users",
  },
];

export const BOTTOM_MENU_ITEMS = [
  {
    label: "Settings",
    icon: SettingsIcon,
    href: "/settings",
  },
  {
    label: "Help",
    icon: HelpCircle,
    href: "/help",
  },
];

export const LOGOUT_ITEM = 
{
  label: "Logout",
  icon: LogOut,
  href: "/logout",
}