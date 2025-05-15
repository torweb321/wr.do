// app/api/github/route.ts
import { NextRequest, NextResponse } from "next/server";

import { env } from "@/env.mjs";

interface GitHubResponse {
  stargazers_count: number;
  message?: string;
}

export async function GET(request: NextRequest) {
  // 从 URL 中获取查询参数
  const searchParams = request.nextUrl.searchParams;
  const owner = searchParams.get("owner");
  const repo = searchParams.get("repo");

  // 验证必需的参数
  if (!owner || !repo) {
    return NextResponse.json(
      { error: "Invalid owner or repo parameters" },
      { status: 400 },
    );
  }

  try {
    const { GITHUB_TOKEN } = env;

    // 如果没有 GitHub token，返回默认值而不是抛出错误
    if (!GITHUB_TOKEN) {
      console.warn("GitHub token is not configured, returning default star count");
      return NextResponse.json(
        { stargazers_count: 0 },
        {
          headers: {
            "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
          },
        }
      );
    }

    // 尝试从 GitHub API 获取数据
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          Authorization: `token ${GITHUB_TOKEN}`,
          "User-Agent": "NextJS-App",
        },
        // 添加缓存策略
        next: {
          revalidate: 3600, // 1小时后重新验证
        },
      },
    );

    if (!response.ok) {
      const errorData: GitHubResponse = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`,
      );
    }

    const data: GitHubResponse = await response.json();

    return NextResponse.json(
      { stargazers_count: data.stargazers_count },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      },
    );
  } catch (error) {
    console.error("GitHub API error:", error);
    // 出错时返回默认值
    return NextResponse.json(
      { 
        stargazers_count: 0,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
