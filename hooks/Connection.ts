import axios, { Method } from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

class ConnectionClass {
  async request(
    method: Method,
    path: string,
    body?: any,
    headers?: Record<string, string>,
  ) {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    try {
      const res = await axios({
        method,
        url: `${BASE_URL}${path}`,
        data: body,
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
          ...headers,
        },
      });
      return res.data;
    } catch (err: any) {
      console.error("API Error:", err.response || err.message);
      throw err.response?.data || err.message;
    }
  }

  get(path: string, body?: any, headers?: Record<string, string>) {
    return this.request("GET", path, body, headers);
  }

  post(path: string, body?: any, headers?: Record<string, string>) {
    return this.request("POST", path, body, headers);
  }

  patch(path: string, body?: any, headers?: Record<string, string>) {
    return this.request("PATCH", path, body, headers);
  }

  put(path: string, body?: any, headers?: Record<string, string>) {
    return this.request("PUT", path, body, headers);
  }

  delete(path: string, body?: any, headers?: Record<string, string>) {
    return this.request("DELETE", path, body, headers);
  }
}

export function Connection() {
  return new ConnectionClass();
}
