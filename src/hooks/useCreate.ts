import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { useCrudConfig } from '../provider/CrudProvider';

type CreateFn<T> = (data: Partial<T>) => Promise<T>;

export function useCreate<T>(
  resource: string,
  options?: UseMutationOptions<T, Error, Partial<T>>
) {
  const queryClient = useQueryClient();
  const config = useCrudConfig();

  const mutationFn: CreateFn<T> = async (data) => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...config.headers,
    };

    const token = config.getAuthToken?.();
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${config.baseUrl}/${resource}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || 'Failed to create');
    }

    return res.json() as Promise<T>;
  };

  return useMutation<T, Error, Partial<T>>({
    mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [resource] }),
    ...options,
  });
}
