package dashboard

import (
	"math"

	"github.com/joanrunyiri/ArtGallery/backend/internal/event"
)

type Service struct {
	eventRepository *event.Repository
}

func DashboardService(eventRepository *event.Repository) *Service {
	return &Service{
		eventRepository: eventRepository,
	}
}

func (s *Service) Get() (*Dashboard, error) {
	currentEvent, err := s.eventRepository.GetLatest()
	if err != nil {
		return nil, err
	}

	metrics, err := s.eventRepository.GetDailyMetrics(currentEvent.ID)
	if err != nil {
		return nil, err
	}

	var summary Summary

	for _, metric := range metrics {
		summary.TotalEventViews += metric.EventViews
		summary.TicketPageViews += metric.TicketPageViews
		summary.TicketsSold += metric.TicketsSold
		summary.Revenue += metric.Revenue
	}

	if summary.TicketPageViews > 0 {
		conversion := float64(summary.TicketsSold) /
			float64(summary.TicketPageViews) * 100

		summary.SalesConversion = math.Round(conversion*100) / 100
	}

	return &Dashboard{
		Event:        *currentEvent,
		Summary:      summary,
		DailyMetrics: metrics,
	}, nil
}
