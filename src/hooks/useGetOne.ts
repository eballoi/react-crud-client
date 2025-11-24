import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useCrudConfig } from '../provider/CrudProvider';

export function useGetOne<T>(
  resource: string,
  id?: string | number,
  options?: UseQueryOptions<T, Error>
) {
  const config = useCrudConfig();
  const queryKey = [resource, 'getOne', id] as const;

  const queryFn = async (): Promise<T> => {
    if (!id) throw new Error('ID is required for useGetOne');

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...config.headers,
    };

    const token = config.getAuthToken?.();
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${config.baseUrl}/${resource}/${id}`, { headers });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || 'Failed to fetch item');
    }

    return res.json();
  };

  return useQuery<T, Error>({
    queryKey,
    queryFn,
    enabled: !!id,
    ...options,
  });
}
