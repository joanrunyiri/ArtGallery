package event

import "time"

type Event struct {
	ID          int64     `json:"id"`
	Name        string    `json:"name"`
	StartDate   *string   `json:"start_date,omitempty"`
	EndDate     *string   `json:"end_date,omitempty"`
	TicketPrice *float64  `json:"ticket_price,omitempty"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type DailyMetric struct {
	Date            string  `json:"date"`
	EventViews      int     `json:"event_views"`
	TicketPageViews int     `json:"ticket_page_views"`
	TicketsSold     int     `json:"tickets_sold"`
	Revenue         float64 `json:"revenue"`
}
