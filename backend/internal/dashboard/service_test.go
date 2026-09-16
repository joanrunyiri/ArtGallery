package dashboard

import (
	"testing"

	"github.com/joanrunyiri/ArtGallery/backend/internal/database"
	"github.com/joanrunyiri/ArtGallery/backend/internal/event"
	"github.com/joanrunyiri/ArtGallery/backend/internal/testutil"
)

func TestGetCalculatesDashboardSummary(t *testing.T) {
	db := testutil.NewTestDB(t)

	if err := database.Seed(db); err != nil {
		t.Fatalf("seed test database: %v", err)
	}

	eventRepository := event.EventRepository(db)
	service := DashboardService(eventRepository)

	result, err := service.Get()
	if err != nil {
		t.Fatalf("get dashboard: %v", err)
	}

	if result.Summary.TotalEventViews != 12450 {
		t.Errorf(
			"expected 12450 event views, got %d",
			result.Summary.TotalEventViews,
		)
	}

	if result.Summary.TicketsSold != 312 {
		t.Errorf(
			"expected 312 tickets sold, got %d",
			result.Summary.TicketsSold,
		)
	}

	if result.Summary.SalesConversion != 12.76 {
		t.Errorf(
			"expected 12.76 sales conversion, got %.2f",
			result.Summary.SalesConversion,
		)
	}

	if result.Summary.Revenue != 15600 {
		t.Errorf(
			"expected 15600 revenue, got %.2f",
			result.Summary.Revenue,
		)
	}

	if len(result.DailyMetrics) != 7 {
		t.Errorf(
			"expected 7 daily metrics, got %d",
			len(result.DailyMetrics),
		)
	}
}
