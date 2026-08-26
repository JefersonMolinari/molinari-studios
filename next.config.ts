import type { NextConfig } from 'next';

const isGitHubPagesBuild = process.env.GITHUB_PAGES === 'true';
const hasCustomDomain = Boolean(process.env.CUSTOM_DOMAIN);
const repositoryName =
  process.env.GITHUB_REPOSITORY?.split('/').at(-1) ?? 'molinari-studios';
const basePath = isGitHubPagesBuild && !hasCustomDomain ? `/${repositoryName}` : '';

const nextConfig: NextConfig = {
  ...(isGitHubPagesBuild
    ? {
        output: 'export' as const,
        basePath,
        trailingSlash: true,
      }
    : {}),
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
