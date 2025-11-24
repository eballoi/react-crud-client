import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { useCrudConfig } from '../provider/CrudProvider';

export function useUpdate<T>(
  resource: string,
  options?: UseMutationOptions<T, Error, { id: string | number; data: Partial<T> }>
) {
  const config = useCrudConfig();
  const queryClient = useQueryClient();

  const mutationFn = async ({ id, data }: { id: string | number; data: Partial<T> }): Promise<T> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...config.headers,
    };
    const token = config.getAuthToken?.();
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${config.baseUrl}/${resource}/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || 'Failed to update item');
    }

    return res.json();
  };

  return useMutation<T, Error, { id: string | number; data: Partial<T> }>({
    mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [resource] }),
    ...options,
  });
}
