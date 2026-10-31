"use client";

import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PanelHeader } from "@/components/_atoms/OrderAtoms";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAddOrderNote, useOrderNotes } from "@/hooks/customerManagement";
import { usePermissions } from "@/hooks/usePermissions";
import { ACTION_RULES } from "@/lib/permissions";

// Matches NOTE_MAX_LENGTH in gohive-backend/utils/orderIntervention.js
const NOTE_MAX_LENGTH = 1000;

const noteTime = (value: string) =>
	new Date(value).toLocaleString([], {
		day: "numeric",
		month: "short",
		hour: "2-digit",
		minute: "2-digit",
	});

/** Internal notes on an order. Only staff see them, never the customer, vendor or rider. */
export default function OrderNotesPanel({ orderId }: { orderId?: string }) {
	const { allows } = usePermissions();
	const mayNote = allows(ACTION_RULES.addOrderNote);
	const [text, setText] = useState("");
	const { data, isLoading } = useOrderNotes(mayNote ? orderId : undefined);
	const { mutate: addNote, isPending } = useAddOrderNote();

	useEffect(() => setText(""), [orderId]);

	if (!orderId || !mayNote) return null;

	const notes = data?.data ?? [];
	const trimmed = text.trim();

	const submit = () => {
		addNote(
			{ id: orderId, text: trimmed },
			{
				onSuccess: () => setText(""),
				onError: (error) => toast.error(error.message || "Failed to add note"),
			},
		);
	};

	let list: React.ReactNode;
	if (isLoading) {
		list = (
			<div className="flex justify-center py-2">
				<Loader2 className="text-secondary animate-spin" />
			</div>
		);
	} else if (notes.length === 0) {
		list = <p className="text-muted-foreground text-sm">No notes yet.</p>;
	} else {
		list = (
			<ul className="custom-scrollbar max-h-64 space-y-3 overflow-y-auto pr-1">
				{notes.map((note) => (
					<li key={note._id} className="bg-muted/40 rounded-lg p-3 text-sm">
						<p className="text-foreground whitespace-pre-wrap break-words">
							{note.text}
						</p>
						<p className="text-muted-foreground mt-1 text-xs">
							{note.authorName ?? "Admin"} · {noteTime(note.createdAt)}
						</p>
					</li>
				))}
			</ul>
		);
	}

	return (
		<div className="bg-card border-border space-y-4 rounded-xl border p-6 shadow-sm">
			<PanelHeader title="Internal Notes" />
			{list}
			<div className="space-y-2">
				<Label htmlFor="order-note">Add a note</Label>
				<Textarea
					id="order-note"
					value={text}
					maxLength={NOTE_MAX_LENGTH}
					placeholder="Only GoHive staff can see this."
					onChange={(event) => setText(event.target.value)}
				/>
				<Button size="sm" disabled={!trimmed || isPending} onClick={submit}>
					{isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
					Add note
				</Button>
			</div>
		</div>
	);
}
