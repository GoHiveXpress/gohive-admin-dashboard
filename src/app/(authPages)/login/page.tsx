import Image from "next/image";
import LoginForm from "@/components/_auths/LoginForm";

export default function LoginPage() {
	return (
		<main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-white">
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
			<div className="z-10 w-full max-w-[500px] px-4 md:px-0">
				<LoginForm />
			</div>
		</main>
	);
}