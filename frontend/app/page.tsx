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
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-950">
          Welcome to Art Circles Pro 👋
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Here&apos;s how {event.name} is performing.
        </p>
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-6">
        <div className="mb-6">
          <h2 className="text-base font-semibold text-gray-950">
            Event Performance Summary
          </h2>
          <div className="mt-6">
            <TicketsChart metrics={daily_metrics} />
            <RecentArtworks artworks={artworks} />
          </div>

          <p className="mt-1 text-sm text-gray-500">
            Performance across the current event.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
            helper="Ticket purchases from ticket page views"
          />

          <MetricCard
            label="Revenue"
            value={`$${summary.revenue.toLocaleString()}`}
            helper="Total ticket revenue"
          />
        </div>
      </section>
    </div>
  );
}
