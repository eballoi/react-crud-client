export const listKey = (
  resource: string,
  params: Record<string, any> = {}
) => [resource, "getList", JSON.stringify(params)] as const;

export const getOneKey = (resource: string, id: string | number) =>
  [resource, "getOne", id] as const;

export const createKey = (resource: string) => [resource, "create"] as const;
export const updateKey = (resource: string, id: string | number) =>
  [resource, "update", id] as const;
export const deleteKey = (resource: string, id: string | number) =>
  [resource, "delete", id] as const;
