"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ROUTES } from "@/constants/routes";
import { useResolveTicket, useUpdateTicket } from "@/hooks/supportManagement";
import {
	TICKET_CATEGORIES,
	TICKET_CATEGORY_LABELS,
	TICKET_PRIORITIES,
	TICKET_PRIORITY_LABELS,
	TICKET_RESOLUTIONS,
	TICKET_RESOLUTION_LABELS,
	TICKET_STATUSES,
	TICKET_STATUS_LABELS,
	categoryLabel,
	formatDuration,
	priorityOf,
	responseTimer,
	ticketCode,
	ticketStatusOf,
} from "@/lib/supportTickets";
import { cn } from "@/lib/utils";
import {
	type ISupportChat,
	type TicketCategory,
	type TicketPriority,
	type TicketResolution,
	type TicketStatus,
} from "@/types/supportManagement";

// Matches gohive-backend/utils/adminReason.js
const NOTE_MIN_LENGTH = 3;
const NOTE_MAX_LENGTH = 500;

const TIMER_TONES = {
	ok: "text-secondary",
	warning: "text-amber-600",
	late: "text-destructive",
	muted: "text-muted-foreground",
};

const when = (value?: string | null) => (value ? format(new Date(value), "d MMM, h:mm a") : "—");

interface TicketDetailsProps {
	chat: ISupportChat;
	// The agent holding the chat, or a superadmin
	canEdit: boolean;
	now: number;
}

/**
 * The ticket behind a support chat: status, category, priority, the order it's
 * about, how fast it was answered, and how it was resolved.
 */
