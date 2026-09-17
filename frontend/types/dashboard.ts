export type Event = {
  id: number;
  name: string;
  start_date?: string;
  end_date?: string;
  ticket_price?: number;
  created_at: string;
  updated_at: string;
};

export type DashboardSummary = {
  total_event_views: number;
  ticket_page_views: number;
  tickets_sold: number;
  sales_conversion: number;
  revenue: number;
};

export type DailyMetric = {
  date: string;
  event_views: number;
  ticket_page_views: number;
  tickets_sold: number;
  revenue: number;
};

export type DashboardData = {
  event: Event;
  summary: DashboardSummary;
  daily_metrics: DailyMetric[];
};