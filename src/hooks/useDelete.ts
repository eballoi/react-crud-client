import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { useCrudConfig } from '../provider/CrudProvider';

export function useDelete<T>(
  resource: string,
  options?: UseMutationOptions<void, Error, string | number>
) {
  const config = useCrudConfig();
  const queryClient = useQueryClient();

  const mutationFn = async (id: string | number): Promise<void> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...config.headers,
    };
    const token = config.getAuthToken?.();
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${config.baseUrl}/${resource}/${id}`, {
      method: 'DELETE',
      headers,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || 'Failed to delete item');
    }
  };

  return useMutation<void, Error, string | number>({
    mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [resource] }),
    ...options,
  });
}
