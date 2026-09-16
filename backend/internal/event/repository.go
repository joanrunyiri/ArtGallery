package event

import (
	"database/sql"
	"errors"
	"fmt"
)

var ErrNotFound = errors.New("event not found")

type Repository struct {
	db *sql.DB
}

func EventRepository(db *sql.DB) *Repository {
	return &Repository{db: db}
}

func (r *Repository) GetLatest() (*Event, error) {
	var event Event

	err := r.db.QueryRow(`
		SELECT
			id,
			name,
			start_date,
			end_date,
			ticket_price,
			created_at,
			updated_at
		FROM events
		ORDER BY created_at DESC, id DESC
		LIMIT 1
	`).Scan(
		&event.ID,
		&event.Name,
		&event.StartDate,
		&event.EndDate,
		&event.TicketPrice,
		&event.CreatedAt,
		&event.UpdatedAt,
	)

	if errors.Is(err, sql.ErrNoRows) {
		return nil, ErrNotFound
	}

	if err != nil {
		return nil, fmt.Errorf("get latest event: %w", err)
	}

	return &event, nil
}
func (r *Repository) GetDailyMetrics(eventID int64) ([]DailyMetric, error) {
	rows, err := r.db.Query(`
		SELECT
			metric_date,
			event_views,
			ticket_page_views,
			tickets_sold,
			revenue
		FROM event_daily_metrics
		WHERE event_id = ?
		ORDER BY metric_date ASC
	`, eventID)
	if err != nil {
		return nil, fmt.Errorf("get daily event metrics: %w", err)
	}
	defer rows.Close()

	metrics := make([]DailyMetric, 0)

	for rows.Next() {
		var metric DailyMetric

		if err := rows.Scan(
			&metric.Date,
			&metric.EventViews,
			&metric.TicketPageViews,
			&metric.TicketsSold,
			&metric.Revenue,
		); err != nil {
			return nil, fmt.Errorf("scan daily event metric: %w", err)
		}

		metrics = append(metrics, metric)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("iterate daily event metrics: %w", err)
	}

	return metrics, nil
}
