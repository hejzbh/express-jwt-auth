import axios from "axios";
import cookies from "js-cookie";

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_KEY,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (request) => {
    const accessToken = cookies.get("accessToken");
    if (accessToken) {
      request.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response, // Directly return successful responses.
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark the request as retried to avoid infinite loops.

      try {
        // Make a request to your auth server to refresh the token.
        const response = await axios.post(
          process.env.REACT_APP_REFRESH_TOKEN_URL!,
          {},
          { withCredentials: true }
        );
        const { accessToken } = response.data?.data;

        if (!accessToken) throw new Error("Canot generate access token");

        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Handle refresh token errors by clearing stored tokens and redirecting to the login page.
        console.error("Token refresh failed:", refreshError);
        // cookies.remove("accessToken");
        //cookies.remove("refreshToken");
        // window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error); // For all other errors, return the error as is.
  }
);
