"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, Phone, Lock, Calendar, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { useRegisterStaff } from "@/hooks/userManagement";

const formSchema = z
	.object({
		name: z.string().min(1, { message: "Full Name is required." }),
		phone: z.string().min(10, { message: "Please enter a valid phone number." }),
		dob: z.string().min(1, { message: "Date of Birth is required." }),
		password: z
			.string()
			.min(8, { message: "Password must be at least 8 characters." })
			.regex(/[A-Z]/, { message: "Must contain at least one uppercase letter." })
			.regex(/[a-z]/, { message: "Must contain at least one lowercase letter." })
			.regex(/[0-9]/, { message: "Must contain at least one number." })
			.regex(/[^A-Za-z0-9]/, { message: "Must contain at least one special character." }),
		confirmPassword: z.string().min(1, { message: "Please confirm your password." }),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match.",
		path: ["confirmPassword"],
	});

interface RegisterStaffFormProps {
	token: string;
	email: string;
}

export default function RegisterStaffForm({ token, email }: RegisterStaffFormProps) {
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const { mutate: register, isPending } = useRegisterStaff();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			phone: "",
			dob: "",
			password: "",
			confirmPassword: "",
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		const payload = {
			token,
			name: values.name,
			phone: values.phone,
			password: values.password,
			dob: values.dob,
		};
		console.log("🚀 [REGISTER_SUBMIT]:", payload);
		register(payload);
	}

	// For debugging validation issues
	const errors = form.formState.errors;
	if (Object.keys(errors).length > 0) {
		console.log("❌ [FORM_VALIDATION_ERRORS]:", errors);
	}

	return (
		<div className="w-full overflow-hidden rounded-[32px] border border-gray-100 bg-white font-sans shadow-2xl">
			{/* Header with Brand Styling */}
			<div className="relative flex h-32 items-center justify-center overflow-hidden bg-[#17110A]">
				<div className="absolute -left-4 top-2 size-20">
					<Image
						src="/assets/hot_plate.png"
						alt="Decoration"
						fill
						className="object-contain opacity-90"
						sizes="80px"
					/>
				</div>
				<div className="relative z-10 h-24 w-32">
					<Image
						src="/assets/logo_gohive.png"
						alt="GoHive Logo"
						fill
						className="object-contain"
						sizes="128px"
						priority
					/>
				</div>
				<div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />
			</div>

			<div className="px-8 py-10">
				<div className="mb-8 text-center text-[#17110A]">
					<h1 className="text-lg font-bold uppercase tracking-widest ">
						Complete Your Admin Profile
					</h1>
					<p className="mt-1 text-sm text-gray-500">
						You've been invited to join the GoHive Admin Team
					</p>
				</div>

				{/* Pre-filled Email Display */}
				<div className="mb-6 rounded-xl bg-gray-50 p-4">
					<p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
						Invited Email Address
					</p>
					<p className="font-semibold text-[#17110A]">{email}</p>
				</div>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
						<FormField
							control={form.control}
							name="name"
							render={({ field, fieldState }) => (
								<FormItem className="space-y-1.5">
									<FormLabel className="ml-1 text-xs font-bold uppercase tracking-wide text-[#17110A]">
										Full Name
									</FormLabel>
									<FormControl>
										<div className="group relative">
											<User className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-gray-400 transition-colors duration-200 group-focus-within:text-[#17110A]" />
											<Input
												placeholder="Enter your full name"
												className={cn(
													"h-[52px] rounded-xl border border-[#E2E8F0] !bg-white pl-12 text-[15px] shadow-sm placeholder:text-gray-400 focus-visible:border-[#FDB900] focus-visible:ring-[#FDB900]",
													fieldState.error &&
														"!border-destructive focus-visible:!border-destructive focus-visible:!ring-destructive",
												)}
												{...field}
											/>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="grid grid-cols-1 gap-5 md:grid-cols-2">
							<FormField
								control={form.control}
								name="phone"
								render={({ field, fieldState }) => (
									<FormItem className="space-y-1.5">
										<FormLabel className="ml-1 text-xs font-bold uppercase tracking-wide text-[#17110A]">
											Phone Number
										</FormLabel>
										<FormControl>
											<div className="group relative">
												<Phone className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-gray-400 transition-colors duration-200 group-focus-within:text-[#17110A]" />
												<Input
													placeholder="+234..."
													className={cn(
														"h-[52px] rounded-xl border border-[#E2E8F0] !bg-white pl-12 text-[15px] shadow-sm placeholder:text-gray-400 focus-visible:border-[#FDB900] focus-visible:ring-[#FDB900]",
														fieldState.error &&
															"!border-destructive focus-visible:!border-destructive focus-visible:!ring-destructive",
													)}
													{...field}
												/>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="dob"
								render={({ field, fieldState }) => (
									<FormItem className="space-y-1.5">
										<FormLabel className="ml-1 text-xs font-bold uppercase tracking-wide text-[#17110A]">
											Date of Birth
										</FormLabel>
										<FormControl>
											<div className="group relative">
												<Calendar className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-gray-400 transition-colors duration-200 group-focus-within:text-[#17110A]" />
												<Input
													type="date"
													className={cn(
														"h-[52px] rounded-xl border border-[#E2E8F0] !bg-white pl-12 text-[15px] shadow-sm placeholder:text-gray-400 focus-visible:border-[#FDB900] focus-visible:ring-[#FDB900]",
														fieldState.error &&
															"!border-destructive focus-visible:!border-destructive focus-visible:!ring-destructive",
													)}
													{...field}
												/>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name="password"
							render={({ field, fieldState }) => (
								<FormItem className="space-y-1.5">
									<FormLabel className="ml-1 text-xs font-bold uppercase tracking-wide text-[#17110A]">
										Password
									</FormLabel>
									<FormControl>
										<div className="group relative">
											<Lock className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-gray-400 transition-colors duration-200 group-focus-within:text-[#17110A]" />
											<Input
												type={showPassword ? "text" : "password"}
												placeholder="••••••••"
												className={cn(
													"h-[52px] rounded-xl border border-[#E2E8F0] !bg-white px-12 text-[15px] shadow-sm placeholder:text-gray-400 focus-visible:border-[#FDB900] focus-visible:ring-[#FDB900]",
													fieldState.error &&
														"!border-destructive focus-visible:!border-destructive focus-visible:!ring-destructive",
												)}
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

						<FormField
							control={form.control}
							name="confirmPassword"
							render={({ field, fieldState }) => (
								<FormItem className="space-y-1.5">
									<FormLabel className="ml-1 text-xs font-bold uppercase tracking-wide text-[#17110A]">
										Confirm Password
									</FormLabel>
									<FormControl>
										<div className="group relative">
											<Lock className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-gray-400 transition-colors duration-200 group-focus-within:text-[#17110A]" />
											<Input
												type={showConfirmPassword ? "text" : "password"}
												placeholder="••••••••"
												className={cn(
													"h-[52px] rounded-xl border border-[#E2E8F0] !bg-white px-12 text-[15px] shadow-sm placeholder:text-gray-400 focus-visible:border-[#FDB900] focus-visible:ring-[#FDB900]",
													fieldState.error &&
														"!border-destructive focus-visible:!border-destructive focus-visible:!ring-destructive",
												)}
												{...field}
											/>
											<button
												type="button"
												onClick={() =>
													setShowConfirmPassword(!showConfirmPassword)
												}
												className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 transition-colors hover:text-[#17110A] focus:outline-none"
												tabIndex={-1}
											>
												{showConfirmPassword ? (
													<Eye className="size-5" />
												) : (
													<EyeOff className="size-5" />
												)}
											</button>
										</div>
									</FormControl>
									<FormMessage className="!mt-2" />
								</FormItem>
							)}
						/>

						<Button
							type="submit"
							className="mt-4 h-[52px] w-full rounded-xl bg-[#FDB900] text-[15px] font-bold uppercase tracking-wide text-[#17110A] shadow-md transition-all duration-200 ease-in-out hover:bg-[#E5A800] hover:shadow-lg"
							disabled={isPending}
						>
							{isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
							Register Account
						</Button>
					</form>
				</Form>
			</div>
		</div>
	);
}
