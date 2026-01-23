# 1. 确保目录存在
mkdir -p client/src/shared

# 2. 创建 routes.ts 文件并填充基础内容
cat > client/src/shared/routes.ts << 'EOF'
export const api = {
  seals: '/api/seals',
  stats: '/api/stats',
  health: '/api/health',
  sanctions: '/api/sanctions'
};

export const buildUrl = (endpoint: string) => {
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? window.location.origin 
    : 'http://localhost:5000';
  return `${baseUrl}${endpoint}`;
};
EOF