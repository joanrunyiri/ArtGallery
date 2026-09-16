package dashboard

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"

	"github.com/joanrunyiri/ArtGallery/backend/internal/event"
)

type Handler struct {
	service *Service
}

func DashboardHandler(service *Service) *Handler {
	return &Handler{
		service: service,
	}
}

func (h *Handler) Get(w http.ResponseWriter, r *http.Request) {
	data, err := h.service.Get()
	if err != nil {
		if errors.Is(err, event.ErrNotFound) {
			writeJSON(w, http.StatusNotFound, map[string]string{
				"error": "event not found",
			})
			return
		}

		log.Printf("get dashboard: %v", err)

		writeJSON(w, http.StatusInternalServerError, map[string]string{
			"error": "failed to retrieve dashboard",
		})
		return
	}

	writeJSON(w, http.StatusOK, data)
}

func writeJSON(w http.ResponseWriter, status int, data any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)

	if err := json.NewEncoder(w).Encode(data); err != nil {
		log.Printf("encode JSON response: %v", err)
	}
}
