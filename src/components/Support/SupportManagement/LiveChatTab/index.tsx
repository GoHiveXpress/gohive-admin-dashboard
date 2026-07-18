/* eslint-disable @next/next/no-img-element, @typescript-eslint/no-floating-promises, @typescript-eslint/prefer-nullish-coalescing, jsx-a11y/alt-text, jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions, no-nested-ternary */
import React, { useState, useEffect, useMemo, useRef } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	useAllChats,
	useChatHistory,
	useSendMessage,
	useSupportSocket,
	useJoinChat,
	useCloseChat,
} from "@/hooks/supportManagement";
import { format } from "date-fns";
import {
	type ISupportChat,
	type ISupportMessage,
	type ISupportUser,
} from "@/types/supportManagement";
import { toast } from "sonner";

export default function LiveChatTab() {
	const [activeCategory, setActiveCategory] = useState<"customer" | "vendor" | "rider" | "all">(
		"customer",
	);
	const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [messageText, setMessageText] = useState("");
	const scrollRef = useRef<HTMLDivElement>(null);

	// 1. Fetch all chats
	const { data: chatsData, isLoading: chatsLoading } = useAllChats();
	const chats = useMemo(() => chatsData?.data || [], [chatsData]);

	// 2. Filter chats for the list (Only active and matching category/search)
	const filteredChats = useMemo(() => {
		return chats.filter((chat) => {
			const matchesCategory = activeCategory === "all" || chat.role === activeCategory;
			const matchesSearch =
				chat.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				chat._id.toLowerCase().includes(searchQuery.toLowerCase());
			return matchesCategory && matchesSearch && chat.status === "active";
		});
	}, [chats, activeCategory, searchQuery]);

	// 3. Selective Chat Data
	const selectedChat = useMemo(
		() => chats.find((c) => c._id === selectedChatId),
		[chats, selectedChatId],
	);

	// 4. Fetch History
	const { data: historyData, isLoading: historyLoading } = useChatHistory(selectedChatId || "");
	const [messages, setMessages] = useState<ISupportMessage[]>([]);

	// Ensure fresh interface when switching chats
	useEffect(() => {
		if (selectedChatId) {
			setMessages([]); // Clear previous messages immediately
		}
	}, [selectedChatId]);

	useEffect(() => {
		if (historyData?.data) {
			setMessages(historyData.data);
		}
	}, [historyData]);

	// 5. Socket for Real-time
	const { socket } = useSupportSocket(selectedChatId || "");

	useEffect(() => {
		if (socket) {
			socket.on("new_support_message", (newMessage: ISupportMessage) => {
				if (newMessage.chat === selectedChatId) {
					setMessages((prev) => [...prev, newMessage]);
				}
			});

			socket.on("chat_closed", (data: { chatId: string }) => {
				if (data.chatId === selectedChatId) {
					toast.info("This chat has been closed.");
					setSelectedChatId(null);
				}
			});
		}
		return () => {
			if (socket) {
				socket.off("new_support_message");
				socket.off("chat_closed");
			}
		};
	}, [socket, selectedChatId]);

	// Auto-scroll to bottom
	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
		}
	}, [messages]);

	// 6. Mutations
	const { mutate: sendMessage, isPending: isSending } = useSendMessage();
	const { mutate: joinChat, isPending: isJoining } = useJoinChat();
	const { mutate: closeChat } = useCloseChat();

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

	const handleJoin = () => {
		if (selectedChatId) joinChat(selectedChatId);
	};

	const handleClose = () => {
		if (selectedChatId) closeChat(selectedChatId);
	};

	// Helper for user ID display
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

	return (
		<div className="grid h-full min-h-[600px] grid-cols-1 gap-4 xl:grid-cols-12 xl:gap-6 2xl:gap-7">
			{/* === LEFT COLUMN: Conversation List === */}
			<div className="bg-card border-border flex h-full flex-col gap-4 overflow-hidden rounded-2xl border p-4 xl:col-span-4 xl:p-5 2xl:col-span-3">
				{/* Filters */}
				<div className="flex shrink-0 flex-wrap gap-2">
					{(["customer", "vendor", "rider"] as const).map((role) => {
						const count = chats.filter(
							(c) => c.role === role && c.status === "active",
						).length;
						return (
							<Button
								key={role}
								onClick={() => setActiveCategory(role)}
								className={`h-9 min-w-[100px] flex-1 px-2 text-xs ${
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

				{/* Search & Filter Icon */}
				<div className="flex shrink-0 gap-2">
					<div className="relative flex-1">
						<Icon
							icon="lucide:search"
							className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2"
						/>
						<Input
							placeholder="Search"
							className="h-10 bg-transparent pl-9"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>
					<Button variant="outline" size="icon" className="size-10 shrink-0">
						<Icon icon="lucide:sliders-horizontal" className="size-4" />
					</Button>
					<Button
						onClick={() => {
							setActiveCategory("all");
							setSearchQuery("");
						}}
						className={`h-10 shrink-0 px-4 ${
							activeCategory === "all"
								? "bg-accent text-white"
								: "bg-muted text-foreground"
						} hover:bg-accent/90`}
					>
						All
					</Button>
				</div>

				{/* List Header */}
				<div className="mt-2 flex shrink-0 items-center gap-2">
					<Icon
						icon="lucide:message-circle"
						className="text-primary size-5 fill-current"
					/>
					<h3 className="text-lg font-semibold">
						{activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}{" "}
						Conversations
					</h3>
				</div>

				{/* List Items (Scrollable) */}
				<div className="custom-scrollbar flex-1 space-y-2 overflow-y-auto pr-1">
					{chatsLoading ? (
						<div className="text-muted-foreground py-10 text-center text-sm">
							Loading chats...
						</div>
					) : filteredChats.length === 0 ? (
						<div className="text-muted-foreground py-10 text-center text-sm">
							No active conversations
						</div>
					) : (
						filteredChats.map((chat) => (
							<div
								key={chat._id}
								onClick={() => setSelectedChatId(chat._id)}
								className={`flex cursor-pointer items-center gap-3 rounded-lg p-3 transition ${
									selectedChatId === chat._id
										? "bg-muted/50 border-primary border-l-4"
										: "hover:bg-muted/30 border-l-4 border-transparent"
								}`}
							>
								<div className="relative shrink-0">
									<div className="size-10 overflow-hidden rounded-full bg-gray-200">
										{getUserAvatar(chat.user) ? (
											<img
												src={getUserAvatar(chat.user)}
												alt=""
												className="size-full object-cover"
											/>
										) : (
											<div className="bg-primary/10 text-primary flex size-full items-center justify-center font-bold">
												{chat.user.name.charAt(0)}
											</div>
										)}
									</div>
									<span className="bg-secondary border-card absolute bottom-0 right-0 size-2.5 rounded-full border-2" />
								</div>
								<div className="min-w-0 flex-1">
									<div className="mb-0.5 flex items-center justify-between">
										<span className="truncate text-sm font-medium">
											{chat.user.name}
										</span>
										<span className="text-muted-foreground text-[10px]">
											{format(new Date(chat.updatedAt), "h:mm a")}
										</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-muted-foreground truncate text-xs">
											{chat.lastMessage || "No messages yet"}
										</span>
									</div>
								</div>
							</div>
						))
					)}
				</div>
			</div>

			{/* === MIDDLE COLUMN: Chat Area === */}
			<div className="bg-card border-border flex h-full min-h-[420px] flex-col overflow-hidden rounded-2xl border xl:col-span-8 xl:min-h-0 2xl:col-span-6">
				{selectedChatId ? (
					<>
						{/* Header */}
						<div className="border-border flex shrink-0 items-center justify-between border-b p-4">
							<div className="flex items-center gap-2">
								<div className="border-primary size-4 rounded-full border-[3px]" />
								<div>
									<h3 className="text-lg font-semibold">Live Support Chat</h3>
									<div className="text-muted-foreground flex items-center gap-2 text-xs">
										<span>{selectedChat?.user.name}</span>
										<span className="bg-secondary size-1.5 rounded-full" />
										{selectedChat?.admin && (
											<span className="text-secondary bg-secondary/10 flex items-center gap-1.5 rounded px-2 py-0.5 font-medium">
												<Icon icon="lucide:user-check" className="size-3" />
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
								{!selectedChat?.admin ? (
									<Button
										size="sm"
										className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs"
										onClick={handleJoin}
										disabled={isJoining}
									>
										{isJoining ? "Joining..." : "Join Chat"}
									</Button>
								) : (
									<Button
										size="sm"
										variant="secondary"
										className="cursor-not-allowed text-xs opacity-70"
										disabled
									>
										Joined
									</Button>
								)}
								<Button
									variant="outline"
									size="sm"
									className={`text-xs ${selectedChat?.status === "closed" ? "cursor-not-allowed opacity-50" : "text-destructive border-destructive/20 hover:bg-destructive/5"}`}
									onClick={handleClose}
									disabled={selectedChat?.status === "closed"}
								>
									{selectedChat?.status === "closed"
										? "Session Ended"
										: "End Session"}
								</Button>
								<Button variant="ghost" size="icon">
									<Icon icon="lucide:more-vertical" />
								</Button>
							</div>
						</div>

						{/* Messages (Scrollable) */}
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
													<div className="bg-muted text-muted-foreground flex size-full items-center justify-center text-xs font-bold">
														{selectedChat?.user.name.charAt(0)}
													</div>
												)}
											</div>
										)}
										<div>
											<div
												className={`max-w-sm rounded-2xl px-4 py-2 text-sm ${
													msg.isSupportResponse
														? "bg-primary text-primary-foreground rounded-br-none shadow-sm"
														: "bg-muted text-foreground rounded-tl-none"
												}`}
											>
												{msg.content}
											</div>
											<span
												className={`text-muted-foreground mt-1 block text-[10px] ${
													msg.isSupportResponse ? "text-right" : ""
												}`}
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
												) : typeof msg.sender === "object" && msg.sender.profilePicture ? (
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

						{/* Input Area */}
						<div className="border-border flex shrink-0 items-center gap-3 border-t p-4">
							<button className="text-muted-foreground hover:text-foreground">
								<Icon icon="lucide:camera" className="size-6" />
							</button>
							<div className="relative flex-1">
								<Input
									placeholder={
										selectedChat?.status === "closed"
											? "This chat session has ended"
											: "Type a message..."
									}
									value={messageText}
									onChange={(e) => setMessageText(e.target.value)}
									onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
									disabled={selectedChat?.status === "closed"}
									className="border-border rounded-full bg-transparent pr-10 disabled:opacity-50"
								/>
								<button className="text-muted-foreground hover:text-foreground absolute right-3 top-1/2 -translate-y-1/2">
									<Icon icon="lucide:smile" className="size-5" />
								</button>
							</div>
							<button
								onClick={handleSendMessage}
								disabled={
									isSending ||
									!messageText.trim() ||
									selectedChat?.status === "closed"
								}
								className="bg-accent hover:bg-accent/90 flex size-10 items-center justify-center rounded-full text-white shadow-md transition disabled:opacity-50"
							>
								<Icon icon="lucide:send" className="ml-0.5 size-5" />
							</button>
						</div>
					</>
				) : (
					<div className="text-muted-foreground flex h-full flex-col items-center justify-center gap-4">
						<Icon icon="lucide:message-square" className="size-16 opacity-20" />
						<p>Select a conversation to start chatting</p>
					</div>
				)}
			</div>

			{/* === RIGHT COLUMN: Profile === */}
			<div className="bg-card border-border h-full overflow-y-auto rounded-2xl border p-5 xl:col-span-12 xl:p-6 2xl:col-span-3">
				{selectedChat ? (
					<>
						<div className="border-border mb-6 flex gap-4 border-b pb-4">
							<span className="text-primary border-primary -mb-4 border-b-2 px-1 pb-4 font-semibold">
								Profile
							</span>
							<span className="text-muted-foreground cursor-pointer">
								Order history
							</span>
						</div>

						<div className="flex flex-col gap-6">
							<div>
								<div className="relative mb-3 size-16">
									<div className="size-full overflow-hidden rounded-full bg-gray-200">
										{getUserAvatar(selectedChat.user) ? (
											<img
												src={getUserAvatar(selectedChat.user)}
												alt="Profile"
												className="size-full object-cover"
											/>
										) : (
											<div className="bg-primary/10 text-primary flex size-full items-center justify-center text-xl font-bold">
												{selectedChat.user.name.charAt(0)}
											</div>
										)}
									</div>
									<span className="bg-secondary border-card absolute bottom-1 right-1 size-3.5 rounded-full border-2" />
								</div>
								<h2 className="text-xl font-bold">{selectedChat.user.name}</h2>
								<div className="mt-1 flex items-center gap-2">
									<span className="text-muted-foreground text-xs">
										User ID Number:
									</span>
									<span className="border-border rounded-full border px-2 py-0.5 text-xs">
										{formatUserId(selectedChat)}
									</span>
								</div>
							</div>

							<div className="space-y-4">
								<div className="flex items-center gap-3">
									<Icon
										icon="lucide:mail"
										className="text-muted-foreground size-4"
									/>
									<span className="text-muted-foreground flex-1 truncate text-sm">
										{selectedChat.user.email}
									</span>
									<Icon
										icon="lucide:copy"
										onClick={() => {
											navigator.clipboard.writeText(selectedChat.user.email);
											toast.success("Email copied");
										}}
										className="text-muted-foreground hover:text-foreground size-3.5 cursor-pointer"
									/>
								</div>
								<div className="flex items-center gap-3">
									<Icon
										icon="lucide:phone"
										className="text-muted-foreground size-4"
									/>
									<span className="text-muted-foreground flex-1 text-sm">
										{selectedChat.user.phone || "No phone added"}
									</span>
									{selectedChat.user.phone && (
										<Icon
											icon="lucide:copy"
											onClick={() => {
												navigator.clipboard.writeText(
													selectedChat.user.phone!,
												);
												toast.success("Phone copied");
											}}
											className="text-muted-foreground hover:text-foreground size-3.5 cursor-pointer"
										/>
									)}
								</div>
								<div className="flex items-center gap-3">
									<Icon
										icon="lucide:calendar"
										className="text-muted-foreground size-4"
									/>
									<span className="text-muted-foreground text-sm">
										{selectedChat.user.dob
											? format(new Date(selectedChat.user.dob), "MMM dd yyyy")
											: "Date not provided"}
									</span>
								</div>
								<div className="flex items-start gap-3">
									<Icon
										icon="lucide:map-pin"
										className="text-muted-foreground mt-1 size-4"
									/>
									<span className="text-muted-foreground text-sm leading-relaxed">
										{selectedChat.user.location?.address ||
											"Address not provided"}
									</span>
								</div>
							</div>
						</div>
					</>
				) : (
					<div className="text-muted-foreground flex h-full items-center justify-center text-sm">
						No user details
					</div>
				)}
			</div>
		</div>
	);
}

/* eslint-enable */
