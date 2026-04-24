// src/components/Settings/ActivitiesTab/index.tsx
"use client";

import React, { useState, useMemo } from "react";
import { Icon } from "@iconify/react";
import { format, subDays, subWeeks, subMonths, isAfter } from "date-fns";
import { useNotifications, useDeleteNotification } from "@/hooks/useNotifications";
import { Button } from "@/components/ui/button";
import ConfirmDeleteModal from "@/components/_modals/ConfirmDelete";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { isSameDay } from "date-fns";

const ITEMS_PER_PAGE = 8;

export default function ActivitiesTab() {
	const { data: notificationsData, isLoading } = useNotifications();
	const { mutate: deleteNotif, isPending: isDeleting, variables: deletingId } = useDeleteNotification();

	const [searchQuery, setSearchQuery] = useState("");
	const [dateFilter, setDateFilter] = useState("all");
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
	const [currentPage, setCurrentPage] = useState(1);

	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [idToDelete, setIdToDelete] = useState<string | null>(null);

	const handleDeleteClick = (id: string) => {
		setIdToDelete(id);
		setIsDeleteOpen(true);
	};

	const handleConfirmDelete = () => {
		if (idToDelete) {
			deleteNotif(idToDelete, {
				onSuccess: () => {
					setIsDeleteOpen(false);
					setIdToDelete(null);
				},
			});
		}
	};

	const notifications = notificationsData?.data || [];

	const filteredNotifications = useMemo(() => {
		let filtered = [...notifications];

		// Search Filter
		if (searchQuery) {
			filtered = filtered.filter(
				(n) =>
					n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
					n.message.toLowerCase().includes(searchQuery.toLowerCase())
			);
		}

		// Date Presets Filter
		if (dateFilter !== "all") {
			const now = new Date();
			let cutoff = now;
			if (dateFilter === "today") cutoff = subDays(now, 1);
			if (dateFilter === "week") cutoff = subWeeks(now, 1);
			if (dateFilter === "month") cutoff = subMonths(now, 1);

			filtered = filtered.filter((n) => isAfter(new Date(n.createdAt), cutoff));
		}

		// Specific Date Filter
		if (selectedDate) {
			filtered = filtered.filter((n) => isSameDay(new Date(n.createdAt), selectedDate));
		}

		return filtered;
	}, [notifications, searchQuery, dateFilter, selectedDate]);

	// Pagination Logic
	const totalPages = Math.ceil(filteredNotifications.length / ITEMS_PER_PAGE);
	const paginatedNotifications = filteredNotifications.slice(
		(currentPage - 1) * ITEMS_PER_PAGE,
		currentPage * ITEMS_PER_PAGE
	);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	if (isLoading) {
		return (
			<div className="space-y-4">
				<div className="flex gap-4">
					<Skeleton className="h-10 w-64" />
					<Skeleton className="h-10 w-32" />
				</div>
				{[1, 2, 3, 4, 5].map((i) => (
					<Skeleton key={i} className="h-20 w-full rounded-xl" />
				))}
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-6">
			{/* Filters Header */}
			<div className="flex flex-wrap items-center justify-between gap-4">
				<div className="flex items-center gap-3">
					<div className="relative w-64">
						<Icon
							icon="lucide:search"
							className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2"
						/>
						<Input
							placeholder="Search logs..."
							className="h-10 pl-9"
							value={searchQuery}
							onChange={(e) => {
								setSearchQuery(e.target.value);
								setCurrentPage(1);
							}}
						/>
					</div>

					<Select value={dateFilter} onValueChange={(val) => { setDateFilter(val); setCurrentPage(1); setSelectedDate(undefined); }}>
						<SelectTrigger className="h-10 w-40">
							<SelectValue placeholder="Filter by range" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Time</SelectItem>
							<SelectItem value="today">Last 24 Hours</SelectItem>
							<SelectItem value="week">Last 7 Days</SelectItem>
							<SelectItem value="month">Last 30 Days</SelectItem>
						</SelectContent>
					</Select>

					<Popover>
						<PopoverTrigger asChild>
							<Button
								variant="outline"
								size="icon"
								className={cn(
									"border-border bg-card text-foreground size-10 flex-shrink-0 transition-all",
									selectedDate && "border-primary bg-primary/5 text-primary shadow-sm"
								)}
							>
								<CalendarIcon className="size-4" />
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-auto p-0" align="start">
							<Calendar
								mode="single"
								selected={selectedDate}
								onSelect={(date) => {
									setSelectedDate(date);
									setDateFilter("all");
									setCurrentPage(1);
								}}
								initialFocus
								className="rounded-md border-none"
							/>
							{selectedDate && (
								<div className="border-t p-2">
									<Button 
										variant="ghost" 
										className="w-full h-8 text-xs font-medium hover:text-destructive transition-colors" 
										onClick={() => setSelectedDate(undefined)}
									>
										Clear Date
									</Button>
								</div>
							)}
						</PopoverContent>
					</Popover>
				</div>

				<div className="text-sm text-muted-foreground">
					Showing {paginatedNotifications.length} of {filteredNotifications.length} activities
				</div>
			</div>

			{/* Activities List */}
			<div className="flex flex-col gap-3">
				{paginatedNotifications.length > 0 ? (
					paginatedNotifications.map((n) => (
						<div
							key={n._id}
							className="group border-border flex items-center justify-between rounded-2xl border bg-white p-4 transition-all hover:shadow-md"
						>
							<div className="flex items-center gap-4">
								<div className={cn(
									"flex h-10 w-10 items-center justify-center rounded-full bg-gray-50",
									!n.isRead && "bg-primary/10 text-primary"
								)}>
									<Icon 
										icon={n.type === 'order' ? "mdi:shopping-outline" : "mdi:bell-outline"} 
										className="h-5 w-5" 
									/>
								</div>
								<div className="flex flex-col">
									<span className="text-sm font-bold text-[#17110A]">{n.title}</span>
									<span className="text-xs text-muted-foreground line-clamp-1">{n.message}</span>
									<span className="mt-1 text-[10px] text-gray-400">
										{format(new Date(n.createdAt), "MMM d, yyyy • h:mm a")}
									</span>
								</div>
							</div>

							<div className="flex items-center gap-2">
								<Button
									variant="ghost"
									size="icon"
									className={cn(
										"text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all",
										isDeleting && deletingId === n._id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
									)}
									onClick={() => handleDeleteClick(n._id)}
									disabled={isDeleting && deletingId === n._id}
								>
									{isDeleting && deletingId === n._id ? (
										<Icon icon="line-md:loading-twotone-loop" className="h-5 w-5" />
									) : (
										<Icon icon="mdi:trash-can-outline" className="h-5 w-5" />
									)}
								</Button>
							</div>
						</div>
					))
				) : (
					<div className="flex h-64 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-100 text-center">
						<Icon icon="mdi:history" className="mb-2 h-12 w-12 text-gray-200" />
						<p className="text-sm font-medium text-gray-400">No activity logs found</p>
					</div>
				)}
			</div>

			{/* Pagination Controls */}
			{totalPages > 1 && (
				<div className="mt-4 flex items-center justify-center gap-2">
					<Button
						variant="outline"
						size="sm"
						className="h-9 w-9 p-0"
						onClick={() => handlePageChange(currentPage - 1)}
						disabled={currentPage === 1}
					>
						<Icon icon="lucide:chevron-left" className="h-4 w-4" />
					</Button>
					
					{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
						<Button
							key={page}
							variant={currentPage === page ? "secondary" : "outline"}
							size="sm"
							className={cn(
								"h-9 w-9 p-0 font-medium",
								currentPage === page && "text-white"
							)}
							onClick={() => handlePageChange(page)}
						>
							{page}
						</Button>
					))}

					<Button
						variant="outline"
						size="sm"
						className="h-9 w-9 p-0"
						onClick={() => handlePageChange(currentPage + 1)}
						disabled={currentPage === totalPages}
					>
						<Icon icon="lucide:chevron-right" className="h-4 w-4" />
					</Button>
				</div>
			)}
			<ConfirmDeleteModal 
				isOpen={isDeleteOpen} 
				onOpenChange={setIsDeleteOpen} 
				onConfirm={handleConfirmDelete} 
				isLoading={isDeleting}
				title="Delete Activity Log?"
				description="Are you sure you want to delete this activity log? This action cannot be undone and will permanently remove the record from your dashboard."
			/>
		</div>
	);
}
