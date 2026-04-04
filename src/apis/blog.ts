import authorizedAxiosInstance from "../utils/authorizedAxios";
import type {
  AdminBlogListQuery,
  BlogCommentItem,
  BlogPostsPaginatedResponse,
  CreateBlogCommentPayload,
  UpdateBlogPostStatusPayload,
  UpsertBlogPostPayload,
} from "../types/adminBlog.type";
import { API_ROOT } from "../utils/constants";

export const blogApi = {
  getAllBlogPostsAPI: async () => {
    const res = await authorizedAxiosInstance.get(`${API_ROOT}/v1/blogs/blogPost`);
    return res.data;
  },

  getAdminBlogPostsAPI: async ({
    page,
    itemsPerPage,
    status,
  }: AdminBlogListQuery): Promise<BlogPostsPaginatedResponse> => {
    const res = await authorizedAxiosInstance.get(`${API_ROOT}/v1/blogs/admin/posts`, {
      params: { page, itemsPerPage, status },
    });
    return res.data;
  },

  getLecturerBlogPostsAPI: async ({
    page,
    itemsPerPage,
    status,
  }: AdminBlogListQuery): Promise<BlogPostsPaginatedResponse> => {
    const res = await authorizedAxiosInstance.get(`${API_ROOT}/v1/blogs/lecturer/posts`, {
      params: { page, itemsPerPage, status },
    });
    return res.data;
  },

  getBlogDetailAPI: async (id: string) => {
    const res = await authorizedAxiosInstance.get(`${API_ROOT}/v1/blogs/blogPost/${id}`);
    return res.data;
  },

  getAdminBlogDetailAPI: async (id: string) => {
    const res = await authorizedAxiosInstance.get(`${API_ROOT}/v1/blogs/admin/posts/${id}`);
    return res.data;
  },

  getLecturerBlogDetailAPI: async (id: string) => {
    const res = await authorizedAxiosInstance.get(`${API_ROOT}/v1/blogs/lecturer/posts/${id}`);
    return res.data;
  },

  getAllBlogCategoriesAPI: async () => {
    const res = await authorizedAxiosInstance.get(`${API_ROOT}/v1/blogs/categories`);
    return res.data;
  },

  createBlogCategoryAPI: async (payload: { name: string; slug: string }) => {
    const res = await authorizedAxiosInstance.post(
      `${API_ROOT}/v1/blogs/categories`,
      payload,
    );
    return res.data;
  },

  uploadBlogThumbnailAPI: async (formData: FormData) => {
    const res = await authorizedAxiosInstance.post(
      `${API_ROOT}/v1/blogs/thumbnail`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return {
      publicId: res.data?.public_id,
      fileUrl: res.data?.secure_url,
      fileSize: res.data?.bytes,
      fileType: res.data?.format,
    };
  },

  createBlogPostAPI: async (payload: UpsertBlogPostPayload) => {
    const res = await authorizedAxiosInstance.post(
      `${API_ROOT}/v1/blogs/blogPost`,
      payload,
    );
    return res.data;
  },

  updateBlogPostAPI: async (id: number, payload: Partial<UpsertBlogPostPayload>) => {
    const res = await authorizedAxiosInstance.put(
      `${API_ROOT}/v1/blogs/blogPost/${id}`,
      payload,
    );
    return res.data;
  },

  deleteBlogPostAPI: async (id: number) => {
    const res = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/blogs/blogPost/${id}`);
    return res.data;
  },

  updateBlogPostStatusAPI: async (id: number, payload: UpdateBlogPostStatusPayload) => {
    const res = await authorizedAxiosInstance.patch(
      `${API_ROOT}/v1/blogs/admin/posts/${id}/status`,
      payload,
    );
    return res.data;
  },

  getBlogCommentsAPI: async (blogId: number): Promise<BlogCommentItem[]> => {
    const res = await authorizedAxiosInstance.get(`${API_ROOT}/v1/blogs/blogComments`, {
      params: { blogId },
    });
    return res.data;
  },

  createBlogCommentAPI: async (payload: CreateBlogCommentPayload) => {
    const res = await authorizedAxiosInstance.post(`${API_ROOT}/v1/blogs/blogComments`, payload);
    return res.data;
  },

  banCommentUserAPI: async (blogId: number, userId: number, reason?: string) => {
    const res = await authorizedAxiosInstance.post(
      `${API_ROOT}/v1/blogs/blogPost/${blogId}/comment-bans`,
      { userId, reason },
    );
    return res.data;
  },

  unbanCommentUserAPI: async (blogId: number, userId: number) => {
    const res = await authorizedAxiosInstance.delete(
      `${API_ROOT}/v1/blogs/blogPost/${blogId}/comment-bans/${userId}`,
    );
    return res.data;
  },
};
