import type { DataProvider } from './types';

export type CrudConfig = {
  baseUrl?: string;
  // runtime headers getter, e.g. reads token from storage; can be async
  getAuthHeaders?: () => Record<string, string> | Promise<Record<string,string>>;
  onError?: (err: unknown) => void;
  // default react-query options per operation
  reactQueryDefaults?: {
    list?: Partial<any>;
    getOne?: Partial<any>;
    create?: Partial<any>;
    update?: Partial<any>;
    delete?: Partial<any>;
  };
  // optional global dataProvider (if set you may still override per provider)
  dataProvider?: DataProvider;
};

let cfg: CrudConfig = {
  baseUrl: '',
  getAuthHeaders: async () => ({}),
  onError: undefined,
  reactQueryDefaults: {},
  dataProvider: undefined,
};

export const setCrudConfig = (partial: Partial<CrudConfig>) => { cfg = { ...cfg, ...partial }; };
export const getCrudConfig = () => cfg;
