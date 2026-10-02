import type { components } from "@/api/generated/schema";

export type UserProfile = components["schemas"]["UserResponse"];

export type UserRole = components["schemas"]["UserRole"];

export type User = {
	id: string;
	email: string;
	name?: string;
};
