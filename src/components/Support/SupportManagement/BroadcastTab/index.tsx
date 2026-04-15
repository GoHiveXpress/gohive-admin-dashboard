import React from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function BroadcastTab() {
	return (
		<div className="grid h-full grid-cols-12 items-start gap-6">
			{/* === LEFT: Message Composer === */}
			<div className="col-span-8 space-y-6">
				<div className="bg-card border-border rounded-xl border p-6 shadow-sm">
					<div className="mb-6 flex items-center gap-2">
						<div className="border-primary size-4 rounded-full border-[3px]" />
						<h3 className="text-xl font-semibold">Message Composer</h3>
					</div>

					{/* Toolbar */}
					<div className="bg-muted/40 mb-6 flex w-fit items-center gap-4 rounded-full p-2">
						<button className="px-2 font-bold">B</button>
						<button className="px-2 font-serif italic">I</button>
						<button className="px-2 underline">U</button>
						<button className="flex items-center px-2">
							<Icon icon="lucide:list" />
						</button>
						<button className="px-2">
							<Icon icon="lucide:chevron-down" className="size-3" />
						</button>
					</div>

					{/* Form */}
					<div className="space-y-6">
						<div className="space-y-2">
							<label className="text-lg font-medium">Subject</label>
							<Input placeholder="Subject" className="h-12 bg-transparent" />
						</div>

						<div className="space-y-2">
							<label className="text-lg font-medium">Message</label>
							<Textarea
								placeholder="Type Message"
								className="min-h-[160px] resize-none bg-transparent p-4"
							/>
						</div>

						<div className="space-y-2">
							<label className="text-lg font-medium">Target Audience</label>
							<div className="relative">
								<select className="border-border h-12 w-full appearance-none rounded-md border bg-transparent px-3">
									<option>All Riders</option>
								</select>
								<Icon
									icon="lucide:chevron-down"
									className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
								/>
							</div>
						</div>

						<div className="flex items-center gap-4 pt-4">
							<div className="flex gap-2">
								<Button
									size="icon"
									className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full"
								>
									<Icon icon="lucide:image" />
								</Button>
								<Button
									size="icon"
									className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full"
								>
									<Icon icon="lucide:link" />
								</Button>
							</div>

							<div className="relative flex flex-1 items-center justify-center gap-4">
								<Button className="bg-secondary hover:bg-secondary/90 h-12 w-48 px-8 text-base text-white">
									Send Now
								</Button>
								<Button
									variant="secondary"
									className="bg-muted text-foreground hover:bg-muted/80 h-12 w-48 px-8 text-base"
								>
									Schedule Broadcast
								</Button>
							</div>
						</div>
					</div>
				</div>

				{/* Analytics */}
				<div className="bg-transparent p-4">
					<div className="mb-4 flex items-center gap-2">
						<div className="border-primary size-4 rounded-full border-[3px]" />
						<h3 className="text-xl font-semibold">Analytics</h3>
					</div>
					<div className="max-w-md space-y-2">
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

			{/* === RIGHT: Quick Notification === */}
			<div className="col-span-4">
				<div className="bg-card border-border h-fit rounded-xl border p-6 shadow-sm">
					<div className="mb-6 flex items-center justify-between">
						<div className="flex items-center gap-2">
							<div className="border-primary size-4 rounded-full border-[3px]" />
							<h3 className="text-xl font-semibold">Quick Notification</h3>
						</div>
						<Icon icon="lucide:more-vertical" className="cursor-pointer" />
					</div>

					<div className="space-y-6">
						<div className="space-y-2">
							<label className="text-base font-medium">Template</label>
							<div className="relative">
								<select className="border-border h-12 w-full appearance-none rounded-md border bg-transparent px-3 text-sm">
									<option>System Outage</option>
								</select>
								<Icon
									icon="lucide:chevron-down"
									className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
								/>
							</div>
						</div>

						<div className="space-y-2">
							<label className="text-base font-medium">Target Audience</label>
							<div className="relative">
								<select className="border-border h-12 w-full appearance-none rounded-md border bg-transparent px-3 text-sm">
									<option>All Riders</option>
								</select>
								<Icon
									icon="lucide:chevron-down"
									className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
								/>
							</div>
						</div>

						<Button className="bg-secondary hover:bg-secondary/90 h-12 w-full text-base font-medium text-white">
							Send Notification
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
