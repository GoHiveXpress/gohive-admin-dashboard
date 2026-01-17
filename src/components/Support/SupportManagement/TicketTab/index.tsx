import React from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function TicketTab() {
	return (
		<div className="flex flex-col gap-6">
			{/* Top Filter Bar */}
			<div className="flex flex-wrap items-center gap-4">
				<div className="flex gap-2">
					<Button className="h-10 bg-primary text-primary-foreground px-6 hover:bg-primary/90">
						Customer (2)
					</Button>
					<Button variant="outline" className="h-10 bg-transparent">
						Vendor(3)
					</Button>
					<Button variant="outline" className="h-10 bg-transparent">
						Rider (0)
					</Button>
				</div>

				<div className="relative w-64">
					<Icon
						icon="lucide:search"
						className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4"
					/>
					<Input placeholder="Search" className="pl-9 h-10 bg-transparent" />
				</div>

				<Button variant="outline" size="icon" className="h-10 w-10">
					<Icon icon="lucide:sliders-horizontal" className="w-4 h-4" />
				</Button>

				<Button className="h-10 bg-accent text-white px-6 hover:bg-accent/90">All</Button>

				<Button variant="outline" className="h-10 bg-transparent">
					ID
				</Button>
				<Button variant="outline" className="h-10 bg-transparent flex items-center gap-2">
					SLA status <Icon icon="lucide:chevron-down" className="w-4 h-4" />
				</Button>
				<Button variant="outline" className="h-10 bg-transparent flex items-center gap-2">
					Issue type <Icon icon="lucide:chevron-down" className="w-4 h-4" />
				</Button>
			</div>

			<div className="flex items-center gap-2">
				<h2 className="text-2xl font-medium">Customer Support Tickets (2)</h2>
			</div>

			<div className="grid grid-cols-12 gap-6 h-[600px]">
				{/* === LEFT: Ticket Grid === */}
				<div className="col-span-5 space-y-4 overflow-y-auto pr-2">
					{/* Ticket Card 1 */}
					<div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-3 cursor-pointer hover:border-primary/50 transition">
						<span className="text-xs border border-border rounded-full px-3 py-1 bg-background">
							RGHV0923
						</span>
						<h3 className="text-lg font-medium leading-tight">
							How can i apply for Hive Coupon?
						</h3>
						<span className="text-xs text-muted-foreground block">
							Asked 2 days ago
						</span>

						<div className="flex items-center justify-between mt-4">
							<div className="flex -space-x-2">
								{[1, 2, 3].map((i) => (
									<div
										key={i}
										className="w-7 h-7 rounded-full bg-gray-200 border-2 border-white overflow-hidden"
									>
										<img
											src={`https://i.pravatar.cc/150?u=${i + 10}`}
											className="w-full h-full object-cover"
										/>
									</div>
								))}
								<div className="w-7 h-7 rounded-full bg-white border-2 border-gray-100 flex items-center justify-center text-[10px] text-muted-foreground shadow-sm">
									+
								</div>
							</div>
							<span className="text-[10px] text-muted-foreground">
								2 agents answered this.
							</span>
						</div>

						<div className="flex items-center justify-between pt-2">
							<div className="flex items-center gap-2">
								<div className="w-6 h-6 rounded-full overflow-hidden">
									<img
										src="https://i.pravatar.cc/150?u=50"
										className="w-full h-full object-cover"
									/>
								</div>
								<span className="text-xs font-medium">Rose Mary</span>
								<span className="w-2 h-2 rounded-full bg-secondary"></span>
							</div>
							<div className="flex items-center gap-2">
								<span className="text-xs bg-secondary/10 text-secondary px-3 py-1 rounded-full font-medium">
									Active
								</span>
								<Icon
									icon="lucide:more-horizontal"
									className="text-muted-foreground"
								/>
							</div>
						</div>
					</div>

					{/* Ticket Card 2 */}
					<div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-3 opacity-80 hover:opacity-100 transition">
						<span className="text-xs border border-border rounded-full px-3 py-1 bg-background">
							RGHV0923
						</span>
						<h3 className="text-lg font-medium leading-tight">
							How can i apply for Hive Coupon?
						</h3>
						<span className="text-xs text-muted-foreground block">
							Asked 30 min ago
						</span>

						<div className="mt-4">
							<div className="w-7 h-7 rounded-full border border-dashed border-muted-foreground flex items-center justify-center text-muted-foreground">
								<Icon icon="lucide:plus" className="w-4 h-4" />
							</div>
							<span className="text-[10px] text-muted-foreground block mt-1">
								No answers yet.
							</span>
						</div>

						<div className="flex items-center justify-between pt-2">
							<div className="flex items-center gap-2">
								<div className="w-6 h-6 rounded-full overflow-hidden">
									<img
										src="https://i.pravatar.cc/150?u=1"
										className="w-full h-full object-cover"
									/>
								</div>
								<span className="text-xs font-medium">Ade Adeshina</span>
								<span className="w-2 h-2 rounded-full bg-primary"></span>
							</div>
							<div className="flex items-center gap-2">
								<span className="text-xs bg-red-100 text-destructive px-3 py-1 rounded-full font-medium">
									Closed
								</span>
								<Icon
									icon="lucide:more-horizontal"
									className="text-muted-foreground"
								/>
							</div>
						</div>
					</div>
				</div>

				{/* === RIGHT: Chat Details (Reuse logic from Live Chat but smaller header) === */}
				<div className="col-span-7 bg-card border border-border rounded-xl flex flex-col h-full">
					<div className="p-4 border-b border-border flex items-center justify-between">
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

					<div className="flex-1 overflow-y-auto p-4 space-y-6">
						{/* Sample Messages */}
						<div className="flex gap-3">
							<div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
								<img
									src="https://i.pravatar.cc/150?u=50"
									className="w-full h-full object-cover"
								/>
							</div>
							<div>
								<div className="bg-muted px-4 py-2 rounded-2xl rounded-tl-none text-sm max-w-xs">
									Hello
								</div>
								<span className="text-[10px] text-muted-foreground mt-1 block">
									10:01 am
								</span>
							</div>
						</div>
						<div className="flex gap-3 justify-end">
							<div>
								<div className="bg-primary px-4 py-3 rounded-2xl rounded-br-none text-sm text-primary-foreground max-w-xs shadow-sm">
									Hi, Adeshina...
								</div>
								<span className="text-[10px] text-muted-foreground mt-1 block text-right">
									10:02 am
								</span>
							</div>
							<div className="w-8 h-8 rounded-full bg-gray-800 overflow-hidden flex-shrink-0">
								<img
									src="https://i.pravatar.cc/150?u=2"
									className="w-full h-full object-cover"
								/>
							</div>
						</div>
					</div>

					<div className="p-4 border-t border-border flex items-center gap-3">
						<button className="text-muted-foreground">
							<Icon icon="lucide:camera" className="w-6 h-6" />
						</button>
						<div className="flex-1 relative">
							<Input
								placeholder="Type a message"
								className="pr-10 rounded-full border-border bg-transparent"
							/>
							<button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
								<Icon icon="lucide:smile" className="w-5 h-5" />
							</button>
						</div>
						<button className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white shadow-md hover:bg-accent/90">
							<Icon icon="lucide:send" className="w-5 h-5 ml-0.5" />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
