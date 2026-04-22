// src/types/communication.ts

export type UserRole = "customer" | "vendor" | "rider" | "all";
export type CommunicationType = "broadcast" | "campaign-email" | "campaign-sms";
export type CommunicationStatus = "draft" | "sent" | "scheduled" | "expired";

export interface INotificationTemplate {
	_id: string;
	title: string;
	message: string;
	createdBy: string;
	updatedBy?: string;
	createdAt: string;
	updatedAt: string;
}

export interface ICommunication {
	_id: string;
	subject: string;
	content: string;
	targetAudience: UserRole[];
	type: CommunicationType;
	status: CommunicationStatus;
	scheduledAt?: string;
	analytics: {
		deliverySuccessRate: number;
		openRate: number;
		clickThroughRate: number;
	};
	createdBy: string | { _id: string; name: string };
	updatedBy?: string;
	createdAt: string;
	updatedAt: string;
}

export interface ICreateTemplateRequest {
	title: string;
	message: string;
}

export interface ICreateCommunicationRequest {
	subject: string;
	content: string;
	targetAudience: UserRole[];
	type: CommunicationType;
	status?: CommunicationStatus;
	scheduledAt?: string;
	ctaLink?: string;
}
