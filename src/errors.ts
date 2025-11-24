export type HttpError = {
  status?: number;
  message: string;
  body?: any;
  original?: any;
};

export const normalizeError = async (res: Response | any): Promise<HttpError> => {
  if (res instanceof Response) {
    const text = await res.text().catch(() => '');
    let body = text;
    try { body = JSON.parse(text); } catch {}
    return { status: res.status, message: res.statusText || 'HTTP error', body, original: res };
  }
  if (res && res.status) {
    return { status: res.status, message: res.message || 'Error', body: res.body || null, original: res };
  }
  return { message: (res && res.message) || String(res), original: res };
};
