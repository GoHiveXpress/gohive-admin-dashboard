"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import RegisterStaffForm from "@/components/_auths/RegisterStaffForm";
import { Suspense } from "react";

function RegisterStaffContent() {
	const searchParams = useSearchParams();
	const token = searchParams.get("token") || "";
	const email = searchParams.get("email") || "";

	if (!token || !email) {
		return (
			<div className="z-10 w-full max-w-[500px] rounded-3xl bg-white p-10 text-center shadow-2xl">
				<h1 className="text-xl font-bold text-destructive">Invalid Link</h1>
				<p className="mt-2 text-gray-600">
					This registration link is invalid or has expired. Please contact your
					administrator for a new invitation.
				</p>
			</div>
		);
	}

	return (
		<div className="z-10 w-full max-w-[500px] px-4 md:px-0">
			<RegisterStaffForm token={token} email={email} />
		</div>
	);
}

export default function RegisterStaffPage() {
	return (
		<main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-white py-12">
			{/* Background Pattern */}
			<div className="absolute inset-0 z-0 flex items-center justify-center">
				<Image
					src="/assets/auth_bg.svg"
					alt="Background Pattern"
					fill
					priority
					quality={100}
					className="pointer-events-none scale-125 object-cover object-center md:scale-100"
				/>
			</div>

			<Suspense
				fallback={
					<div className="z-10 flex h-64 items-center justify-center rounded-3xl bg-white px-10 shadow-2xl">
						<span className="text-lg font-medium">Loading registration form...</span>
					</div>
				}
			>
				<RegisterStaffContent />
			</Suspense>
		</main>
	);
}
