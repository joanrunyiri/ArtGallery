import type { DailyMetric } from "@/types/dashboard";

type TicketsChartProps = {
  metrics: DailyMetric[];
};

export default function TicketsChart({ metrics }: TicketsChartProps) {
  const maxTickets = Math.max(
    ...metrics.map((metric) => metric.tickets_sold),
    1,
  );

  const totalTickets = metrics.reduce(
    (total, metric) => total + metric.tickets_sold,
    0,
  );

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h2 className="font-serif text-lg font-medium text-gray-950">
            Tickets Sold Over Time
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Daily ticket sales for the current event.
          </p>
        </div>

        <span className="rounded-md border border-gray-200 px-3 py-1.5 text-xs text-gray-500">
          Weekly
        </span>
      </div>

      <div className="mb-7">
        <p className="text-xs text-gray-400">Total tickets sold</p>

        <p className="mt-1 text-2xl font-medium tracking-tight text-gray-950">
          {totalTickets.toLocaleString()}
        </p>
      </div>

      <div className="flex h-64 items-end gap-4">
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
              <span className="mb-2 text-[11px] font-medium text-gray-500">
                {metric.tickets_sold}
              </span>

              <div className="relative h-44 w-full border-b border-gray-100">
                <div
                  className="absolute bottom-0 left-1/2 w-full max-w-8 -translate-x-1/2 rounded-t-sm bg-violet-400 transition-all"
                  style={{
                    height: `${height}%`,
                  }}
                  title={`${metric.tickets_sold} tickets`}
                />
              </div>

              <span className="mt-3 text-xs text-gray-400">{day}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
