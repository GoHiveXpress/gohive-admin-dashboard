// src/constants/SidebarMenuItems.tsx
import { LayoutDashboard, Store, ClipboardList, HelpCircle, LogOut } from "lucide-react";
import { Icon } from "@iconify/react";
import { ROUTES } from "@/constants/routes";

const CustomerIcon = ({ className }: { className?: string }) => (
	<Icon icon="lineicons:emoji-smile-tongue" className={className} />
);

const BikeIcon = ({ className }: { className?: string }) => (
	<Icon icon="mingcute:ebike-line" className={className} />
);

const MessageSquareIcon = ({ className }: { className?: string }) => (
	<Icon icon="icon-park-outline:message" className={className} />
);

const FinanceStatsIcon = ({ className }: { className?: string }) => (
	<Icon icon="material-symbols:finance-mode" className={className} />
);

const BarChart3Icon = ({ className }: { className?: string }) => (
	<Icon icon="material-symbols:finance-sharp" className={className} />
);

const UsersIcon = ({ className }: { className?: string }) => (
	<Icon icon="fa7-solid:users" className={className} />
);

const SettingsIcon = ({ className }: { className?: string }) => (
	<Icon icon="streamline-plump:cog" className={className} />
);

export const MENU_ITEMS = [
	{
		label: "Dashboard",
		icon: LayoutDashboard,
		href: ROUTES.DASHBOARD, // Updated
		variant: "default",
	},
	{
		label: "Customer Management",
		icon: CustomerIcon,
		href: ROUTES.CUSTOMERS, // Updated
	},
	{
		label: "Vendor Management",
		icon: Store,
		href: ROUTES.VENDORS, // Updated
	},
	{
		label: "Rider Management",
		icon: BikeIcon,
		href: ROUTES.RIDERS, // Updated
	},
	{
		label: "Order Lifecycle Management",
		icon: ClipboardList,
		href: ROUTES.ORDERS, // Updated
	},
	{
		label: "Support & Communication",
		icon: MessageSquareIcon,
		href: ROUTES.SUPPORT, // Updated
	},
	{
		label: "Finance & Settlements",
		icon: FinanceStatsIcon,
		href: ROUTES.FINANCE, // Updated
	},
	{
		label: "Analytics & Reports",
		icon: BarChart3Icon,
		href: ROUTES.ANALYTICS, // Updated
	},
	{
		label: "User Management",
		icon: UsersIcon,
		href: ROUTES.USERS, // Updated
	},
];

export const BOTTOM_MENU_ITEMS = [
	{
		label: "Settings",
		icon: SettingsIcon,
		href: ROUTES.SETTINGS, // Updated
	},
	{
		label: "Help",
		icon: HelpCircle,
		href: ROUTES.HELP, // Updated
	},
];

export const LOGOUT_ITEM = {
	label: "Logout",
	icon: LogOut,
	href: ROUTES.LOGOUT, // Updated
};
