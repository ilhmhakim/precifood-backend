import { getCookies } from "@/utils/cookie";

const fetchData = async (
  method: string,
  endpoint: string,
  body?: unknown,
  headers: Record<string, string> = {},
) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);

    if (errorData?.errors) {
      throw new Error(errorData.errors);
    } else {
      throw new Error("Network Error");
    }
  }

  return await res.json().then((json) => json.data);
};

const fetchDataAuthenticated = (
  method: string,
  endpoint: string,
  body?: unknown,
) => {
  return fetchData(method, endpoint, body, {
    Authorization: `Bearer ${getCookies("token")}`,
  });
};

export const getData = async (endpoint: string) => {
  return fetchData("GET", endpoint);
};

export const getDataAuthenticated = async (endpoint: string) => {
  return fetchDataAuthenticated("GET", endpoint);
};

export const postData = async (endpoint: string, body?: unknown) => {
  return fetchData("POST", endpoint, body);
};

export const postDataAuthenticated = async (
  endpoint: string,
  body?: unknown,
) => {
  return fetchDataAuthenticated("POST", endpoint, body);
};

export const patchDataAuthenticated = async (
  endpoint: string,
  body?: unknown,
) => {
  return fetchDataAuthenticated("PATCH", endpoint, body);
};

export const putDataAuthenticated = async (
  endpoint: string,
  body?: unknown,
) => {
  return fetchDataAuthenticated("PUT", endpoint, body);
};

export const deleteDataAuthenticated = async (endpoint: string) => {
  return fetchDataAuthenticated("DELETE", endpoint);
};
