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
import { supportApi } from "@/app/api/supportManagement";
import ChatMessageContent from "../ChatMessageContent";

// Add a message unless it is already shown (socket + refetch can both deliver it)
const addMessage = (list: ISupportMessage[], message: ISupportMessage) =>
	list.some((m) => m._id === message._id) ? list : [...list, message];

const isWaitingForAgent = (chat: ISupportChat) =>
	chat.status === "active" && !!chat.agentRequestedAt && !chat.admin;

export default function LiveChatTab() {
	const [activeCategory, setActiveCategory] = useState<"customer" | "vendor" | "rider" | "all">(
		"customer",
	);
	const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<"active" | "closed">("active");
	const [messageText, setMessageText] = useState("");
	const [isUploading, setIsUploading] = useState(false);
	const [userTyping, setUserTyping] = useState(false);
	const scrollRef = useRef<HTMLDivElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

	// 1. Fetch all chats
	const { data: chatsData, isLoading: chatsLoading } = useAllChats();
	const chats = useMemo(() => chatsData?.data || [], [chatsData]);

	// 2. Filter chats for the list (status, category, search); waiting chats first
	const filteredChats = useMemo(() => {
		const query = searchQuery.trim().toLowerCase();
		return chats
			.filter((chat) => {
				const matchesCategory = activeCategory === "all" || chat.role === activeCategory;
				const matchesSearch =
					chat.user.name.toLowerCase().includes(query) ||
					chat._id.toLowerCase().includes(query);
				return matchesCategory && matchesSearch && chat.status === statusFilter;
			})
			.sort((a, b) => Number(isWaitingForAgent(b)) - Number(isWaitingForAgent(a)));
	}, [chats, activeCategory, searchQuery, statusFilter]);

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
		setMessages([]); // Clear previous messages immediately
		setUserTyping(false);
		setMessageText("");
	}, [selectedChatId]);

	useEffect(() => {
		if (historyData?.data) {
			// Keep live messages that arrived before the history request finished
			setMessages((prev) => prev.reduce(addMessage, historyData.data));
		}
	}, [historyData]);

	// 5. Socket for Real-time
	const { socket, isConnected } = useSupportSocket(selectedChatId || "");

	useEffect(() => {
		if (!socket || !selectedChatId) return undefined;

		const onMessage = (newMessage: ISupportMessage) => {
			if (String(newMessage.chat) !== selectedChatId) return;
			setMessages((prev) => addMessage(prev, newMessage));
			if (!newMessage.isSupportResponse) setUserTyping(false);
		};
		const onClosed = (data: { chatId: string }) => {
			if (String(data.chatId) === selectedChatId) {
				toast.info("This chat has been closed.");
				setUserTyping(false);
			}
		};
		const onTyping = (data: { chatId?: string; isTyping: boolean; role?: string }) => {
			if (data.chatId && String(data.chatId) !== selectedChatId) return;
			// Only show the customer/vendor/rider typing, not other agents
			if (data.role === "superadmin" || data.role === "staff") return;
			setUserTyping(!!data.isTyping);
		};

		socket.on("new_support_message", onMessage);
		socket.on("chat_closed", onClosed);
		socket.on("typing_status", onTyping);
		return () => {
			socket.off("new_support_message", onMessage);
			socket.off("chat_closed", onClosed);
			socket.off("typing_status", onTyping);
		};
	}, [socket, selectedChatId]);

	// Auto-scroll to bottom
	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
		}
	}, [messages, userTyping]);

	// 6. Mutations
	const { mutate: sendMessage, isPending: isSending } = useSendMessage();
	const { mutate: joinChat, isPending: isJoining } = useJoinChat();
	const { mutate: closeChat } = useCloseChat();

	const isClosed = selectedChat?.status === "closed";

	const emitTyping = (isTyping: boolean) => {
		if (socket && selectedChatId) {
			socket.emit("typing_status", { chatId: selectedChatId, isTyping });
		}
	};

	const handleTextChange = (value: string) => {
		setMessageText(value);
		if (typingTimeout.current) clearTimeout(typingTimeout.current);
		else emitTyping(true);
		typingTimeout.current = setTimeout(() => {
			typingTimeout.current = null;
			emitTyping(false);
		}, 2000);
	};

	const stopTyping = () => {
		if (typingTimeout.current) {
			clearTimeout(typingTimeout.current);
			typingTimeout.current = null;
			emitTyping(false);
		}
	};

	const handleSendMessage = () => {
		if (!messageText.trim() || !selectedChatId || isClosed) return;
		stopTyping();

		sendMessage(
			{
				chatId: selectedChatId,
				content: messageText.trim(),
			},
			{
				onSuccess: (res) => {
					setMessageText("");
					if (res?.data) setMessages((prev) => addMessage(prev, res.data));
				},
			},
		);
	};

	const handleImagePicked = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		e.target.value = ""; // allow picking the same file again
		if (!file || !selectedChatId || isClosed) return;
		if (!["image/png", "image/jpeg"].includes(file.type)) {
			toast.error("Only PNG or JPEG images can be sent");
			return;
		}
		if (file.size > 10 * 1024 * 1024) {
			toast.error("Image must be 10 MB or smaller");
			return;
		}

		setIsUploading(true);
		try {
			const formData = new FormData();
			formData.append("image", file);
			const { url } = await supportApi.uploadFile(formData);
			sendMessage(
				{ chatId: selectedChatId, content: url, type: "image" },
				{
					onSuccess: (res) => {
						if (res?.data) setMessages((prev) => addMessage(prev, res.data));
					},
				},
			);
		} catch {
			toast.error("Image upload failed");
		} finally {
			setIsUploading(false);
		}
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
							(c) => c.role === role && c.status === statusFilter,
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

				{/* Status */}
				<div className="bg-muted flex shrink-0 rounded-lg p-1">
					{(["active", "closed"] as const).map((status) => (
						<button
							key={status}
							type="button"
							onClick={() => setStatusFilter(status)}
							className={`flex-1 rounded-md py-1.5 text-xs font-medium transition ${
								statusFilter === status
									? "bg-card text-foreground shadow-sm"
									: "text-muted-foreground hover:text-foreground"
							}`}
						>
							{status === "active" ? "Active" : "Closed"}
						</button>
					))}
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
					<span
						title={isConnected ? "Live updates on" : "Reconnecting..."}
						className={`ml-auto size-2 rounded-full ${isConnected ? "bg-green-500" : "bg-amber-500"}`}
					/>
				</div>

				{/* List Items (Scrollable) */}
				<div className="custom-scrollbar flex-1 space-y-2 overflow-y-auto pr-1">
					{chatsLoading ? (
						<div className="text-muted-foreground py-10 text-center text-sm">
							Loading chats...
						</div>
					) : filteredChats.length === 0 ? (
						<div className="text-muted-foreground py-10 text-center text-sm">
							No {statusFilter} conversations
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
										{isWaitingForAgent(chat) && (
											<span className="ml-2 shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700">
												Waiting
											</span>
										)}
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
										{selectedChat && isWaitingForAgent(selectedChat) && (
											<span className="flex items-center gap-1.5 rounded bg-amber-100 px-2 py-0.5 font-medium text-amber-700">
												<Icon icon="lucide:clock" className="size-3" />
												Waiting for an agent
											</span>
										)}
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
								{isClosed ? null : !selectedChat?.admin ? (
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
									className={`text-xs ${isClosed ? "cursor-not-allowed opacity-50" : "text-destructive border-destructive/20 hover:bg-destructive/5"}`}
									onClick={handleClose}
									disabled={isClosed}
								>
									{isClosed ? "Session Ended" : "End Session"}
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
											<ChatMessageContent
												message={msg}
												mine={msg.isSupportResponse}
											/>
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
							{userTyping && !isClosed && (
								<div className="text-muted-foreground flex items-center gap-2 text-xs italic">
									<Icon
										icon="lucide:more-horizontal"
										className="size-5 animate-pulse"
									/>
									{selectedChat?.user.name} is typing...
								</div>
							)}
						</div>

						{/* Input Area */}
						<div className="border-border flex shrink-0 items-center gap-3 border-t p-4">
							<input
								ref={fileInputRef}
								type="file"
								accept="image/png,image/jpeg"
								className="hidden"
								onChange={handleImagePicked}
							/>
							<button
								type="button"
								title="Send an image"
								onClick={() => fileInputRef.current?.click()}
								disabled={isClosed || isUploading}
								className="text-muted-foreground hover:text-foreground disabled:opacity-50"
							>
								<Icon
									icon={isUploading ? "lucide:loader-2" : "lucide:image-plus"}
									className={`size-6 ${isUploading ? "animate-spin" : ""}`}
								/>
							</button>
							<div className="relative flex-1">
								<Input
									placeholder={
										isClosed
											? "This chat session has ended"
											: "Type a message..."
									}
									value={messageText}
									onChange={(e) => handleTextChange(e.target.value)}
									onBlur={stopTyping}
									onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
									disabled={isClosed}
									className="border-border rounded-full bg-transparent disabled:opacity-50"
								/>
							</div>
							<button
								onClick={handleSendMessage}
								disabled={isSending || !messageText.trim() || isClosed}
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
										{selectedChat.user.email || "No email"}
									</span>
									{selectedChat.user.email && (
										<Icon
											icon="lucide:copy"
											onClick={() => {
												navigator.clipboard.writeText(
													selectedChat.user.email,
												);
												toast.success("Email copied");
											}}
											className="text-muted-foreground hover:text-foreground size-3.5 cursor-pointer"
										/>
									)}
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
