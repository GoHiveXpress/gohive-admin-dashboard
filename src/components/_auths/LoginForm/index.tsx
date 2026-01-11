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

export default function LoginForm() {
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
						Log in to your account
					</h1>
				</div>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						{/* Email Field */}
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem className="space-y-1.5">
									<FormLabel className="ml-1 text-sm font-semibold text-[#17110A]">
										Email
									</FormLabel>
									<FormControl>
										<div className="group relative">
											<Mail className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-gray-400 transition-colors duration-200 group-focus-within:text-[#17110A]" />
											<Input
												placeholder="victor@gohiveadmin.info"
												className="h-[52px] rounded-xl border border-[#E2E8F0] !bg-white pl-12 text-[15px] shadow-sm placeholder:text-gray-400 focus-visible:border-[#FDB900] focus-visible:ring-[#FDB900]"
												{...field}
											/>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Password Field */}
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem className="space-y-1.5">
									<FormLabel className="ml-1 text-sm font-semibold text-[#17110A]">
										Password
									</FormLabel>
									<FormControl>
										<div className="group relative">
											<Lock className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-gray-400 transition-colors duration-200 group-focus-within:text-[#17110A]" />
											<Input
												type={showPassword ? "text" : "password"}
												placeholder="••••••••"
												className="h-[52px] rounded-xl border border-[#E2E8F0] !bg-white px-12 text-[15px] shadow-sm placeholder:text-gray-400 focus-visible:border-[#FDB900] focus-visible:ring-[#FDB900]"
												{...field}
											/>
											<button
												type="button"
												onClick={() => setShowPassword(!showPassword)}
												className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 transition-colors hover:text-[#17110A] focus:outline-none"
												tabIndex={-1}
											>
												{showPassword ? (
													<Eye className="size-5" />
												) : (
													<EyeOff className="size-5" />
												)}
											</button>
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
							Log in
						</Button>

						{/* Forgot Password */}
						<div className="pt-2 text-center">
							<Link
								href="/forgot-password"
								className="text-xs font-bold uppercase tracking-wide text-[#17110A] transition-colors hover:text-[#FDB900] hover:underline"
							>
								Forgot your password?
							</Link>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
}
