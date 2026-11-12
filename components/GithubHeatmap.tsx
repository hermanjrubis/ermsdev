"use client";

import { useState } from "react";
import ActivityHeatmap, { type ActivityDay } from "@/components/ui/activity-heatmap";

type GithubHeatmapProps = { days: ActivityDay[]; user: string };

const dayFormat = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

/** The heatmap plus a link to that day's activity on GitHub once a day is picked. */
export function GithubHeatmap({ days, user }: GithubHeatmapProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const picked = selected ? days.find((d) => d.date === selected) : undefined;

  return (
    <div>
      <ActivityHeatmap
        days={days}
        label={`GitHub contributions by @${user} in the last year`}
        period="the last year"
        selectedDate={selected}
        onSelectDate={(date) => setSelected((current) => (current === date ? null : date))}
      />
      <p className="mt-4 min-h-11 text-sm text-muted" aria-live="polite">
        {picked ? (
          <>
            {dayFormat.format(new Date(`${picked.date}T00:00:00Z`))}:{" "}
            {picked.count === 0 ? "a day off." : `${picked.count} contribution${picked.count === 1 ? "" : "s"}. `}
            {picked.count > 0 ? (
              <a
                href={`https://github.com/${user}?tab=overview&from=${picked.date}&to=${picked.date}`}
                className="text-link font-medium text-ink"
              >
                See what I worked on
              </a>
            ) : null}
          </>
        ) : (
          "Click a day to see what I pushed. Arrow keys work too."
        )}
      </p>
    </div>
  );
}
