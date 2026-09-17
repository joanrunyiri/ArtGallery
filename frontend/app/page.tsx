import TicketsChart from "@/components/dashboard/ticket-chart";
import MetricCard from "@/components/dashboard/metric-card";
import RecentArtworks from "@/components/dashboard/recent-artwork";

import { getArtworks, getDashboard } from "@/lib/api";

export default async function DashboardPage() {
  const [dashboard, artworks] = await Promise.all([
    getDashboard(),
    getArtworks(),
  ]);

  const { event, summary, daily_metrics } = dashboard;

  return (
    <div className="mx-auto max-w-[1600px]">
      {/* Welcome */}
      <header className="mb-10">
        <h1 className="font-serif text-3xl font-medium tracking-tight text-gray-950">
          Welcome to Art Circles Pro 👋
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Here&apos;s how{" "}
          <span className="font-medium text-gray-700">{event.name}</span> is
          performing.
        </p>
      </header>

      {/* Performance */}
      <section>
        <div className="mb-5">
          <h2 className="font-serif text-lg font-medium text-gray-950">
            Event Performance Summary
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Performance across the current event.
          </p>
        </div>

        <div className="grid grid-cols-1 border-y border-gray-200 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Event Views"
            value={summary.total_event_views.toLocaleString()}
            helper="Total event page views"
          />

          <MetricCard
            label="Tickets Sold"
            value={summary.tickets_sold.toLocaleString()}
            helper={`${summary.ticket_page_views.toLocaleString()} ticket page views`}
          />

          <MetricCard
            label="Sales Conversion"
            value={`${summary.sales_conversion.toFixed(2)}%`}
            helper="Ticket purchases from views"
          />

          <MetricCard
            label="Revenue"
            value={`$${summary.revenue.toLocaleString()}`}
            helper="Total ticket revenue"
          />
        </div>
      </section>

      {/* Analytics */}
      <div className="mt-10 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(300px,0.8fr)]">
        <TicketsChart metrics={daily_metrics} />
        <RecentArtworks artworks={artworks} />
      </div>
    </div>
  );
}
