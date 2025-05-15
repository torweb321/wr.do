// components/GitHubStarsWrapper.tsx
import { Suspense } from "react";

import { Skeleton } from "../ui/skeleton";
import { ErrorBoundary } from "./error-boundary";
import GitHubStarsButton from "./github-star-button";

interface GitHubResponse {
  stargazers_count: number;
}

async function getGitHubStars(owner: string, repo: string) {
  const githubToken = process.env.GITHUB_TOKEN;

  if (!githubToken) {
    // 如果没有 GitHub token，返回默认值而不是抛出错误
    console.warn("GitHub token is not configured, using default star count");
    return 0; // 返回默认的星标数量
  }

  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `token ${githubToken}`,
        "User-Agent": "NextJS-App",
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.warn("Failed to fetch GitHub stars, using default star count");
      return 0;
    }

    const data: GitHubResponse = await res.json();
    return data.stargazers_count;
  } catch (error) {
    console.error("Error fetching GitHub stars:", error);
    return 0; // 出错时返回默认值
  }
}

interface Props {
  owner: string;
  repo: string;
  className?: string;
}

async function GitHubStarsWrapper({ owner, repo, className }: Props) {
  const stars = await getGitHubStars(owner, repo);

  return (
    <GitHubStarsButton
      owner={owner}
      repo={repo}
      className={className}
      initialStars={stars}
    />
  );
}

// 导出一个包装了 Suspense 的组件
export default function GitHubStarsWithSuspense(props: Props) {
  return (
    <ErrorBoundary fallback={<Skeleton className="h-4 w-12 rounded-lg" />}>
      <Suspense fallback={<Skeleton className="h-4 w-12 rounded-lg" />}>
        <GitHubStarsWrapper {...props} />
      </Suspense>
    </ErrorBoundary>
  );
}
