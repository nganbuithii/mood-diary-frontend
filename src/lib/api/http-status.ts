export const HTTP_STATUS = {
  NETWORK_ERROR: 0,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export function isClientErrorStatus(status: number) {
  return status >= HTTP_STATUS.BAD_REQUEST && status < HTTP_STATUS.INTERNAL_SERVER_ERROR;
}
