export interface CrudProviderConfig {
  baseUrl: string;
  getAuthToken?: () => string | null;
  headers?: Record<string, string>;
}