export default function TicketDetails({ chat, canEdit, now }: TicketDetailsProps) {
	const { mutate: updateTicket, isPending: isUpdating } = useUpdateTicket();
	const { mutate: resolveTicket, isPending: isResolving } = useResolveTicket();
	const [orderCode, setOrderCode] = useState(chat.order?.orderId ?? "");
	const [resolving, setResolving] = useState(false);
	const [resolution, setResolution] = useState<TicketResolution | "">("");
	const [note, setNote] = useState("");

	useEffect(() => {
		setOrderCode(chat.order?.orderId ?? "");
	}, [chat._id, chat.order?.orderId]);

	useEffect(() => {
		setResolving(false);
		setResolution("");
		setNote("");
	}, [chat._id]);

	const status = ticketStatusOf(chat);
	const resolved = status === "resolved";
	// Ended chats close their ticket with no outcome; agents can add one afterwards
	const needsOutcome = !chat.resolution;
	const timer = responseTimer(chat, now);
	const busy = isUpdating || isResolving;
	const trimmedCode = orderCode.trim().toUpperCase();
	const trimmedNote = note.trim();
	const noteNeeded = resolution === "other";
	const noteValid =
		trimmedNote.length === 0
			? !noteNeeded
			: trimmedNote.length >= NOTE_MIN_LENGTH && trimmedNote.length <= NOTE_MAX_LENGTH;

	const update = (changes: Parameters<typeof updateTicket>[0]) => updateTicket(changes);

	const confirmResolve = () => {
		if (!resolution || !noteValid) return;
		resolveTicket(
			{ id: chat._id, resolution, note: trimmedNote || undefined },
			{ onSuccess: () => setResolving(false) },
		);
	};

	return (
		<section
			aria-label="Ticket details"
			className="border-border bg-muted/20 space-y-3 border-b p-4 text-sm"
		>
			<div className="flex flex-wrap items-center gap-x-4 gap-y-1">
				<span className="font-semibold">{ticketCode(chat)}</span>
				<span className="text-muted-foreground">Opened {when(chat.createdAt)}</span>
				<span className={cn("font-medium", TIMER_TONES[timer.tone])}>{timer.label}</span>
				{resolved && chat.resolvedAt && (
					<span className="text-muted-foreground">
						Resolved in{" "}
						{formatDuration(
							new Date(chat.resolvedAt).getTime() -
								new Date(chat.createdAt).getTime(),
						)}
					</span>
				)}
			</div>

			{canEdit ? (
				<div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
					<div className="space-y-1">
						<Label htmlFor="ticket-status">Status</Label>
						<Select
							value={status}
							disabled={busy}
							onValueChange={(value) =>
								value !== "resolved" &&
								update({
									id: chat._id,
									status: value as Exclude<TicketStatus, "resolved">,
								})
							}
						>
							<SelectTrigger id="ticket-status" aria-label="Ticket status">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{TICKET_STATUSES.map((value) => (
									<SelectItem
										key={value}
										value={value}
										disabled={value === "resolved"}
									>
										{TICKET_STATUS_LABELS[value]}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-1">
						<Label htmlFor="ticket-category">Category</Label>
						<Select
							value={chat.category ?? ""}
							disabled={busy}
							onValueChange={(value) =>
								update({ id: chat._id, category: value as TicketCategory })
							}
						>
							<SelectTrigger id="ticket-category" aria-label="Ticket category">
								<SelectValue placeholder="Choose a category" />
							</SelectTrigger>
							<SelectContent>
								{TICKET_CATEGORIES.map((value) => (
									<SelectItem key={value} value={value}>
										{TICKET_CATEGORY_LABELS[value]}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-1">
						<Label htmlFor="ticket-priority">Priority</Label>
						<Select
							value={priorityOf(chat)}
							disabled={busy}
							onValueChange={(value) =>
								update({ id: chat._id, priority: value as TicketPriority })
							}
						>
							<SelectTrigger id="ticket-priority" aria-label="Ticket priority">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{TICKET_PRIORITIES.map((value) => (
									<SelectItem key={value} value={value}>
										{TICKET_PRIORITY_LABELS[value]}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>
			) : (
				<p className="text-muted-foreground">
					{TICKET_STATUS_LABELS[status]} · {categoryLabel(chat.category)} ·{" "}
					{TICKET_PRIORITY_LABELS[priorityOf(chat)]} priority
					{!resolved && " · Join the chat to change this ticket"}
				</p>
			)}

			<div className="flex flex-wrap items-end gap-2">
				{canEdit ? (
					<>
						<div className="min-w-48 flex-1 space-y-1">
							<Label htmlFor="ticket-order">Linked order</Label>
							<Input
								id="ticket-order"
								value={orderCode}
								placeholder="Order code, e.g. GH-123456"
								maxLength={40}
								onChange={(event) => setOrderCode(event.target.value)}
							/>
						</div>
						<Button
							size="sm"
							variant="outline"
							disabled={
								busy ||
								!trimmedCode ||
								trimmedCode === (chat.order?.orderId ?? "").toUpperCase()
							}
							onClick={() => update({ id: chat._id, orderCode: trimmedCode })}
						>
							Link order
						</Button>
						{chat.order && (
							<Button
								size="sm"
								variant="ghost"
								disabled={busy}
								onClick={() => update({ id: chat._id, orderCode: "" })}
							>
								Unlink
							</Button>
						)}
					</>
				) : (
					<span className="text-muted-foreground">
						Order: {chat.order ? "" : "none linked"}
					</span>
				)}
				{chat.order && (
					<Link
						href={`${ROUTES.ORDERS}?search=${encodeURIComponent(chat.order.orderId)}`}
						className="text-primary text-sm underline-offset-2 hover:underline"
					>
						Open {chat.order.orderId}
					</Link>
				)}
				{canEdit && needsOutcome && (
					<Button
						size="sm"
						className="ml-auto"
						variant={resolved ? "outline" : "default"}
						disabled={busy}
						onClick={() => setResolving(true)}
					>
						{resolved ? "Add outcome" : "Resolve ticket"}
					</Button>
				)}
			</div>

			{resolved && chat.resolution && (
				<p className="text-foreground">
					<span className="font-medium">{TICKET_RESOLUTION_LABELS[chat.resolution]}</span>
					{chat.resolutionNote && <>: {chat.resolutionNote}</>}
					<span className="text-muted-foreground">
						{" "}
						· {chat.resolvedByName ?? "Agent"}, {when(chat.resolvedAt)}
					</span>
				</p>
			)}
			{resolved && !chat.resolution && (
				<p className="text-muted-foreground">
					Chat ended {when(chat.resolvedAt ?? chat.closedAt)}. No outcome recorded yet.
				</p>
			)}

			<Dialog open={resolving} onOpenChange={(open) => !busy && setResolving(open)}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							{resolved ? "Add outcome to" : "Resolve"} {ticketCode(chat)}?
						</DialogTitle>
						<DialogDescription>
							{chat.status === "active"
								? "The chat is closed and the user is told. The outcome goes into the ticket report."
								: "The outcome goes into the ticket report."}
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-3">
						<div className="space-y-1">
							<Label htmlFor="ticket-resolution">Outcome</Label>
							<Select
								value={resolution}
								onValueChange={(value) => setResolution(value as TicketResolution)}
							>
								<SelectTrigger id="ticket-resolution" aria-label="Outcome">
									<SelectValue placeholder="How was it resolved?" />
								</SelectTrigger>
								<SelectContent>
									{TICKET_RESOLUTIONS.map((value) => (
										<SelectItem key={value} value={value}>
											{TICKET_RESOLUTION_LABELS[value]}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-1">
							<Label htmlFor="ticket-note">
								Note {noteNeeded ? "" : "(optional)"}
							</Label>
							<Textarea
								id="ticket-note"
								value={note}
								maxLength={NOTE_MAX_LENGTH}
								placeholder="What was done. Only staff see this."
								onChange={(event) => setNote(event.target.value)}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							disabled={busy}
							onClick={() => setResolving(false)}
						>
							Cancel
						</Button>
						<Button
							disabled={busy || !resolution || !noteValid}
							onClick={confirmResolve}
						>
							{isResolving && <Loader2 className="mr-2 size-4 animate-spin" />}
							{resolved ? "Save outcome" : "Resolve"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</section>
	);
}
