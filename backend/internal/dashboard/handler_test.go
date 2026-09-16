package dashboard

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/joanrunyiri/ArtGallery/backend/internal/database"
	"github.com/joanrunyiri/ArtGallery/backend/internal/event"
	"github.com/joanrunyiri/ArtGallery/backend/internal/testutil"
)

func TestGetHandlerReturnsDashboard(t *testing.T) {
	db := testutil.NewTestDB(t)

	if err := database.Seed(db); err != nil {
		t.Fatalf("seed test database: %v", err)
	}

	eventRepository := event.EventRepository(db)
	service := DashboardService(eventRepository)
	handler := DashboardHandler(service)

	request := httptest.NewRequest(
		http.MethodGet,
		"/api/dashboard",
		nil,
	)

	response := httptest.NewRecorder()

	handler.Get(response, request)

	if response.Code != http.StatusOK {
		t.Fatalf(
			"expected status %d, got %d",
			http.StatusOK,
			response.Code,
		)
	}

	var result Dashboard

	if err := json.NewDecoder(response.Body).Decode(&result); err != nil {
		t.Fatalf("decode response: %v", err)
	}

	if result.Event.Name != "Whispers of the Forgotten" {
		t.Errorf(
			"expected event name Whispers of the Forgotten, got %s",
			result.Event.Name,
		)
	}

	if result.Summary.TicketsSold != 312 {
		t.Errorf(
			"expected 312 tickets sold, got %d",
			result.Summary.TicketsSold,
		)
	}

	if len(result.DailyMetrics) != 7 {
		t.Errorf(
			"expected 7 daily metrics, got %d",
			len(result.DailyMetrics),
		)
	}
}
