import authorizedAxiosInstance from "../utils/authorizedAxios";
import { API_ROOT } from "../utils/constants";

export const blogApi = {
  getAllBlogPostsAPI: async () => {
    const res = await authorizedAxiosInstance.get(`${API_ROOT}/v1/blogs/blogPost`);
    return res.data;
  },
  getBlogDetailAPI: async (id: string) => {
    const res = await authorizedAxiosInstance.get(`${API_ROOT}/v1/blogs/blogPost/${id}`);
    return res.data;
  }
};
