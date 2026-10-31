// src/components/Customer/CustomerNotesTab/index.tsx
// Internal notes on a customer. Only admins see them.

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useAddCustomerNote, useCustomerNotes } from "@/hooks/useAccountTools";

const MAX_NOTE_LENGTH = 1000;

export default function CustomerNotesTab({ id }: { id: string }) {
	const [text, setText] = useState("");
	const { data, isLoading, error } = useCustomerNotes(id);
	const addNote = useAddCustomerNote(id);
	const notes = data?.data ?? [];
	const trimmed = text.trim();

	const submit = () => {
		if (!trimmed) return;
		addNote
			.mutateAsync(trimmed)
			.then(() => setText(""))
			.catch(() => undefined);
	};

	return (
		<div className="border-border/50 space-y-6 rounded-[20px] border bg-white p-6 shadow-sm">
			<div className="space-y-2">
				<label htmlFor="customer-note" className="text-foreground text-sm font-medium">
					Add a note
				</label>
				<Textarea
					id="customer-note"
					value={text}
					onChange={(e) => setText(e.target.value)}
					maxLength={MAX_NOTE_LENGTH}
					rows={3}
					placeholder="Only admins see notes. The customer never does."
					className="resize-none rounded-xl"
					disabled={addNote.isPending}
				/>
				<div className="flex items-center justify-between">
					<span className="text-muted-foreground text-xs">
						{text.length}/{MAX_NOTE_LENGTH}
					</span>
					<Button onClick={submit} disabled={!trimmed || addNote.isPending} size="sm">
						{addNote.isPending ? "Saving…" : "Add note"}
					</Button>
				</div>
			</div>

			{isLoading && <Skeleton className="h-20 w-full rounded-xl" />}
			{error && <p className="text-destructive text-center text-sm">Failed to load notes.</p>}
			{!isLoading && !error && notes.length === 0 && (
				<p className="text-muted-foreground p-6 text-center text-sm">No notes yet.</p>
			)}
			<ul className="space-y-3">
				{notes.map((note) => (
					<li key={note._id} className="bg-muted/20 rounded-xl p-4">
						<p className="text-foreground whitespace-pre-wrap text-sm">{note.text}</p>
						<p className="text-muted-foreground mt-2 text-xs">
							{note.authorName ?? "Admin"} ·{" "}
							{new Date(note.createdAt).toLocaleString("en-NG", {
								dateStyle: "medium",
								timeStyle: "short",
							})}
						</p>
					</li>
				))}
			</ul>
		</div>
	);
}
