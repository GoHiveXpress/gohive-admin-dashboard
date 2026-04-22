// src/components/_auths/VerifyLoginForm/index.tsx
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react"; // Import NextAuth signIn
import { toast } from "sonner";
import { useResendOtp } from "@/hooks/authManagement";
import { authApi } from "@/app/api/authManagement";
import { setAuthToken } from "@/utils/auth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

const formSchema = z.object({
	otp: z.string().min(4, "OTP must be at least 4 characters"),
});

export default function VerifyLoginForm() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [email, setEmail] = useState("");

	// Resend Hook
	const { mutate: resendOtp, isPending: isResending } = useResendOtp();

	useEffect(() => {
		const storedEmail = sessionStorage.getItem("admin_login_email");
		if (storedEmail) {
			setEmail(storedEmail);
		} else {
			// If no email found, redirect back to login
			toast.error("Session invalid. Please login again.");
			router.push("/login");
		}
	}, [router]);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: { otp: "" },
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setIsLoading(true);

		try {
			// 1. Call API directly to ensure we get the token and can save it manually
			// This fixes the 401 issue where NextAuth session might be null/delayed
			const response = await authApi.verifyOtp({
				email,
				otp: values.otp,
			});

			if (response.success && response.token) {
				// 2. Save token to localStorage for apiClient fallback
				setAuthToken(response.token);

				// 3. Sync with NextAuth for server-side / middleware awareness
				// We don't need to re-verify here as authorize() in nextAuthOptions
				// will call the same endpoint, which is fine for sync purposes.
				const result = await signIn("credentials", {
					email,
					otp: values.otp,
					isOtpFlow: "true",
					redirect: false,
				});

				if (result?.ok) {
					toast.success("Verification Successful");
					sessionStorage.removeItem("admin_login_email"); // Cleanup
					router.push("/dashboard");
				} else {
					setIsLoading(false);
					toast.error(result?.error || "NextAuth synchronization failed");
				}
			} else {
				setIsLoading(false);
				toast.error(response.message || "Verification failed");
			}
		} catch (error: any) {
			setIsLoading(false);
			toast.error(error.message || "An unexpected error occurred");
		}
	}

	const handleResend = () => {
		if (email) {
			resendOtp(email);
		}
	};

	return (
		<div className="w-full overflow-hidden rounded-[32px] border border-gray-100 bg-white font-sans shadow-2xl">
			<div className="relative flex h-40 items-center justify-center overflow-hidden bg-[#17110A]">
				<div className="absolute -left-4 top-2 size-24">
					<Image
						src="/assets/hot_plate.png"
						alt="Decoration"
						fill
						className="object-contain opacity-90"
						sizes="96px"
					/>
				</div>
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

			<div className="px-10 py-12">
				<div className="mb-10 text-center">
					<h1 className="text-lg font-semibold uppercase tracking-widest text-[#17110A]">
						Enter OTP Code
					</h1>
					<p className="mt-2 text-sm text-gray-600">
						Check for your email for the OTP code and enter it below.
					</p>
				</div>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<FormField
							control={form.control}
							name="otp"
							render={({ field }) => (
								<FormItem className="space-y-1.5">
									<FormControl>
										<div className="group relative">
											<Input
												placeholder="XXXXXX"
												className="h-[52px] rounded-xl border border-[#E2E8F0] !bg-white pl-12 text-center text-lg font-semibold shadow-sm placeholder:text-gray-400 focus-visible:border-[#FDB900] focus-visible:ring-[#FDB900]"
												{...field}
											/>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button
							type="submit"
							className="mt-4 h-[52px] w-full rounded-xl bg-[#FDB900] text-[15px] font-bold uppercase tracking-wide text-[#17110A] shadow-md transition-all duration-200 ease-in-out hover:bg-[#E5A800] hover:shadow-lg"
							disabled={isLoading}
						>
							{isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
							Verify
						</Button>

						<div className="pt-2 text-center">
							<button
								type="button"
								onClick={handleResend}
								disabled={isResending}
								className="text-sm underline hover:text-[#FDB900]"
							>
								{isResending ? "Sending..." : "Resend OTP Code"}
							</button>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
}

/* eslint-enable */
