import { useCrudProviderContext } from "../provider/CrudProvider";

export const useFetchClient = <T = any>() => {
  const { config } = useCrudProviderContext();

  const fetcher = async (path: string, init?: RequestInit): Promise<T> => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(config.headers ?? {}),
    };

    if (init?.headers) {
      if (init.headers instanceof Headers) {
        init.headers.forEach((value, key) => (headers[key] = value));
      } else if (Array.isArray(init.headers)) {
        init.headers.forEach(([key, value]) => (headers[key] = value));
      } else {
        Object.assign(headers, init.headers);
      }
    }

    const token = config.getAuthToken?.();
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${config.baseUrl}/${path}`, { ...init, headers });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Network response was not ok");
    }

    return res.json() as Promise<T>;
  };

  return fetcher;
};
