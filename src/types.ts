export type ID = string | number;

export type ListParams = {
  page?: { page: number; perPage: number };
  sort?: { field: string; order: 'ASC' | 'DESC' };
  filter?: Record<string, any>;
};

export type ListResponse<T> = { data: T[]; total?: number };
export type GetOneResponse<T> = { data: T };

export type CreateParams<T> = { data: T };
export type UpdateParams<T> = { id: ID; data: Partial<T> };
export type DeleteParams = { id: ID };

/**
 * DataProvider interface - every adapter must implement these
 */
export type DataProvider = {
  getList: <T = any>(resource: string, params?: ListParams, extra?: any) => Promise<ListResponse<T>>;
  getOne: <T = any>(resource: string, id: ID, extra?: any) => Promise<GetOneResponse<T>>;
  create: <T = any>(resource: string, params?: CreateParams<T>, extra?: any) => Promise<GetOneResponse<T>>;
  update: <T = any>(resource: string, params?: UpdateParams<T>, extra?: any) => Promise<GetOneResponse<T>>;
  delete: <T = any>(resource: string, params?: DeleteParams, extra?: any) => Promise<GetOneResponse<T>>;
};
  