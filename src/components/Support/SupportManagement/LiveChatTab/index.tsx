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
	useCloseChat
} from "@/hooks/supportManagement";
import { format } from "date-fns";
import { ISupportChat, ISupportMessage, ISupportUser } from "@/types/supportManagement";
import { toast } from "sonner";

export default function LiveChatTab() {
	const [activeCategory, setActiveCategory] = useState<"customer" | "vendor" | "rider" | "all">("customer");
	const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [messageText, setMessageText] = useState("");
	const scrollRef = useRef<HTMLDivElement>(null);

	// 1. Fetch all chats
	const { data: chatsData, isLoading: chatsLoading } = useAllChats();
	const chats = useMemo(() => chatsData?.data || [], [chatsData]);

	// 2. Filter chats for the list (Only active and matching category/search)
	const filteredChats = useMemo(() => {
		return chats.filter(chat => {
			const matchesCategory = activeCategory === "all" || chat.role === activeCategory;
			const matchesSearch = chat.user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
								 chat._id.toLowerCase().includes(searchQuery.toLowerCase());
			return matchesCategory && matchesSearch && chat.status === "active";
		});
	}, [chats, activeCategory, searchQuery]);

	// 3. Selective Chat Data
	const selectedChat = useMemo(() =>
		chats.find(c => c._id === selectedChatId),
		[chats, selectedChatId]
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
					setMessages(prev => [...prev, newMessage]);
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

		sendMessage({
			chatId: selectedChatId,
			content: messageText,
		}, {
			onSuccess: () => setMessageText("")
		});
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
		if (user.role === "vendor") return user.vendorProfile?.personalAvatar || user.profilePicture;
		if (user.role === "rider") return user.riderProfile?.personalAvatar || user.profilePicture;
		return user.profilePicture;
	};

	return (
		<div className="grid grid-cols-12 gap-6 h-full min-h-[600px]">
			{/* === LEFT COLUMN: Conversation List === */}
			<div className="col-span-3 bg-card border border-border rounded-xl p-4 flex flex-col gap-4 h-full overflow-hidden">
				{/* Filters */}
				<div className="flex gap-2 shrink-0">
					{(["customer", "vendor", "rider"] as const).map((role) => {
						const count = chats.filter(c => c.role === role && c.status === "active").length;
						return (
							<Button
								key={role}
								onClick={() => setActiveCategory(role)}
								className={`flex-1 h-9 text-xs px-0 ${activeCategory === role
										? "bg-primary text-primary-foreground hover:bg-primary/90"
										: "bg-transparent border border-border text-foreground hover:bg-muted"
									}`}
							>
								{role.charAt(0).toUpperCase() + role.slice(1)} ({count})
							</Button>
						);
					})}
				</div>

				{/* Search & Filter Icon */}
				<div className="flex gap-2 shrink-0">
					<div className="relative flex-1">
						<Icon
							icon="lucide:search"
							className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4"
						/>
						<Input 
							placeholder="Search" 
							className="pl-9 h-10 bg-transparent" 
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>
					<Button variant="outline" size="icon" className="h-10 w-10 shrink-0">
						<Icon icon="lucide:sliders-horizontal" className="w-4 h-4" />
					</Button>
					<Button 
						onClick={() => {
							setActiveCategory("all");
							setSearchQuery("");
						}}
						className={`h-10 px-4 shrink-0 ${
							activeCategory === "all" ? "bg-accent text-white" : "bg-muted text-foreground"
						} hover:bg-accent/90`}
					>
						All
					</Button>
				</div>

				{/* List Header */}
				<div className="flex items-center gap-2 mt-2 shrink-0">
					<Icon
						icon="lucide:message-circle"
						className="text-primary w-5 h-5 fill-current"
					/>
					<h3 className="font-semibold text-lg">{activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Conversations</h3>
				</div>

				{/* List Items (Scrollable) */}
				<div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
					{chatsLoading ? (
						<div className="text-center py-10 text-muted-foreground text-sm">Loading chats...</div>
					) : filteredChats.length === 0 ? (
						<div className="text-center py-10 text-muted-foreground text-sm">No active conversations</div>
					) : (
						filteredChats.map((chat) => (
							<div
								key={chat._id}
								onClick={() => setSelectedChatId(chat._id)}
								className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${selectedChatId === chat._id
										? "bg-muted/50 border-l-4 border-primary"
										: "hover:bg-muted/30 border-l-4 border-transparent"
									}`}
							>
								<div className="relative shrink-0">
									<div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
										{getUserAvatar(chat.user) ? (
											<img src={getUserAvatar(chat.user)} alt="" className="w-full h-full object-cover" />
										) : (
											<div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold">
												{chat.user.name.charAt(0)}
											</div>
										)}
									</div>
									<span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-secondary rounded-full border-2 border-card"></span>
								</div>
								<div className="flex-1 min-w-0">
									<div className="flex justify-between items-center mb-0.5">
										<span className="font-medium text-sm truncate">{chat.user.name}</span>
										<span className="text-[10px] text-muted-foreground">
											{format(new Date(chat.updatedAt), "h:mm a")}
										</span>
									</div>
									<div className="flex justify-between items-center">
										<span className="text-xs text-muted-foreground truncate">
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
			<div className="col-span-6 bg-card border border-border rounded-xl flex flex-col h-full overflow-hidden">
				{selectedChatId ? (
					<>
						{/* Header */}
						<div className="p-4 border-b border-border flex items-center justify-between shrink-0">
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 rounded-full border-[3px] border-primary" />
								<div>
									<h3 className="font-semibold text-lg">Live Support Chat</h3>
							<div className="flex items-center gap-2 text-xs text-muted-foreground">
										<span>{selectedChat?.user.name}</span>
										<span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
										{selectedChat?.admin && (
											<span className="text-secondary font-medium px-2 py-0.5 bg-secondary/10 rounded">
												Connected with Gohive admin
											</span>
										)}
									</div>
								</div>
							</div>
							<div className="flex items-center gap-2">
								{!selectedChat?.admin ? (
									<Button
										size="sm"
										className="text-xs bg-primary text-primary-foreground hover:bg-primary/90"
										onClick={handleJoin}
										disabled={isJoining}
									>
										{isJoining ? "Joining..." : "Join Chat"}
									</Button>
								) : (
									<Button
										size="sm"
										variant="secondary"
										className="text-xs opacity-70 cursor-not-allowed"
										disabled
									>
										Joined
									</Button>
								)}
								<Button
									variant="outline"
									size="sm"
									className={`text-xs ${selectedChat?.status === 'closed' ? 'opacity-50 cursor-not-allowed' : 'text-destructive border-destructive/20 hover:bg-destructive/5'}`}
									onClick={handleClose}
									disabled={selectedChat?.status === 'closed'}
								>
									{selectedChat?.status === 'closed' ? 'Session Ended' : 'End Session'}
								</Button>
								<Button variant="ghost" size="icon">
									<Icon icon="lucide:more-vertical" />
								</Button>
							</div>
						</div>

						{/* Messages (Scrollable) */}
						<div
							ref={scrollRef}
							className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar"
						>
							{historyLoading ? (
								<div className="h-full flex items-center justify-center text-muted-foreground">Loading history...</div>
							) : (
								messages.map((msg) => (
									<div
										key={msg._id}
										className={`flex gap-3 ${msg.isSupportResponse ? "justify-end" : ""}`}
									>
										{!msg.isSupportResponse && (
											<div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
												{getUserAvatar(selectedChat!.user) ? (
													<img src={getUserAvatar(selectedChat!.user)} className="w-full h-full object-cover" />
												) : (
													<div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground text-xs font-bold">
														{selectedChat?.user.name.charAt(0)}
													</div>
												)}
											</div>
										)}
										<div>
											<div className={`px-4 py-2 rounded-2xl text-sm max-w-sm ${msg.isSupportResponse
													? "bg-primary text-primary-foreground rounded-br-none shadow-sm"
													: "bg-muted text-foreground rounded-tl-none"
												}`}>
												{msg.content}
											</div>
											<span className={`text-[10px] text-muted-foreground mt-1 block ${msg.isSupportResponse ? "text-right" : ""
												}`}>
												{format(new Date(msg.createdAt), "h:mm a")}
											</span>
										</div>
										{msg.isSupportResponse && (
											<div className="w-8 h-8 rounded-full bg-gray-800 overflow-hidden flex-shrink-0">
												<div className="w-full h-full flex items-center justify-center bg-gray-700 text-white text-[10px] font-bold">
													YOU
												</div>
											</div>
										)}
									</div>
								))
							)}
						</div>

						{/* Input Area */}
						<div className="p-4 border-t border-border flex items-center gap-3 shrink-0">
							<button className="text-muted-foreground hover:text-foreground">
								<Icon icon="lucide:camera" className="w-6 h-6" />
							</button>
							<div className="flex-1 relative">
								<Input
									placeholder={selectedChat?.status === 'closed' ? "This chat session has ended" : "Type a message..."}
									value={messageText}
									onChange={(e) => setMessageText(e.target.value)}
									onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
									disabled={selectedChat?.status === 'closed'}
									className="pr-10 rounded-full border-border bg-transparent disabled:opacity-50"
								/>
								<button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
									<Icon icon="lucide:smile" className="w-5 h-5" />
								</button>
							</div>
							<button
								onClick={handleSendMessage}
								disabled={isSending || !messageText.trim() || selectedChat?.status === 'closed'}
								className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white shadow-md hover:bg-accent/90 transition disabled:opacity-50"
							>
								<Icon icon="lucide:send" className="w-5 h-5 ml-0.5" />
							</button>
						</div>
					</>
				) : (
					<div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-4">
						<Icon icon="lucide:message-square" className="w-16 h-16 opacity-20" />
						<p>Select a conversation to start chatting</p>
					</div>
				)}
			</div>

			{/* === RIGHT COLUMN: Profile === */}
			<div className="col-span-3 bg-card border border-border rounded-xl p-6 h-full overflow-y-auto">
				{selectedChat ? (
					<>
						<div className="flex gap-4 border-b border-border pb-4 mb-6">
							<span className="font-semibold text-primary border-b-2 border-primary pb-4 -mb-4 px-1">
								Profile
							</span>
							<span className="text-muted-foreground cursor-pointer">Order history</span>
						</div>

						<div className="flex flex-col gap-6">
							<div>
								<div className="relative w-16 h-16 mb-3">
									<div className="w-full h-full rounded-full bg-gray-200 overflow-hidden">
										{getUserAvatar(selectedChat.user) ? (
											<img src={getUserAvatar(selectedChat.user)} alt="Profile" className="w-full h-full object-cover" />
										) : (
											<div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
												{selectedChat.user.name.charAt(0)}
											</div>
										)}
									</div>
									<span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-secondary rounded-full border-2 border-card"></span>
								</div>
								<h2 className="text-xl font-bold">{selectedChat.user.name}</h2>
								<div className="flex items-center gap-2 mt-1">
									<span className="text-xs text-muted-foreground">User ID Number:</span>
									<span className="text-xs border border-border rounded-full px-2 py-0.5">
										{formatUserId(selectedChat)}
									</span>
								</div>
							</div>

							<div className="space-y-4">
								<div className="flex items-center gap-3">
									<Icon icon="lucide:mail" className="text-muted-foreground w-4 h-4" />
									<span className="text-sm text-muted-foreground truncate flex-1">
										{selectedChat.user.email}
									</span>
									<Icon
										icon="lucide:copy"
										onClick={() => {
											navigator.clipboard.writeText(selectedChat.user.email);
											toast.success("Email copied");
										}}
										className="text-muted-foreground w-3.5 h-3.5 cursor-pointer hover:text-foreground"
									/>
								</div>
								<div className="flex items-center gap-3">
									<Icon icon="lucide:phone" className="text-muted-foreground w-4 h-4" />
									<span className="text-sm text-muted-foreground flex-1">
										{selectedChat.user.phone || "No phone added"}
									</span>
									{selectedChat.user.phone && (
										<Icon
											icon="lucide:copy"
											onClick={() => {
												navigator.clipboard.writeText(selectedChat.user.phone!);
												toast.success("Phone copied");
											}}
											className="text-muted-foreground w-3.5 h-3.5 cursor-pointer hover:text-foreground"
										/>
									)}
								</div>
								<div className="flex items-center gap-3">
									<Icon
										icon="lucide:calendar"
										className="text-muted-foreground w-4 h-4"
									/>
									<span className="text-sm text-muted-foreground">
										{selectedChat.user.dob ? format(new Date(selectedChat.user.dob), "MMM dd yyyy") : "Date not provided"}
									</span>
								</div>
								<div className="flex items-start gap-3">
									<Icon
										icon="lucide:map-pin"
										className="text-muted-foreground w-4 h-4 mt-1"
									/>
									<span className="text-sm text-muted-foreground leading-relaxed">
										{selectedChat.user.location?.address || "Address not provided"}
									</span>
								</div>
							</div>
						</div>
					</>
				) : (
					<div className="h-full flex items-center justify-center text-muted-foreground text-sm">
						No user details
					</div>
				)}
			</div>
		</div>
	);
}
