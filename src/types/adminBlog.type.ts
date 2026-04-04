export interface BlogCategoryItem {
  id: number;
  name: string;
  slug: string;
}

export interface BlogThumbnailPayload {
  publicId: string;
  fileUrl: string;
  fileSize?: number;
  fileType?: string;
}

export type BlogPostStatus =
  | "draft"
  | "pending"
  | "published"
  | "rejected"
  | "archived";

export interface BlogPostItem {
  id: number;
  stt?: number;
  title: string;
  slug?: string;
  content?: string;
  image: string;
  thumbnail?: BlogThumbnailPayload | null;
  category: string;
  categoryId?: number;
  author: string;
  authorId: number;
  status?: BlogPostStatus;
  reviewNote?: string | null;
  reviewedById?: number | null;
  reviewedBy?: string | null;
  publishedAt?: string | null;
  date?: string;
  createdAt?: string;
  updatedAt?: string;
  totalComments?: number;
}

export interface BlogPostsPagination {
  page: number;
  itemsPerPage: number;
  total: number;
  totalPages: number;
}

export interface BlogPostsPaginatedResponse {
  data: BlogPostItem[];
  pagination: BlogPostsPagination;
}

export interface AdminBlogListQuery {
  page: number;
  itemsPerPage: number;
  status?: BlogPostStatus;
}

export interface UpsertBlogPostPayload {
  title: string;
  slug: string;
  content: string;
  categoryId: number;
  status?: BlogPostStatus;
  thumbnail?: BlogThumbnailPayload;
}

export interface UpdateBlogPostStatusPayload {
  status: BlogPostStatus;
  reviewNote?: string;
}

export interface BlogCommentItem {
  id: number;
  blogId: number;
  userId: number;
  content: string;
  parentId: number | null;
  createdAt: string;
  updatedAt?: string | null;
  isBannedUser?: boolean;
  user: {
    id: number;
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
  };
}

export interface CreateBlogCommentPayload {
  blogId: number;
  content: string;
  parentId?: number;
}
