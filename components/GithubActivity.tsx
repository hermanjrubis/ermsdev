import { cacheLife } from "next/cache";
import type { ActivityDay } from "@/components/ui/activity-heatmap";
import { GithubHeatmap } from "@/components/GithubHeatmap";
import { site } from "@/content/site";

type ApiResponse = { contributions?: { date: string; count: number }[] };

/**
 * Last year of public contributions, from github-contributions-api.jogruber.de
 * (no token needed). Cached for an hour, so the page stays static and fast.
 */
async function getContributions(user: string): Promise<ActivityDay[] | null> {
  "use cache";
  cacheLife("hours");
  try {
    const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${user}?y=last`);
    if (!res.ok) return null;
    const json = (await res.json()) as ApiResponse;
    if (!json.contributions?.length) return null;
    return json.contributions.map(({ date, count }) => ({ date, count }));
  } catch {
    return null;
  }
}

export async function GithubActivity() {
  const days = await getContributions(site.github);

  if (!days) {
    return (
      <p className="text-muted">
        Couldn&apos;t load the activity map right now.{" "}
        <a href={`https://github.com/${site.github}`} className="text-link">
          See it on GitHub
        </a>
        .
      </p>
    );
  }

  return <GithubHeatmap days={days} user={site.github} />;
}
