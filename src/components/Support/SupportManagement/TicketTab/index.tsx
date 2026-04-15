import React, { useState, useMemo, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
	useAllChats, 
	useChatHistory, 
	useSendMessage, 
	useSupportSocket 
} from "@/hooks/supportManagement";
import { format, formatDistanceToNow } from "date-fns";
import { ISupportChat, ISupportMessage, ISupportUser } from "@/types/supportManagement";

export default function TicketTab() {
	const [activeCategory, setActiveCategory] = useState<"customer" | "vendor" | "rider" | "all">("customer");
	const [statusFilter, setStatusFilter] = useState<"all" | "active" | "closed">("all");
	const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
	const [messageText, setMessageText] = useState("");
	const scrollRef = useRef<HTMLDivElement>(null);

	// 1. Fetch all chats
	const { data: chatsData, isLoading: chatsLoading } = useAllChats();
	const chats = useMemo(() => chatsData?.data || [], [chatsData]);

	// 2. Filter chats for the category
	const filteredChats = useMemo(() => {
		let result = chats.filter(chat => {
			const matchesCategory = activeCategory === "all" || chat.role === activeCategory;
			const matchesStatus = statusFilter === "all" || chat.status === statusFilter;
			const matchesSearch = chat.user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
								 chat._id.toLowerCase().includes(searchQuery.toLowerCase());
			return matchesCategory && matchesStatus && matchesSearch;
		});

		// Apply sort by ID or Date (default desc)
		return result.sort((a, b) => {
			if (sortOrder === "asc") return a._id.localeCompare(b._id);
			return b._id.localeCompare(a._id);
		});
	}, [chats, activeCategory, searchQuery, statusFilter, sortOrder]);

	// 3. Selected Chat
	const selectedChat = useMemo(() => 
		chats.find(c => c._id === selectedChatId), 
		[chats, selectedChatId]
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
		if (socket) {
			socket.on("new_support_message", (newMessage: ISupportMessage) => {
				if (newMessage.chat === selectedChatId) {
					setMessages(prev => [...prev, newMessage]);
				}
			});
		}
		return () => {
			if (socket) socket.off("new_support_message");
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
		sendMessage({
			chatId: selectedChatId,
			content: messageText,
		}, {
			onSuccess: () => setMessageText("")
		});
	};

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

	// Ensure fresh interface when switching chats
	useEffect(() => {
		if (selectedChatId) {
			setMessages([]); 
		}
	}, [selectedChatId]);

	return (
		<div className="flex flex-col gap-6 h-full">
			{/* Top Filter Bar */}
			<div className="flex flex-wrap items-center gap-4">
				<div className="flex gap-2">
					{(["customer", "vendor", "rider"] as const).map((role) => {
						const count = chats.filter(c => c.role === role).length;
						return (
							<Button 
								key={role}
								onClick={() => setActiveCategory(role)}
								className={`h-10 px-6 ${
									activeCategory === role 
										? "bg-primary text-primary-foreground hover:bg-primary/90" 
										: "bg-transparent border border-border text-foreground hover:bg-muted"
								}`}
							>
								{role.charAt(0).toUpperCase() + role.slice(1)} ({count})
							</Button>
						);
					})}
				</div>

				<div className="relative w-64">
					<Icon
						icon="lucide:search"
						className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4"
					/>
					<Input 
						placeholder="Search by name or ID" 
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-9 h-10 bg-transparent" 
					/>
				</div>

				<Button variant="outline" size="icon" className="h-10 w-10">
					<Icon icon="lucide:sliders-horizontal" className="w-4 h-4" />
				</Button>

				<Button 
					onClick={() => {
						setActiveCategory("all");
						setStatusFilter("all");
						setSearchQuery("");
					}}
					className={`h-10 px-6 ${
						activeCategory === "all" ? "bg-accent text-white" : "bg-muted text-foreground"
					} hover:bg-accent/90`}
				>
					All
				</Button>

				<Button 
					variant="outline" 
					onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
					className={`h-10 bg-transparent flex items-center gap-2 ${sortOrder !== "desc" ? "border-primary text-primary" : ""}`}
				>
					ID <Icon icon={sortOrder === "asc" ? "lucide:arrow-up" : "lucide:arrow-down"} className="w-3 h-3" />
				</Button>

				<div className="flex items-center gap-2 border border-border rounded-md p-1">
					<Button 
						variant="ghost" 
						size="sm"
						onClick={() => setStatusFilter("active")}
						className={`h-8 text-xs px-3 ${statusFilter === "active" ? "bg-secondary text-secondary-foreground" : ""}`}
					>
						Open
					</Button>
					<Button 
						variant="ghost" 
						size="sm"
						onClick={() => setStatusFilter("closed")}
						className={`h-8 text-xs px-3 ${statusFilter === "closed" ? "bg-destructive/10 text-destructive" : ""}`}
					>
						Closed
					</Button>
				</div>
			</div>

			<div className="flex items-center gap-2">
				<h2 className="text-2xl font-medium">
					{activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Support Tickets ({filteredChats.length})
				</h2>
			</div>

			<div className="grid grid-cols-12 gap-6 h-full min-h-[600px]">
				{/* === LEFT: Ticket Grid === */}
				<div className="col-span-5 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
					{chatsLoading ? (
						<div className="py-10 text-center text-muted-foreground">Loading tickets...</div>
					) : filteredChats.length === 0 ? (
						<div className="py-10 text-center text-muted-foreground">No tickets found</div>
					) : (
						filteredChats.map((chat) => (
							<div 
								key={chat._id}
								onClick={() => setSelectedChatId(chat._id)}
								className={`bg-card border rounded-xl p-5 shadow-sm space-y-3 cursor-pointer transition ${
									selectedChatId === chat._id ? "border-primary" : "border-border hover:border-primary/50"
								}`}
							>
								<div className="flex justify-between items-start">
									<span className="text-xs border border-border rounded-full px-3 py-1 bg-background">
										{formatUserId(chat)}
									</span>
									<span className="text-xs text-muted-foreground">
										{formatDistanceToNow(new Date(chat.updatedAt), { addSuffix: true })}
									</span>
								</div>
								
								<h3 className="text-lg font-medium leading-tight line-clamp-2">
									{chat.lastMessage || "New Support Request"}
								</h3>

								<div className="flex items-center justify-between pt-2">
									<div className="flex items-center gap-2">
										<div className="w-6 h-6 rounded-full overflow-hidden bg-gray-200">
											{getUserAvatar(chat.user) ? (
												<img src={getUserAvatar(chat.user)} className="w-full h-full object-cover" />
											) : (
												<div className="w-full h-full flex items-center justify-center bg-muted text-[10px] font-bold">
													{chat.user.name.charAt(0)}
												</div>
											)}
										</div>
										<span className="text-xs font-medium">{chat.user.name}</span>
										<span className={`w-2 h-2 rounded-full ${chat.status === "active" ? "bg-secondary" : "bg-muted"}`}></span>
									</div>
									<div className="flex items-center gap-2">
										<span className={`text-xs px-3 py-1 rounded-full font-medium ${
											chat.status === "active" 
												? "bg-secondary/10 text-secondary" 
												: "bg-red-100 text-destructive"
										}`}>
											{chat.status.charAt(0).toUpperCase() + chat.status.slice(1)}
										</span>
										<Icon icon="lucide:more-horizontal" className="text-muted-foreground" />
									</div>
								</div>
							</div>
						))
					)}
				</div>

				{/* === RIGHT: Chat Details === */}
				<div className="col-span-7 bg-card border border-border rounded-xl flex flex-col h-full overflow-hidden">
					{selectedChatId ? (
						<>
							<div className="p-4 border-b border-border flex items-center justify-between">
								<div className="flex items-center gap-2">
									<div className="w-4 h-4 rounded-full border-[3px] border-primary" />
									<div>
										<h3 className="font-semibold text-lg">Support Conversation</h3>
										<div className="flex items-center gap-2 text-xs text-muted-foreground">
											<span>{selectedChat?.user.name}</span>
											<span className={`w-1.5 h-1.5 rounded-full ${selectedChat?.status === 'active' ? 'bg-secondary' : 'bg-muted'}`}></span>
											{selectedChat?.admin && (
												<span className="text-secondary font-medium px-2 py-0.5 bg-secondary/10 rounded ml-2">
													Connected with Gohive admin
												</span>
											)}
										</div>
									</div>
								</div>
								<div className="flex items-center gap-2">
									<Button
										variant="outline"
										size="sm"
										className={`text-xs ${selectedChat?.status === 'closed' ? 'opacity-50 cursor-not-allowed' : 'text-destructive border-destructive/20 hover:bg-destructive/5'}`}
										disabled={selectedChat?.status === 'closed'}
									>
										{selectedChat?.status === 'closed' ? 'Session Ended' : 'Active Session'}
									</Button>
									<Button variant="ghost" size="icon">
										<Icon icon="lucide:more-vertical" />
									</Button>
								</div>
							</div>

							<div 
								ref={scrollRef}
								className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar"
							>
								{historyLoading ? (
									<div className="h-full flex items-center justify-center text-muted-foreground">Loading history...</div>
								) : (
									messages.map((msg) => (
										<div key={msg._id} className={`flex gap-3 ${msg.isSupportResponse ? "justify-end" : ""}`}>
											{!msg.isSupportResponse && (
												<div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
													{getUserAvatar(selectedChat!.user) ? (
														<img src={getUserAvatar(selectedChat!.user)} className="w-full h-full object-cover" />
													) : (
														<div className="w-full h-full flex items-center justify-center bg-muted text-xs font-bold">
															{selectedChat?.user.name.charAt(0)}
														</div>
													)}
												</div>
											)}
											<div>
												<div className={`px-4 py-2 rounded-2xl text-sm max-w-sm ${
													msg.isSupportResponse 
														? "bg-primary text-primary-foreground rounded-br-none" 
														: "bg-muted text-foreground rounded-tl-none"
												}`}>
													{msg.content}
												</div>
												<span className={`text-[10px] text-muted-foreground mt-1 block ${msg.isSupportResponse ? "text-right" : ""}`}>
													{format(new Date(msg.createdAt), "h:mm a")}
												</span>
											</div>
											{msg.isSupportResponse && (
												<div className="w-8 h-8 rounded-full bg-gray-800 overflow-hidden flex-shrink-0">
													<div className="w-full h-full flex items-center justify-center bg-gray-700 text-white text-[10px] font-bold">YOU</div>
												</div>
											)}
										</div>
									))
								)}
							</div>

							<div className="p-4 border-t border-border flex items-center gap-3">
								<button className="text-muted-foreground">
									<Icon icon="lucide:camera" className="w-6 h-6" />
								</button>
								<div className="flex-1 relative">
									<Input
										placeholder={selectedChat?.status === 'closed' ? "This chat session has ended" : "Type a message"}
										value={messageText}
										onChange={(e) => setMessageText(e.target.value)}
										onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
										disabled={selectedChat?.status === "closed"}
										className="pr-10 rounded-full border-border bg-transparent disabled:opacity-50"
									/>
									<button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
										<Icon icon="lucide:smile" className="w-5 h-5" />
									</button>
								</div>
								<button 
									onClick={handleSendMessage}
									disabled={isSending || !messageText.trim() || selectedChat?.status === "closed"}
									className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white shadow-md hover:bg-accent/90 disabled:opacity-50"
								>
									<Icon icon="lucide:send" className="w-5 h-5 ml-0.5" />
								</button>
							</div>
						</>
					) : (
						<div className="h-full flex items-center justify-center text-muted-foreground">
							Select a ticket to view details
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
