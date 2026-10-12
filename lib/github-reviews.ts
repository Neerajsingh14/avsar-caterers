import type { Review } from "./reviews";

const FILE = "data/reviews.json";

export function githubConfig() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return null;
  const repo = process.env.GITHUB_REPO || "Neerajsingh14/avsar-caterers";
  const branch = process.env.GITHUB_BRANCH || "main";
  return {
    api: "https://api.github.com/repos/" + repo + "/contents/" + FILE,
    branch,
    headers: {
      Authorization: "Bearer " + token,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "avsar-caterers-site",
    } as Record<string, string>,
  };
}

// Used by the website: cached for 60 seconds (and refreshed instantly after a new review)
export async function readRemoteReviews(): Promise<Review[] | null> {
  const cfg = githubConfig();
  if (!cfg) return null;
  try {
    const res = await fetch(cfg.api + "?ref=" + cfg.branch, { headers: cfg.headers, next: { revalidate: 60 } });
    if (!res.ok) return null;
    const j = await res.json();
    const parsed = JSON.parse(Buffer.from(j.content, "base64").toString("utf8"));
    return Array.isArray(parsed) ? (parsed as Review[]) : null;
  } catch {
    return null;
  }
}

// Read the latest file, change it, write it back as a commit.
// mutate returns the new list, or null if nothing should change.
export async function updateReviews(
  mutate: (list: Review[]) => Review[] | null,
  message: string
): Promise<"ok" | "unchanged"> {
  const cfg = githubConfig();
  if (!cfg) throw new Error("GITHUB_TOKEN is missing");

  for (let attempt = 0; attempt < 3; attempt++) {
    const get = await fetch(cfg.api + "?ref=" + cfg.branch, { headers: cfg.headers, cache: "no-store" });
    let list: Review[] = [];
    let sha: string | undefined;

    if (get.status === 200) {
      const j = await get.json();
      sha = j.sha;
      list = JSON.parse(Buffer.from(j.content, "base64").toString("utf8"));
    } else if (get.status !== 404) {
      throw new Error("GitHub read failed: " + get.status);
    }

    const next = mutate(list);
    if (!next) return "unchanged";

    const put = await fetch(cfg.api, {
      method: "PUT",
      headers: { ...cfg.headers, "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        content: Buffer.from(JSON.stringify(next, null, 2) + "\n", "utf8").toString("base64"),
        sha,
        branch: cfg.branch,
      }),
    });
    if (put.ok) return "ok";
    if (put.status !== 409 && put.status !== 422) throw new Error("GitHub write failed: " + put.status);
  }
  throw new Error("GitHub write conflict, please try again");
}