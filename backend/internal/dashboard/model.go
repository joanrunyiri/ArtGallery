package dashboard

import "github.com/joanrunyiri/ArtGallery/backend/internal/event"

type Summary struct {
	TotalEventViews int     `json:"total_event_views"`
	TicketPageViews int     `json:"ticket_page_views"`
	TicketsSold     int     `json:"tickets_sold"`
	SalesConversion float64 `json:"sales_conversion"`
	Revenue         float64 `json:"revenue"`
}

type Dashboard struct {
	Event        event.Event         `json:"event"`
	Summary      Summary             `json:"summary"`
	DailyMetrics []event.DailyMetric `json:"daily_metrics"`
}
