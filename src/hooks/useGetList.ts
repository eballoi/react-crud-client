import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useCrudConfig } from '../provider/CrudProvider';
import type { ListParams, ListResponse } from '../types';

export function useGetList<T>(
  resource: string,
  params?: ListParams,
  options?: UseQueryOptions<ListResponse<T>, Error>
) {
  const config = useCrudConfig();

  const queryKey = [resource, 'list', params ?? {}] as const;

  const queryFn = async (): Promise<ListResponse<T>> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...config.headers,
    };

    const token = config.getAuthToken?.();
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    const res = await fetch(`${config.baseUrl}/${resource}${query}`, { headers });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || 'Failed to fetch list');
    }

    return res.json();
  };

  return useQuery<ListResponse<T>, Error>({
    queryKey,
    queryFn,
    ...options,
  });
}
