import * as z from "zod";

export const inviteStaffSchema = z.object({
	email: z.string().email({ message: "Please enter a valid email address." }),
});

export const registerStaffSchema = z.object({
	name: z.string().min(2, { message: "Name must be at least 2 characters." }),
	phone: z.string().min(10, { message: "Please enter a valid phone number." }),
	dob: z.string().optional(),
	profilePicture: z.string().optional(),
	password: z
		.string()
		.min(8, { message: "Password must be at least 8 characters." })
		.regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
		.regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
		.regex(/[0-9]/, { message: "Password must contain at least one number." }),
	confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
	message: "Passwords do not match.",
	path: ["confirmPassword"],
});

export type InviteStaffValues = z.infer<typeof inviteStaffSchema>;
export type RegisterStaffValues = z.infer<typeof registerStaffSchema>;
