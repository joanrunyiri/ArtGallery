package artwork

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
)

type Handler struct {
	service *Service
}

func ArtworkHandler(service *Service) *Handler {
	return &Handler{
		service: service,
	}
}

func (h *Handler) List(w http.ResponseWriter, r *http.Request) {
	artworks, err := h.service.List()
	if err != nil {
		log.Printf("list artworks: %v", err)

		writeJSON(w, http.StatusInternalServerError, map[string]string{
			"error": "failed to retrieve artworks",
		})
		return
	}

	writeJSON(w, http.StatusOK, artworks)
}

func (h *Handler) GetByID(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.ParseInt(chi.URLParam(r, "id"), 10, 64)
	if err != nil || id <= 0 {
		writeJSON(w, http.StatusBadRequest, map[string]string{
			"error": "invalid artwork id",
		})
		return
	}

	artwork, err := h.service.GetByID(id)
	if err != nil {
		if errors.Is(err, ErrNotFound) {
			writeJSON(w, http.StatusNotFound, map[string]string{
				"error": "artwork not found",
			})
			return
		}

		log.Printf("get artwork %d: %v", id, err)

		writeJSON(w, http.StatusInternalServerError, map[string]string{
			"error": "failed to retrieve artwork",
		})
		return
	}

	writeJSON(w, http.StatusOK, artwork)
}

func (h *Handler) Create(w http.ResponseWriter, r *http.Request) {
	var input CreateArtworkInput

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{
			"error": "invalid request body",
		})
		return
	}

	artwork, err := h.service.Create(input)
	if err != nil {
		if isValidationError(err) {
			writeJSON(w, http.StatusBadRequest, map[string]string{
				"error": err.Error(),
			})
			return
		}

		log.Printf("create artwork: %v", err)

		writeJSON(w, http.StatusInternalServerError, map[string]string{
			"error": "failed to create artwork",
		})
		return
	}

	writeJSON(w, http.StatusCreated, artwork)
}

func (h *Handler) Update(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.ParseInt(chi.URLParam(r, "id"), 10, 64)
	if err != nil || id <= 0 {
		writeJSON(w, http.StatusBadRequest, map[string]string{
			"error": "invalid artwork id",
		})
		return
	}

	var input UpdateArtworkInput

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{
			"error": "invalid request body",
		})
		return
	}

	artwork, err := h.service.Update(id, input)
	if err != nil {
		switch {
		case errors.Is(err, ErrNotFound):
			writeJSON(w, http.StatusNotFound, map[string]string{
				"error": "artwork not found",
			})

		case isValidationError(err):
			writeJSON(w, http.StatusBadRequest, map[string]string{
				"error": err.Error(),
			})

		default:
			log.Printf("update artwork %d: %v", id, err)

			writeJSON(w, http.StatusInternalServerError, map[string]string{
				"error": "failed to update artwork",
			})
		}
		return
	}

	writeJSON(w, http.StatusOK, artwork)
}

func (h *Handler) Delete(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.ParseInt(chi.URLParam(r, "id"), 10, 64)
	if err != nil || id <= 0 {
		writeJSON(w, http.StatusBadRequest, map[string]string{
			"error": "invalid artwork id",
		})
		return
	}

	if err := h.service.Delete(id); err != nil {
		if errors.Is(err, ErrNotFound) {
			writeJSON(w, http.StatusNotFound, map[string]string{
				"error": "artwork not found",
			})
			return
		}

		log.Printf("delete artwork %d: %v", id, err)

		writeJSON(w, http.StatusInternalServerError, map[string]string{
			"error": "failed to delete artwork",
		})
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func isValidationError(err error) bool {
	return errors.Is(err, ErrTitleRequired) ||
		errors.Is(err, ErrPricingTypeRequired) ||
		errors.Is(err, ErrInvalidPrice) ||
		errors.Is(err, ErrInvalidDimensions) ||
		errors.Is(err, ErrInvalidEditionSize) ||
		errors.Is(err, ErrInvalidReleaseDate) ||
		errors.Is(err, ErrArtistNotFound)
}

func writeJSON(w http.ResponseWriter, status int, data any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)

	if err := json.NewEncoder(w).Encode(data); err != nil {
		log.Printf("encode JSON response: %v", err)
	}
}
