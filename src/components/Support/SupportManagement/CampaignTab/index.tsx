import React from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// This is structurally similar to Broadcast but with specific field changes (Email selector)
export default function CampaignTab() {
	return (
		<div className="grid grid-cols-12 gap-6 items-start h-full">
			{/* === LEFT: SMS/Email Campaigns === */}
			<div className="col-span-8 space-y-6">
				<div className="bg-card border border-border rounded-xl p-6 shadow-sm">
					<div className="flex items-center gap-2 mb-6">
						<div className="w-4 h-4 rounded-full border-[3px] border-primary" />
						<h3 className="font-semibold text-xl">SMS/Email Campaigns</h3>
					</div>

					{/* Form */}
					<div className="space-y-6">
						<div className="space-y-2">
							<label className="text-lg font-medium">Subject</label>
							<Input placeholder="Subject" className="bg-transparent h-12" />
						</div>

						<div className="space-y-2">
							<label className="text-lg font-medium">Message</label>
							<Textarea
								placeholder="Type Message"
								className="bg-transparent min-h-[160px] resize-none p-4"
							/>
						</div>

						<div className="space-y-2">
							<label className="text-lg font-medium">Target Audience/User</label>
							<div className="relative">
								<select className="w-full h-12 bg-transparent border border-border rounded-md px-3 appearance-none">
									<option>All Riders</option>
								</select>
								<Icon
									icon="lucide:chevron-down"
									className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
								/>
							</div>
						</div>

						{/* Additional Field for Campaigns: Type (Email) */}
						<div className="space-y-2">
							<div className="relative">
								<select className="w-full h-12 bg-transparent border border-border rounded-md px-3 appearance-none text-muted-foreground">
									<option>Email</option>
									<option>SMS</option>
								</select>
								<Icon
									icon="lucide:chevron-down"
									className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
								/>
							</div>
						</div>

						<div className="flex items-center gap-4 pt-4">
							<div className="flex gap-2">
								<Button
									size="icon"
									className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
								>
									<Icon icon="lucide:image" />
								</Button>
								<Button
									size="icon"
									className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
								>
									<Icon icon="lucide:link" />
								</Button>
							</div>

							<div className="flex items-center gap-4 flex-1 justify-center">
								<Button className="h-12 px-8 bg-secondary hover:bg-secondary/90 text-white w-48 text-base">
									Send Now
								</Button>
								<Button
									variant="secondary"
									className="h-12 px-8 bg-muted text-foreground hover:bg-muted/80 w-48 text-base"
								>
									Schedule Campaign
								</Button>
							</div>
						</div>
					</div>
				</div>

				{/* Analytics */}
				<div className="bg-transparent p-4">
					<div className="flex items-center gap-2 mb-4">
						<div className="w-4 h-4 rounded-full border-[3px] border-primary" />
						<h3 className="font-semibold text-xl">Analytics</h3>
					</div>
					<div className="space-y-2 max-w-md">
						<div className="flex justify-between text-base">
							<span className="font-medium">Delivery success rate</span>
							<span className="text-muted-foreground text-sm">
								% of users reached
							</span>
						</div>
						<div className="flex justify-between text-base">
							<span className="font-medium">Open rate</span>
							<span className="text-muted-foreground text-sm">
								% of users reached
							</span>
						</div>
						<div className="flex justify-between text-base">
							<span className="font-medium">Click-through rate</span>
							<span className="text-muted-foreground text-sm">
								% of users reached
							</span>
						</div>
					</div>
				</div>
			</div>

			{/* === RIGHT: Quick Notification (Same as Broadcast) === */}
			<div className="col-span-4">
				<div className="bg-card border border-border rounded-xl p-6 shadow-sm h-fit">
					<div className="flex items-center justify-between mb-6">
						<div className="flex items-center gap-2">
							<div className="w-4 h-4 rounded-full border-[3px] border-primary" />
							<h3 className="font-semibold text-xl">Quick Notification</h3>
						</div>
						<Icon icon="lucide:more-vertical" className="cursor-pointer" />
					</div>

					<div className="space-y-6">
						<div className="space-y-2">
							<label className="text-base font-medium">Template</label>
							<div className="relative">
								<select className="w-full h-12 bg-transparent border border-border rounded-md px-3 appearance-none text-sm">
									<option>System Outage</option>
								</select>
								<Icon
									icon="lucide:chevron-down"
									className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
								/>
							</div>
						</div>

						<div className="space-y-2">
							<label className="text-base font-medium">Target Audience</label>
							<div className="relative">
								<select className="w-full h-12 bg-transparent border border-border rounded-md px-3 appearance-none text-sm">
									<option>All Riders</option>
								</select>
								<Icon
									icon="lucide:chevron-down"
									className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
								/>
							</div>
						</div>

						<Button className="w-full h-12 bg-secondary hover:bg-secondary/90 text-white text-base font-medium">
							Send Notification
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
