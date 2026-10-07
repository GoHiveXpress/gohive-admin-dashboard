/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { type ISupportMessage } from "@/types/supportManagement";

// A message whose whole content is an image link is shown as a picture, even if it
// was saved as a text message (older app versions sent images that way)
const IMAGE_LINK =
	/^https?:\/\/(\S+\.(png|jpe?g|gif|webp|heic)(\?\S*)?|res\.cloudinary\.com\/\S+\/image\/upload\/\S+)$/i;

interface Props {
	message: ISupportMessage;
	mine: boolean;
}

/**
 * The body of one support chat message: text, an image (click to view full size),
 * or the bot's quick-reply options.
 */
export default function ChatMessageContent({ message, mine }: Props) {
	const [viewing, setViewing] = useState(false);
	const bubble = mine
		? "bg-primary text-primary-foreground rounded-br-none shadow-sm"
		: "bg-muted text-foreground rounded-tl-none";

	const isImage =
		message.type === "image" ||
		(message.type !== "options" && IMAGE_LINK.test(message.content.trim()));

	if (isImage) {
		return (
			<>
				<button
					type="button"
					onClick={() => setViewing(true)}
					className={`block max-w-xs overflow-hidden rounded-2xl ${mine ? "rounded-br-none" : "rounded-tl-none"} border-border border`}
					aria-label="View image"
				>
					<img
						src={message.content}
						alt="Sent image"
						loading="lazy"
						className="max-h-64 w-full cursor-zoom-in object-cover"
					/>
				</button>
				<Dialog open={viewing} onOpenChange={setViewing}>
					<DialogContent className="max-w-4xl border-none bg-transparent p-0 shadow-none">
						<DialogTitle className="sr-only">Image</DialogTitle>
						<img
							src={message.content}
							alt="Sent image"
							className="max-h-[85vh] w-full rounded-lg object-contain"
						/>
						<a
							href={message.content}
							target="_blank"
							rel="noopener noreferrer"
							className="mx-auto flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs text-white hover:bg-black/80"
						>
							<Icon icon="lucide:external-link" className="size-3.5" />
							Open original
						</a>
					</DialogContent>
				</Dialog>
			</>
		);
	}

	return (
		<div className={`max-w-sm rounded-2xl px-4 py-2 text-sm ${bubble}`}>
			<p className="whitespace-pre-wrap break-words">{message.content}</p>
			{message.type === "options" && message.options && message.options.length > 0 && (
				<div className="mt-2 flex flex-wrap gap-1.5">
					{message.options.map((option) => (
						<span
							key={option.value}
							className="rounded-full border border-current/30 px-2.5 py-0.5 text-xs opacity-90"
						>
							{option.label}
						</span>
					))}
				</div>
			)}
		</div>
	);
}

/* eslint-enable */
