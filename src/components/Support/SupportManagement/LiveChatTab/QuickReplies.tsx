// Saved replies agents can drop into the message box, shared by the whole support team.

import React, { useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	useCreateQuickReply,
	useDeleteQuickReply,
	useQuickReplies,
} from "@/hooks/supportManagement";

interface QuickRepliesProps {
	disabled?: boolean;
	onPick: (text: string) => void;
}

export default function QuickReplies({ disabled, onPick }: QuickRepliesProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [filter, setFilter] = useState("");
	const [isAdding, setIsAdding] = useState(false);
	const [title, setTitle] = useState("");
	const [body, setBody] = useState("");
	const { data, isLoading } = useQuickReplies();
	const { mutate: createReply, isPending: isSaving } = useCreateQuickReply();
	const { mutate: deleteReply } = useDeleteQuickReply();

	const replies = useMemo(() => {
		const term = filter.trim().toLowerCase();
		const all = data?.data ?? [];
		if (!term) return all;
		return all.filter(
			(reply) =>
				reply.title.toLowerCase().includes(term) || reply.body.toLowerCase().includes(term),
		);
	}, [data, filter]);

	const pick = (text: string) => {
		onPick(text);
		setIsOpen(false);
		setFilter("");
	};

	const save = () => {
		createReply(
			{ title: title.trim(), body: body.trim() },
			{
				onSuccess: () => {
					setTitle("");
					setBody("");
					setIsAdding(false);
				},
			},
		);
	};

	let list: React.ReactNode;
	if (isLoading) {
		list = <p className="text-muted-foreground px-1 py-4 text-center text-xs">Loading...</p>;
	} else if (replies.length === 0) {
		list = (
			<p className="text-muted-foreground px-1 py-4 text-center text-xs">
				{filter ? "No replies match." : "No saved replies yet. Add the first one."}
			</p>
		);
	} else {
		list = replies.map((reply) => (
			<div
				key={reply._id}
				className="hover:bg-muted group flex items-start gap-2 rounded-md p-2"
			>
				<button
					type="button"
					className="min-w-0 flex-1 text-left"
					onClick={() => pick(reply.body)}
				>
					<span className="block truncate text-sm font-medium">{reply.title}</span>
					<span className="text-muted-foreground line-clamp-2 text-xs">{reply.body}</span>
				</button>
				<button
					type="button"
					aria-label={`Delete quick reply ${reply.title}`}
					title="Delete"
					onClick={() => {
						// eslint-disable-next-line no-alert
						if (window.confirm(`Delete "${reply.title}" for everyone?`)) {
							deleteReply(reply._id);
						}
					}}
					className="text-muted-foreground hover:text-destructive opacity-0 transition group-hover:opacity-100"
				>
					<Icon icon="lucide:trash-2" className="size-3.5" />
				</button>
			</div>
		));
	}

	return (
		<Popover open={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger asChild>
				<button
					type="button"
					title="Quick replies"
					aria-label="Quick replies"
					disabled={disabled}
					className="text-muted-foreground hover:text-foreground disabled:opacity-50"
				>
					<Icon icon="lucide:zap" className="size-6" />
				</button>
			</PopoverTrigger>
			<PopoverContent align="start" side="top" className="w-80 p-3">
				{isAdding ? (
					<div className="space-y-2">
						<p className="text-sm font-semibold">New quick reply</p>
						<Input
							aria-label="Quick reply title"
							placeholder="Title, e.g. Refund timeline"
							maxLength={60}
							value={title}
							onChange={(e) => setTitle(e.target.value)}
						/>
						<Textarea
							aria-label="Quick reply text"
							placeholder="The message to send"
							maxLength={1000}
							rows={4}
							value={body}
							onChange={(e) => setBody(e.target.value)}
						/>
						<div className="flex justify-end gap-2">
							<Button variant="ghost" size="sm" onClick={() => setIsAdding(false)}>
								Cancel
							</Button>
							<Button
								size="sm"
								onClick={save}
								disabled={isSaving || !title.trim() || !body.trim()}
							>
								{isSaving ? "Saving..." : "Save"}
							</Button>
						</div>
					</div>
				) : (
					<div className="space-y-2">
						<div className="flex items-center gap-2">
							<Input
								aria-label="Filter quick replies"
								placeholder="Find a reply"
								className="h-8"
								value={filter}
								onChange={(e) => setFilter(e.target.value)}
							/>
							<Button
								size="sm"
								variant="outline"
								className="h-8 shrink-0"
								onClick={() => setIsAdding(true)}
							>
								<Icon icon="lucide:plus" className="size-4" />
								Add
							</Button>
						</div>
						<div className="custom-scrollbar max-h-64 overflow-y-auto">{list}</div>
					</div>
				)}
			</PopoverContent>
		</Popover>
	);
}
