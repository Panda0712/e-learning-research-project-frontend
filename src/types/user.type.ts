export interface UserProfile {
  id: string;
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  birthDay?: number | null;
  birthMonth?: number | null;
  birthYear?: number | null;
}

// Pick - take necessary properties
// Partial - make all fields optional
export type UpdateProfilePayload = Partial<
  Pick<
    UserProfile,
    | "firstName"
    | "lastName"
    | "email"
    | "phone"
    | "birthDay"
    | "birthMonth"
    | "birthYear"
  >
>;

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}
