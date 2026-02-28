const PUBLIC_URLS = [
  "/auth/login",
  "/auth/logout",
  "/auth/refresh"
];

export const isPublicUrl = (url: string) => {
  return PUBLIC_URLS.some(p => url.endsWith(p));
};
