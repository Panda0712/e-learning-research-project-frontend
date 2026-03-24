import authorizedAxiosInstance from "../utils/authorizedAxios";
import { API_ROOT } from "../utils/constants";

export interface AdminBlogListQuery {
  page: number;
  itemsPerPage: number;
}

export interface AdminBlogItem {
  id: number;
  title: string;
  slug?: string | null;
  content?: string | null;
  createdAt: string;
  updatedAt?: string | null;
  author?: {
    id: number;
    firstName?: string | null;
    lastName?: string | null;
    email: string;
  };
  category?: {
    id: number;
    name: string;
    slug: string;
  } | null;
  thumbnail?: {
    fileUrl?: string;
  } | null;
  _count?: {
    comments: number;
  };
}

export interface AdminBlogListResponse {
  posts: AdminBlogItem[];
  totalPosts: number;
  page: number;
  itemsPerPage: number;
  totalPages: number;
}

export interface AdminBlogDetailResponse extends AdminBlogItem {
  comments?: Array<{
    id: number;
    content?: string | null;
    createdAt: string;
    user?: {
      id: number;
      firstName?: string | null;
      lastName?: string | null;
      email: string;
    };
  }>;
}

export interface AdminBlogPayload {
  title: string;
  slug: string;
  content: string;
  categoryId: number;
  thumbnail: {
    publicId: string;
    fileUrl: string;
    fileSize?: number;
    fileType?: string;
  };
}

export interface BlogCategoryItem {
  id: number;
  name: string;
  slug: string;
}

export const blogApi = {
  getAllBlogPostsAPI: async () => {
    const res = await authorizedAxiosInstance.get(`${API_ROOT}/v1/blogs/blogPost`);
    return res.data;
  },
  getBlogDetailAPI: async (id: string) => {
    const res = await authorizedAxiosInstance.get(`${API_ROOT}/v1/blogs/blogPost/${id}`);
    return res.data;
  },
  getBlogCategoriesAPI: async () => {
    const res = await authorizedAxiosInstance.get<BlogCategoryItem[]>(
      `${API_ROOT}/v1/blogs/categories`,
    );
    return res.data;
  },
  getAdminBlogPostsAPI: async (params: AdminBlogListQuery) => {
    const res = await authorizedAxiosInstance.get<AdminBlogListResponse>(
      `${API_ROOT}/v1/blogs/admin/posts`,
      { params },
    );
    return res.data;
  },
  getAdminBlogDetailAPI: async (id: number) => {
    const res = await authorizedAxiosInstance.get<AdminBlogDetailResponse>(
      `${API_ROOT}/v1/blogs/admin/posts/${id}`,
    );
    return res.data;
  },
  createAdminBlogPostAPI: async (data: AdminBlogPayload) => {
    const res = await authorizedAxiosInstance.post(
      `${API_ROOT}/v1/blogs/admin/posts`,
      data,
    );
    return res.data;
  },
  updateAdminBlogPostAPI: async (id: number, data: Partial<AdminBlogPayload>) => {
    const res = await authorizedAxiosInstance.put(
      `${API_ROOT}/v1/blogs/admin/posts/${id}`,
      data,
    );
    return res.data;
  },
};
