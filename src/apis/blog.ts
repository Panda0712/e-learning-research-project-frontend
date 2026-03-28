import authorizedAxiosInstance from "../utils/authorizedAxios";
import type {
  AdminBlogListQuery,
  BlogPostsPaginatedResponse,
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
  }: AdminBlogListQuery): Promise<BlogPostsPaginatedResponse> => {
    const res = await authorizedAxiosInstance.get(`${API_ROOT}/v1/blogs/blogPost`, {
      params: { page, itemsPerPage },
    });
    return res.data;
  },

  getBlogDetailAPI: async (id: string) => {
    const res = await authorizedAxiosInstance.get(`${API_ROOT}/v1/blogs/blogPost/${id}`);
    return res.data;
  },

  getAllBlogCategoriesAPI: async () => {
    const res = await authorizedAxiosInstance.get(`${API_ROOT}/v1/blogs/categories`);
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
};
