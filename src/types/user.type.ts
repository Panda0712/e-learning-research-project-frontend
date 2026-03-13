export interface UserProfile {
  id: string;
  firstName: string;
  lastName?: string;
  email: string;
  role: string;
  phoneNumber?: string;
  avatarUrl?: string;
  dateOfBirth?: Date | null;
}

export interface ProfileLecturersAPIData {
  lecturers: ProfileLecturerDetailAPIData[];
  totalLecturers: number;
}

export interface ProfileLecturerDetailAPIData {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  avatarId?: number;
  phoneNumber?: string;
  dateOfBirth?: string;
  role: string;
  isVerified: boolean;
  avatar?: {
    fileUrl?: string;
  };
  createdAt: Date;
  updatedAt?: Date;
  isDestroyed: boolean;
}

// Pick - take necessary properties
// Partial - make all fields optional
export type UpdateProfilePayload = Partial<
  Pick<
    UserProfile,
    "firstName" | "lastName" | "email" | "phoneNumber" | "dateOfBirth"
  >
>;

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}
