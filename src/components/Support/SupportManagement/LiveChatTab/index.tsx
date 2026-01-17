import React from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LiveChatTab() {
	return (
		// Changed to h-full to fit the parent container
		<div className="grid grid-cols-12 gap-6 h-full min-h-[600px]">
			{/* === LEFT COLUMN: Conversation List === */}
			<div className="col-span-3 bg-card border border-border rounded-xl p-4 flex flex-col gap-4 h-full overflow-hidden">
				{/* Filters */}
				<div className="flex gap-2 shrink-0">
					<Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 h-9 text-xs px-0">
						Customer (2)
					</Button>
					<Button variant="outline" className="flex-1 h-9 text-xs bg-transparent px-0">
						Vendor(3)
					</Button>
					<Button variant="outline" className="flex-1 h-9 text-xs bg-transparent px-0">
						Rider (0)
					</Button>
				</div>

				{/* Search & Filter Icon */}
				<div className="flex gap-2 shrink-0">
					<div className="relative flex-1">
						<Icon
							icon="lucide:search"
							className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4"
						/>
						<Input placeholder="Search" className="pl-9 h-10 bg-transparent" />
					</div>
					<Button variant="outline" size="icon" className="h-10 w-10 shrink-0">
						<Icon icon="lucide:sliders-horizontal" className="w-4 h-4" />
					</Button>
					<Button className="h-10 px-4 bg-accent text-white hover:bg-accent/90 shrink-0">
						All
					</Button>
				</div>

				{/* List Header */}
				<div className="flex items-center gap-2 mt-2 shrink-0">
					<Icon
						icon="lucide:message-circle"
						className="text-primary w-5 h-5 fill-current"
					/>
					<h3 className="font-semibold text-lg">Customer Conversations</h3>
				</div>

				{/* List Items (Scrollable) */}
				<div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
					{/* Item 1 (Active) */}
					<div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 cursor-pointer border-l-4 border-primary">
						<div className="relative shrink-0">
							<div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
								<img
									src="https://i.pravatar.cc/150?u=1"
									alt="User"
									className="w-full h-full object-cover"
								/>
							</div>
							<span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-secondary rounded-full border-2 border-card"></span>
						</div>
						<div className="flex-1 min-w-0">
							<div className="flex justify-between items-center mb-0.5">
								<span className="font-medium text-sm truncate">Ade Adeshina</span>
								<span className="text-[10px] text-muted-foreground">8:40 PM</span>
							</div>
							<div className="flex justify-between items-center">
								<span className="text-xs text-muted-foreground truncate">
									Hello
								</span>
								<span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
									2
								</span>
							</div>
						</div>
					</div>
					{/* Item 2 */}
					<div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/30 cursor-pointer">
						<div className="relative shrink-0">
							<div className="w-10 h-10 rounded-full bg-gray-200"></div>
							<span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-secondary rounded-full border-2 border-card"></span>
						</div>
						<div className="flex-1 min-w-0">
							<div className="flex justify-between items-center mb-0.5">
								<span className="font-medium text-sm">Kingsley Adams</span>
								<span className="text-[10px] text-muted-foreground">8:47 PM</span>
							</div>
							<div className="flex justify-between items-center">
								<span className="text-xs text-muted-foreground">Hello</span>
								<span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
									1
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* === MIDDLE COLUMN: Chat Area === */}
			<div className="col-span-6 bg-card border border-border rounded-xl flex flex-col h-full overflow-hidden">
				{/* Header */}
				<div className="p-4 border-b border-border flex items-center justify-between shrink-0">
					<div className="flex items-center gap-2">
						<div className="w-4 h-4 rounded-full border-[3px] border-primary" />
						<div>
							<h3 className="font-semibold text-lg">Live Support Chat</h3>
							<div className="flex items-center gap-2 text-xs text-muted-foreground">
								<span>Ade Adeshina</span>
								<span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
							</div>
						</div>
					</div>
					<Button variant="ghost" size="icon">
						<Icon icon="lucide:more-vertical" />
					</Button>
				</div>

				{/* Messages (Scrollable) */}
				<div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
					{/* Incoming */}
					<div className="flex gap-3">
						<div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
							<img
								src="https://i.pravatar.cc/150?u=1"
								alt=""
								className="w-full h-full object-cover"
							/>
						</div>
						<div>
							<div className="bg-muted px-4 py-2 rounded-2xl rounded-tl-none text-sm text-foreground max-w-xs">
								Hello
							</div>
							<span className="text-[10px] text-muted-foreground mt-1 block">
								10:01 am
							</span>
						</div>
					</div>
					<div className="flex gap-3">
						<div className="w-8 h-8 opacity-0 flex-shrink-0" />
						<div>
							<div className="bg-muted px-4 py-2 rounded-2xl rounded-tl-none text-sm text-foreground max-w-xs">
								I need help with a delivery...
							</div>
						</div>
					</div>
					{/* Outgoing */}
					<div className="flex gap-3 justify-end">
						<div>
							<div className="bg-primary px-4 py-3 rounded-2xl rounded-br-none text-sm text-primary-foreground max-w-xs shadow-sm">
								Hi, Adeshina <br />
								You can provide the Delivery ID number and the date you...
							</div>
							<span className="text-[10px] text-muted-foreground mt-1 block text-right">
								10:02 am
							</span>
						</div>
						<div className="w-8 h-8 rounded-full bg-gray-800 overflow-hidden flex-shrink-0">
							<img
								src="https://i.pravatar.cc/150?u=2"
								alt=""
								className="w-full h-full object-cover"
							/>
						</div>
					</div>
				</div>

				{/* Input Area */}
				<div className="p-4 border-t border-border flex items-center gap-3 shrink-0">
					<button className="text-muted-foreground hover:text-foreground">
						<Icon icon="lucide:camera" className="w-6 h-6" />
					</button>
					<div className="flex-1 relative">
						<Input
							placeholder="Type a message"
							className="pr-10 rounded-full border-border bg-transparent"
						/>
						<button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
							<Icon icon="lucide:smile" className="w-5 h-5" />
						</button>
					</div>
					<button className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white shadow-md hover:bg-accent/90 transition">
						<Icon icon="lucide:send" className="w-5 h-5 ml-0.5" />
					</button>
				</div>
			</div>

			{/* === RIGHT COLUMN: Profile === */}
			<div className="col-span-3 bg-card border border-border rounded-xl p-6 h-full overflow-y-auto">
				<div className="flex gap-4 border-b border-border pb-4 mb-6">
					<span className="font-semibold text-primary border-b-2 border-primary pb-4 -mb-4 px-1">
						Profile
					</span>
					<span className="text-muted-foreground cursor-pointer">Order history</span>
				</div>

				<div className="flex flex-col gap-6">
					{/* Profile Header */}
					<div>
						<div className="relative w-16 h-16 mb-3">
							<div className="w-full h-full rounded-full bg-gray-200 overflow-hidden">
								<img
									src="https://i.pravatar.cc/150?u=1"
									alt="Profile"
									className="w-full h-full object-cover"
								/>
							</div>
							<span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-secondary rounded-full border-2 border-card"></span>
						</div>
						<h2 className="text-xl font-bold">Ade Adeshina</h2>
						<div className="flex items-center gap-2 mt-1">
							<span className="text-xs text-muted-foreground">User ID Number:</span>
							<span className="text-xs border border-border rounded-full px-2 py-0.5">
								CGHV0923
							</span>
						</div>
					</div>

					{/* Details */}
					<div className="space-y-4">
						<div className="flex items-center gap-3">
							<Icon icon="lucide:mail" className="text-muted-foreground w-4 h-4" />
							<span className="text-sm text-muted-foreground truncate flex-1">
								adeadeshina@gmail.com
							</span>
							<Icon
								icon="lucide:copy"
								className="text-muted-foreground w-3.5 h-3.5 cursor-pointer"
							/>
						</div>
						<div className="flex items-center gap-3">
							<Icon icon="lucide:phone" className="text-muted-foreground w-4 h-4" />
							<span className="text-sm text-muted-foreground flex-1">
								+23490563019
							</span>
							<Icon
								icon="lucide:copy"
								className="text-muted-foreground w-3.5 h-3.5 cursor-pointer"
							/>
						</div>
						<div className="flex items-center gap-3">
							<Icon
								icon="lucide:calendar"
								className="text-muted-foreground w-4 h-4"
							/>
							<span className="text-sm text-muted-foreground">Nov 12 1988</span>
						</div>
						<div className="flex items-start gap-3">
							<Icon
								icon="lucide:map-pin"
								className="text-muted-foreground w-4 h-4 mt-1"
							/>
							<span className="text-sm text-muted-foreground leading-relaxed">
								Offa, Kwara State. Nigeria
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
