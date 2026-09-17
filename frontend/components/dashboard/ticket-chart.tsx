import type { DailyMetric } from "@/types/dashboard";

type TicketsChartProps = {
  metrics: DailyMetric[];
};

export default function TicketsChart({ metrics }: TicketsChartProps) {
  const maxTickets = Math.max(
    ...metrics.map((metric) => metric.tickets_sold),
    1,
  );

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-950">
            Tickets Sold Over Time
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Daily ticket sales for the current event.
          </p>
        </div>

        <span className="rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-600">
          Weekly
        </span>
      </div>

      <div className="flex h-64 items-end gap-3">
        {metrics.map((metric) => {
          const height = (metric.tickets_sold / maxTickets) * 100;

          const date = new Date(`${metric.date}T00:00:00`);

          const day = date.toLocaleDateString("en-US", {
            weekday: "short",
          });

          return (
            <div
              key={metric.date}
              className="flex h-full flex-1 flex-col items-center justify-end"
            >
              <div className="mb-2 text-xs font-medium text-gray-600">
                {metric.tickets_sold}
              </div>

              <div className="flex h-48 w-full items-end justify-center">
                <div
                  className="w-full max-w-10 rounded-t-md bg-violet-500 transition-all"
                  style={{
                    height: `${height}%`,
                  }}
                  title={`${metric.tickets_sold} tickets`}
                />
              </div>

              <span className="mt-3 text-xs text-gray-500">{day}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
