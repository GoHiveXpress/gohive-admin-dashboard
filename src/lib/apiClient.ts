// src/lib/apiCLient.ts

import axiosInstance from "@/lib/axiosInstance";
import handleApiError from "@/utils/handleApiError";

type AnyObject = Record<string, unknown>;

export const apiClient = {
  async get<T>(url: string, defaultErrorMessage: string, config?: AnyObject): Promise<T> {
    try {
      const { data } = await axiosInstance.get<T>(url, config);
      return data;
    } catch (err) {
      handleApiError(err, defaultErrorMessage);
      throw err; // always throw so caller doesn’t get undefined
    }
  },

  async post<T, B = unknown>(
    url: string,
    body: B,
    defaultErrorMessage: string,
    config?: AnyObject,
  ): Promise<T> {
    try {
      const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
      const { data } = await axiosInstance.post<T>(url, body, {
        ...(config || {}),
        headers: {
          ...(config?.headers || {}),
          ...(isFormData ? { "Content-Type": "multipart/form-data" } : {}),
        },
      });
      return data;
    } catch (err) {
      handleApiError(err, defaultErrorMessage);
      throw err;
    }
  },
  

  async put<T, B = unknown>(
    url: string,
    body: B,
    defaultErrorMessage: string,
    config?: AnyObject,
  ): Promise<T> {
    try {
      const { data } = await axiosInstance.put<T>(url, body, config);
      return data;
    } catch (err) {
      handleApiError(err, defaultErrorMessage);
      throw err;
    }
  },

  async patch<T, B = unknown>(
    url: string,
    body: B,
    defaultErrorMessage: string,
    config?: AnyObject,
  ): Promise<T> {
    try {
      const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  
      const { data } = await axiosInstance.patch<T>(url, body, {
        ...(config || {}),
        headers: {
          ...(config?.headers || {}),
          ...(isFormData ? { "Content-Type": "multipart/form-data" } : {}),
        },
      });
      return data;
    } catch (err) {
      handleApiError(err, defaultErrorMessage);
      throw err;
    }
  },
  

  async delete<T>(url: string, defaultErrorMessage: string, config?: AnyObject): Promise<T> {
    try {
      const { data } = await axiosInstance.delete<T>(url, config);
      return data;
    } catch (err) {
      handleApiError(err, defaultErrorMessage);
      throw err;
    }
  },
};
