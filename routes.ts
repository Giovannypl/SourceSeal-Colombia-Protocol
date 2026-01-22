// client/src/shared/routes.ts
export const api = {
  seals: '/api/seals',
  stats: '/api/stats',
  health: '/api/health'
};

export const buildUrl = (endpoint: string) => {
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? window.location.origin 
    : 'http://localhost:3000'; // 与后端端口一致
  return `${baseUrl}${endpoint}`;
};