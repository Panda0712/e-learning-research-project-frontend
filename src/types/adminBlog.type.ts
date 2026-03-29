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
}

export interface UpsertBlogPostPayload {
  title: string;
  slug: string;
  content: string;
  categoryId: number;
  thumbnail?: BlogThumbnailPayload;
}
