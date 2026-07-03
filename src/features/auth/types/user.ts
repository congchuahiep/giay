import { createFromDto } from "@/shared/utils";

export type User = {
	id: string;
	email: string;
	name?: string;
};

export type UserProfile = {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
};

export type UserProfileDTO = {
	id: string;
	email: string;
	first_name: string;
	last_name: string;
};

export const userProfileFromDto = createFromDto<UserProfileDTO, UserProfile>({
	id: "id",
	email: "email",
	firstName: "first_name",
	lastName: "last_name",
});
