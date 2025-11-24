import { getCrudConfig } from '../config';
import type { DataProvider, ListParams, ListResponse, GetOneResponse, CreateParams, UpdateParams, DeleteParams } from '../types';
import { normalizeError } from '../errors';

const encodeQuery = (obj: Record<string, any>) =>
  Object.entries(obj).map(([k,v]) => `${encodeURIComponent(k)}=${encodeURIComponent(typeof v==='object' ? JSON.stringify(v) : v)}`).join('&');

export const createFetchDataProvider = (baseUrlOverride?: string): DataProvider => {
  const cfg = getCrudConfig();
  const baseUrl = baseUrlOverride ?? cfg.baseUrl ?? '';

  const buildHeaders = async (extra?: any) => {
    const auth = await (cfg.getAuthHeaders?.() ?? {});
    const extraHeaders = (extra && extra.headers) || {};
    return { 'Content-Type':'application/json', ...auth, ...extraHeaders };
  };

  const handleRes = async (res: Response) => {
    if (!res.ok) {
      const err = await normalizeError(res);
      cfg.onError?.(err);
      throw err;
    }
    const text = await res.text();
    try { return JSON.parse(text); } catch { return text; }
  };

  return {
    async getList(resource, params, extra) {
      const qobj: Record<string, any> = {};
      if (params?.page) { qobj.page = params.page.page; qobj.perPage = params.page.perPage; }
      if (params?.sort) qobj.sort = params.sort;
      if (params?.filter) qobj.filter = params.filter;
      const q = Object.keys(qobj).length ? `?${encodeQuery(qobj)}` : '';
      const headers = await buildHeaders(extra);
      const res = await fetch(`${baseUrl}/${resource}${q}`, { method: 'GET', headers, ...extra });
      const data = await handleRes(res);
      if (Array.isArray(data)) return { data } as ListResponse<any>;
      return data as ListResponse<any>;
    },

    async getOne(resource, id, extra) {
      const headers = await buildHeaders(extra);
      const res = await fetch(`${baseUrl}/${resource}/${id}`, { method: 'GET', headers, ...extra });
      const data = await handleRes(res);
      return { data } as GetOneResponse<any>;
    },

    async create(resource, params, extra) {
      const headers = await buildHeaders(extra);
      const res = await fetch(`${baseUrl}/${resource}`, {
        method: 'POST', headers, body: JSON.stringify(params?.data ?? {}), ...extra
      });
      const data = await handleRes(res);
      return { data } as GetOneResponse<any>;
    },

    async update(resource, params, extra) {
      const headers = await buildHeaders(extra);
      const res = await fetch(`${baseUrl}/${resource}/${params?.id}`, {
        method: 'PUT', headers, body: JSON.stringify(params?.data ?? {}), ...extra
      });
      const data = await handleRes(res);
      return { data } as GetOneResponse<any>;
    },

    async delete(resource, params, extra) {
      const headers = await buildHeaders(extra);
      const res = await fetch(`${baseUrl}/${resource}/${params?.id}`, { method: 'DELETE', headers, ...extra });
      const data = await handleRes(res);
      return { data } as GetOneResponse<any>;
    }
  };
};
