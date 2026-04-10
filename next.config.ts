import type { NextConfig } from "next";

const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1];
const isGitHubPagesBuild = process.env.GITHUB_ACTIONS === "true" && Boolean(repoName);

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: isGitHubPagesBuild && repoName ? `/${repoName}` : "",
  assetPrefix: isGitHubPagesBuild && repoName ? `/${repoName}/` : undefined,
};

export default nextConfig;
