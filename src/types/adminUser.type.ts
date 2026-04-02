export interface AdminUserItem {
  id: number;
  stt?: number;
  firstName?: string | null;
  lastName?: string | null;
  email: string;
  role: "student" | "lecturer" | "admin" | string;
  phoneNumber?: string | null;
  dateOfBirth?: string | null;
  isVerified: boolean;
  isDestroyed: boolean;
  createdAt?: string;
  avatar?: {
    fileUrl?: string;
  } | null;
}

export interface AdminUsersPagination {
  page: number;
  itemsPerPage: number;
  total: number;
  totalPages: number;
}

export interface AdminUsersResponse {
  data: AdminUserItem[];
  pagination: AdminUsersPagination;
}

export interface AdminUsersQuery {
  page: number;
  itemsPerPage: number;
  role?: "student" | "lecturer";
}
