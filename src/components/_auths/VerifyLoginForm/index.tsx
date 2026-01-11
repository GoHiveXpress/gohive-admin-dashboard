"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

// Standardized imports using default imports where applicable
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
	email: z.string().email({ message: "Please enter a valid email address." }),
	password: z.string().min(1, { message: "Password is required." }),
});

export default function VerifyLoginForm() {
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	async function onSubmit(_values: z.infer<typeof formSchema>) {
		setIsLoading(true);
		// console.log(_values); // Unused log removed
		setTimeout(() => setIsLoading(false), 2000);
	}

	return (
		<div className="w-full overflow-hidden rounded-[32px] border border-gray-100 bg-white font-sans shadow-2xl">
			{/* --- Custom Header Section --- */}
			<div className="relative flex h-40 items-center justify-center overflow-hidden bg-[#17110A]">
				{/* Hot Plate Icon */}
				<div className="absolute -left-4 top-2 size-24">
					<Image
						src="/assets/hot_plate.png"
						alt="Decoration"
						fill
						className="object-contain opacity-90"
						sizes="96px"
					/>
				</div>

				{/* Brand Logo */}
				<div className="relative z-10 size-40">
					<Image
						src="/assets/logo_gohive.png"
						alt="GoHive Logo"
						fill
						className="object-contain"
						sizes="100px"
						priority
					/>
				</div>

				<div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />
			</div>

			{/* --- Form Body --- */}
			<div className="px-10 py-12">
				<div className="mb-10 text-center">
					<h1 className="text-lg font-semibold uppercase tracking-widest text-[#17110A]">
						Enter OTP Code
					</h1>
					<p className="mt-2 text-sm text-gray-600">
						Check for your email for the OTP code and enter it.
					</p>
				</div>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						{/* Email Field */}
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem className="space-y-1.5">
									<FormControl>
										<div className="group relative">
											<Input
												placeholder="XXXXX"
												className="h-[52px] text-center rounded-xl border border-[#E2E8F0] !bg-white pl-12 text-lg shadow-sm placeholder:text-gray-400 focus-visible:border-[#FDB900] focus-visible:ring-[#FDB900] font-semibold"
												{...field}
											/>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Submit Button */}
						<Button
							type="submit"
							className="mt-4 h-[52px] w-full rounded-xl bg-[#FDB900] text-[15px] font-bold uppercase tracking-wide text-[#17110A] shadow-md transition-all duration-200 ease-in-out hover:bg-[#E5A800] hover:shadow-lg"
							disabled={isLoading}
						>
							{isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
							Verify
						</Button>

						<div className="pt-2 text-center">Resend OTP Code [15 secs]</div>
					</form>
				</Form>
			</div>
		</div>
	);
}
