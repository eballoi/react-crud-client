import { createContext, useContext } from 'react';

export interface CrudConfig {
  baseUrl: string;
  getAuthToken?: () => string | null;
  headers?: Record<string, string>;
}

const CrudContext = createContext<CrudConfig | null>(null);

export const CrudProvider = ({ config, children }: { config: CrudConfig; children: React.ReactNode }) => (
  <CrudContext.Provider value={config}>{children}</CrudContext.Provider>
);

export const useCrudConfig = () => {
  const context = useContext(CrudContext);
  if (!context) throw new Error('useCrudConfig must be used within a CrudProvider');
  return context;
};
