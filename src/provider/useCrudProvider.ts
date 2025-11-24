import { useCrudProviderContext } from './CrudProvider';
import type { DataProvider } from '../types';

// Thin wrapper returning promise-based API
export const useCrudProvider = () => {
  const provider = useCrudProviderContext();

  return {
    getList: <T>(resource: string, params?: any, extra?: any) => provider.getList<T>(resource, params, extra),
    getOne: <T>(resource: string, id?: string | number, extra?: any) => {
      if (id === undefined) return Promise.reject(new Error('id is required for getOne'));
      return provider.getOne<T>(resource, id as any, extra);
    },
    create: <T>(resource: string, data?: any, extra?: any) => provider.create<T>(resource, { data }, extra),
    update: <T>(resource: string, id?: string | number, data?: any, extra?: any) => {
      if (id === undefined) return Promise.reject(new Error('id is required for update'));
      return provider.update<T>(resource, { id, data }, extra);
    },
    delete: <T>(resource: string, id?: string | number, extra?: any) => {
      if (id === undefined) return Promise.reject(new Error('id is required for delete'));
      return provider.delete<T>(resource, { id }, extra);
    }
  };
};
