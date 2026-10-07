/* eslint-disable @next/next/no-img-element, @typescript-eslint/prefer-nullish-coalescing, jsx-a11y/alt-text, jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions, no-nested-ternary */
import React, { useState, useMemo, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	useAllChats,
	useChatHistory,
	useSendMessage,
	useSupportSocket,
} from "@/hooks/supportManagement";
import { format, formatDistanceToNow } from "date-fns";
import {
	type ISupportChat,
	type ISupportMessage,
	type ISupportUser,
} from "@/types/supportManagement";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuCheckboxItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import ChatMessageContent from "../ChatMessageContent";

export default function TicketTab() {
	const [activeCategory, setActiveCategory] = useState<"customer" | "vendor" | "rider" | "all">(
		"customer",
	);
	const [statusFilter, setStatusFilter] = useState<"all" | "active" | "closed">("all");
	const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
	const [messageText, setMessageText] = useState("");
	const scrollRef = useRef<HTMLDivElement>(null);

	// 1. Fetch all chats
	const { data: chatsData, isLoading: chatsLoading } = useAllChats();
	const chats = useMemo(() => chatsData?.data || [], [chatsData]);

	// 2. Filter chats for the category
	const filteredChats = useMemo(() => {
		const result = chats.filter((chat) => {
			const matchesCategory = activeCategory === "all" || chat.role === activeCategory;
			const matchesStatus = statusFilter === "all" || chat.status === statusFilter;
			const matchesSearch =
				chat.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				chat._id.toLowerCase().includes(searchQuery.toLowerCase());
			return matchesCategory && matchesStatus && matchesSearch;
		});

		// Apply A-Z sort by user name
		if (sortOrder === "asc") {
			result.sort((a, b) => a.user.name.localeCompare(b.user.name));
		} else if (sortOrder === "desc") {
			result.sort((a, b) => b.user.name.localeCompare(a.user.name));
		} else {
			// default to latest first if no sort selected
			result.sort(
				(a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
			);
		}
		return result;
	}, [chats, activeCategory, searchQuery, statusFilter, sortOrder]);

	// 3. Selected Chat
	const selectedChat = useMemo(
		() => chats.find((c) => c._id === selectedChatId),
		[chats, selectedChatId],
	);

	// 4. Fetch History
	const { data: historyData, isLoading: historyLoading } = useChatHistory(selectedChatId || "");
	const [messages, setMessages] = useState<ISupportMessage[]>([]);

	useEffect(() => {
		if (historyData?.data) {
			setMessages(historyData.data);
		}
	}, [historyData]);

	// 5. Socket for Real-time
	const { socket } = useSupportSocket(selectedChatId || "");

	useEffect(() => {
		if (!socket) return undefined;
		const onMessage = (newMessage: ISupportMessage) => {
			if (String(newMessage.chat) !== selectedChatId) return;
			// The socket and a refetch can both deliver the same message
			setMessages((prev) =>
				prev.some((m) => m._id === newMessage._id) ? prev : [...prev, newMessage],
			);
		};
		socket.on("new_support_message", onMessage);
		return () => {
			socket.off("new_support_message", onMessage);
		};
	}, [socket, selectedChatId]);

	// Auto-scroll
	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
		}
	}, [messages]);

	// 6. Mutations
	const { mutate: sendMessage, isPending: isSending } = useSendMessage();

	const handleSendMessage = () => {
		if (!messageText.trim() || !selectedChatId) return;
		sendMessage(
			{
				chatId: selectedChatId,
				content: messageText,
			},
			{
				onSuccess: () => setMessageText(""),
			},
		);
	};

	const formatUserId = (chat: ISupportChat) => {
		const prefix = chat.role.charAt(0).toUpperCase();
		return `${prefix}GHV${chat.user._id.slice(-4).toUpperCase()}`;
	};

	// Helper for Dynamic Avatars
	const getUserAvatar = (user: ISupportUser) => {
		if (user.role === "vendor")
			return user.vendorProfile?.personalAvatar || user.profilePicture;
		if (user.role === "rider") return user.riderProfile?.personalAvatar || user.profilePicture;
		return user.profilePicture;
	};

	// Ensure fresh interface when switching chats
	useEffect(() => {
		if (selectedChatId) {
			setMessages([]);
		}
	}, [selectedChatId]);

	return (
		<div className="flex h-full flex-col gap-6 xl:gap-7">
			{/* Top Filter Bar */}
			<div className="flex flex-wrap items-start gap-3 xl:items-center xl:gap-4">
				<div className="flex gap-2">
					{(["customer", "vendor", "rider"] as const).map((role) => {
						const count = chats.filter((c) => c.role === role).length;
						return (
							<Button
								key={role}
								onClick={() => setActiveCategory(role)}
								className={`h-10 px-4 sm:px-6 ${
									activeCategory === role
										? "bg-primary text-primary-foreground hover:bg-primary/90"
										: "border-border text-foreground hover:bg-muted border bg-transparent"
								}`}
							>
								{role.charAt(0).toUpperCase() + role.slice(1)} ({count})
							</Button>
						);
					})}
				</div>

				<div className="relative w-full sm:w-64">
					<Icon
						icon="ph:magnifying-glass"
						className="text-muted-foreground absolute left-3 top-1/2 size-5 -translate-y-1/2"
					/>
					<Input
						placeholder="Search by name or ID"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="border-border h-10 rounded-lg bg-transparent pl-10"
					/>
				</div>

				{/* Filter Dropdown */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="outline"
							size="icon"
							className="border-border relative size-10 shrink-0 rounded-lg"
						>
							<Icon icon="ph:sliders-horizontal" className="size-5" />
							{statusFilter !== "all" && (
								<span className="absolute right-0 top-0 size-2 rounded-full bg-[#F97316]" />
							)}
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start" className="w-48 z-50 bg-white">
						<DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuCheckboxItem
							checked={statusFilter === "all"}
							onCheckedChange={() => setStatusFilter("all")}
						>
							All Statuses
						</DropdownMenuCheckboxItem>
						<DropdownMenuCheckboxItem
							checked={statusFilter === "active"}
							onCheckedChange={() => setStatusFilter("active")}
						>
							Open Tickets
						</DropdownMenuCheckboxItem>
						<DropdownMenuCheckboxItem
							checked={statusFilter === "closed"}
							onCheckedChange={() => setStatusFilter("closed")}
						>
							Closed Tickets
						</DropdownMenuCheckboxItem>
					</DropdownMenuContent>
				</DropdownMenu>

				{/* Quick Reset All */}
				<Button
					onClick={() => {
						setActiveCategory("all");
						setStatusFilter("all");
						setSearchQuery("");
						setSortOrder(null);
					}}
					className={cn(
						"h-10 rounded-lg px-6 font-medium transition-colors",
						activeCategory === "all" && statusFilter === "all"
							? "bg-[#F97316] text-white hover:bg-[#F97316]/90"
							: "bg-muted text-foreground hover:bg-muted/80",
					)}
				>
					All
				</Button>

				{/* A-Z Sort Toggle */}
				<Button
					variant={sortOrder !== null ? "default" : "outline"}
					onClick={() =>
						setSortOrder((prev) =>
							prev === "asc" ? "desc" : prev === "desc" ? null : "asc",
						)
					}
					className={cn(
						"h-10 rounded-lg bg-transparent px-4 font-medium",
						sortOrder !== null
							? "bg-[#123614] text-white hover:bg-[#123614]/90"
							: "border-border",
					)}
				>
					A-Z {sortOrder === "asc" ? "↓" : sortOrder === "desc" ? "↑" : ""}
				</Button>
			</div>

			<div className="flex items-center gap-2">
				<h2 className="text-2xl font-medium">
					{activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Support
					Tickets ({filteredChats.length})
				</h2>
			</div>

			<div className="grid h-full min-h-[600px] grid-cols-1 gap-4 2xl:grid-cols-12 2xl:gap-6">
				{/* === LEFT: Ticket Grid === */}
				<div className="custom-scrollbar space-y-4 overflow-y-auto pr-0 2xl:col-span-5 2xl:pr-2">
					{chatsLoading ? (
						<div className="text-muted-foreground py-10 text-center">
							Loading tickets...
						</div>
					) : filteredChats.length === 0 ? (
						<div className="text-muted-foreground py-10 text-center">
							No tickets found
						</div>
					) : (
						filteredChats.map((chat) => (
							<div
								key={chat._id}
								onClick={() => setSelectedChatId(chat._id)}
								className={`bg-card cursor-pointer space-y-3 rounded-xl border p-5 shadow-sm transition ${
									selectedChatId === chat._id
										? "border-primary"
										: "border-border hover:border-primary/50"
								}`}
							>
								<div className="flex items-start justify-between">
									<span className="border-border bg-background rounded-full border px-3 py-1 text-xs">
										{formatUserId(chat)}
									</span>
									<span className="text-muted-foreground text-xs">
										{formatDistanceToNow(new Date(chat.updatedAt), {
											addSuffix: true,
										})}
									</span>
								</div>

								<h3 className="line-clamp-2 text-lg font-medium leading-tight">
									{chat.lastMessage || "New Support Request"}
								</h3>

								<div className="flex items-center justify-between pt-2">
									<div className="flex items-center gap-2">
										<div className="size-6 overflow-hidden rounded-full bg-gray-200">
											{getUserAvatar(chat.user) ? (
												<img
													src={getUserAvatar(chat.user)}
													className="size-full object-cover"
												/>
											) : (
												<div className="bg-muted flex size-full items-center justify-center text-[10px] font-bold">
													{chat.user.name.charAt(0)}
												</div>
											)}
										</div>
										<span className="text-xs font-medium">
											{chat.user.name}
										</span>
										<span
											className={`size-2 rounded-full ${chat.status === "active" ? "bg-secondary" : "bg-muted"}`}
										/>
									</div>
									<div className="flex items-center gap-2">
										<span
											className={`rounded-full px-3 py-1 text-xs font-medium ${
												chat.status === "active"
													? "bg-secondary/10 text-secondary"
													: "text-destructive bg-red-100"
											}`}
										>
											{chat.status.charAt(0).toUpperCase() +
												chat.status.slice(1)}
										</span>
										<Icon
											icon="lucide:more-horizontal"
											className="text-muted-foreground"
										/>
									</div>
								</div>
							</div>
						))
					)}
				</div>

				{/* === RIGHT: Chat Details === */}
				<div className="bg-card border-border flex h-full min-h-[420px] flex-col overflow-hidden rounded-2xl border 2xl:col-span-7 2xl:min-h-0">
					{selectedChatId ? (
						<>
							<div className="border-border flex items-center justify-between border-b p-4">
								<div className="flex items-center gap-2">
									<div className="border-primary size-4 rounded-full border-[3px]" />
									<div>
										<h3 className="text-lg font-semibold">
											Support Conversation
										</h3>
										<div className="text-muted-foreground flex items-center gap-2 text-xs">
											<span>{selectedChat?.user.name}</span>
											<span
												className={`size-1.5 rounded-full ${selectedChat?.status === "active" ? "bg-secondary" : "bg-muted"}`}
											/>
											{selectedChat?.admin && (
												<span className="text-secondary bg-secondary/10 ml-2 flex items-center gap-1.5 rounded px-2 py-0.5 font-medium">
													<Icon
														icon="lucide:user-check"
														className="size-3"
													/>
													Connected with{" "}
													{typeof selectedChat.admin === "object"
														? selectedChat.admin.name
														: selectedChat.adminName || "Support Staff"}
												</span>
											)}
										</div>
									</div>
								</div>
								<div className="flex items-center gap-2">
									<Button
										variant="outline"
										size="sm"
										className={`text-xs ${selectedChat?.status === "closed" ? "cursor-not-allowed opacity-50" : "text-destructive border-destructive/20 hover:bg-destructive/5"}`}
										disabled={selectedChat?.status === "closed"}
									>
										{selectedChat?.status === "closed"
											? "Session Ended"
											: "Active Session"}
									</Button>
								</div>
							</div>

							<div
								ref={scrollRef}
								className="custom-scrollbar flex-1 space-y-6 overflow-y-auto p-4"
							>
								{historyLoading ? (
									<div className="text-muted-foreground flex h-full items-center justify-center">
										Loading history...
									</div>
								) : (
									messages.map((msg) => (
										<div
											key={msg._id}
											className={`flex gap-3 ${msg.isSupportResponse ? "justify-end" : ""}`}
										>
											{!msg.isSupportResponse && (
												<div className="size-8 shrink-0 overflow-hidden rounded-full bg-gray-200">
													{getUserAvatar(selectedChat!.user) ? (
														<img
															src={getUserAvatar(selectedChat!.user)}
															className="size-full object-cover"
														/>
													) : (
														<div className="bg-muted flex size-full items-center justify-center text-xs font-bold">
															{selectedChat?.user.name.charAt(0)}
														</div>
													)}
												</div>
											)}
											<div>
												<ChatMessageContent
													message={msg}
													mine={msg.isSupportResponse}
												/>
												<span
													className={`text-muted-foreground mt-1 block text-[10px] ${msg.isSupportResponse ? "text-right" : ""}`}
												>
													{format(new Date(msg.createdAt), "h:mm a")}
												</span>
											</div>
											{msg.isSupportResponse && (
												<div className="size-8 shrink-0 overflow-hidden rounded-full border border-gray-100 bg-gray-50">
													{msg.isSystem ? (
														<div className="flex size-full items-center justify-center bg-white p-1">
															<img
																src="/assets/adaptive-icon2.png"
																alt="GoHive"
																className="size-full object-contain"
															/>
														</div>
													) : typeof msg.sender === "object" &&
													  msg.sender.profilePicture ? (
														<img
															src={msg.sender.profilePicture}
															className="size-full object-cover"
														/>
													) : (
														<div className="bg-primary/10 text-primary flex size-full items-center justify-center text-[10px] font-bold">
															{typeof msg.sender === "object"
																? msg.sender.name
																		.split(" ")
																		.map((n) => n[0])
																		.join("")
																		.slice(0, 2)
																: "ST"}
														</div>
													)}
												</div>
											)}
										</div>
									))
								)}
							</div>

							<div className="border-border flex items-center gap-3 border-t p-4">
								<div className="relative flex-1">
									<Input
										placeholder={
											selectedChat?.status === "closed"
												? "This chat session has ended"
												: "Type a message"
										}
										value={messageText}
										onChange={(e) => setMessageText(e.target.value)}
										onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
										disabled={selectedChat?.status === "closed"}
										className="border-border rounded-full bg-transparent disabled:opacity-50"
									/>
								</div>
								<button
									onClick={handleSendMessage}
									disabled={
										isSending ||
										!messageText.trim() ||
										selectedChat?.status === "closed"
									}
									className="bg-accent hover:bg-accent/90 flex size-10 items-center justify-center rounded-full text-white shadow-md disabled:opacity-50"
								>
									<Icon icon="lucide:send" className="ml-0.5 size-5" />
								</button>
							</div>
						</>
					) : (
						<div className="text-muted-foreground flex h-full items-center justify-center">
							Select a ticket to view details
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

/* eslint-enable */
