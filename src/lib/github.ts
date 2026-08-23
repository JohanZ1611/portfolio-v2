export interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  topics: string[];
}

export async function fetchPublicRepos(username: string): Promise<GithubRepo[]> {
  const res = await fetch(
    `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
    { headers: { Accept: "application/vnd.github+json" } },
  );
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  return res.json();
}
