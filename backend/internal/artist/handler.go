package artist

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

func ArtistHandler(service *Service) *Handler {
	return &Handler{
		service: service,
	}
}
func (h *Handler) List(w http.ResponseWriter, r *http.Request) {
	artists, err := h.service.List()
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{
			"error": "failed to retrieve artists",
		})
		return
	}

	writeJSON(w, http.StatusOK, artists)
}

func (h *Handler) GetByID(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.ParseInt(chi.URLParam(r, "id"), 10, 64)
	if err != nil || id <= 0 {
		writeJSON(w, http.StatusBadRequest, map[string]string{
			"error": "invalid artist id",
		})
		return
	}

	artist, err := h.service.GetByID(id)
	if err != nil {
		if errors.Is(err, ErrNotFound) {
			writeJSON(w, http.StatusNotFound, map[string]string{
				"error": "artist not found",
			})
			return
		}

		log.Printf("get artist %d: %v", id, err)

		writeJSON(w, http.StatusInternalServerError, map[string]string{
			"error": "failed to retrieve artist",
		})
		return
	}

	writeJSON(w, http.StatusOK, artist)
}

func (h *Handler) Create(w http.ResponseWriter, r *http.Request) {
	var input CreateArtistInput

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{
			"error": "invalid request body",
		})
		return
	}

	artist, err := h.service.Create(input)
	if err != nil {
		if isValidationError(err) {
			writeJSON(w, http.StatusBadRequest, map[string]string{
				"error": err.Error(),
			})
			return
		}

		log.Printf("create artist: %v", err)

		writeJSON(w, http.StatusInternalServerError, map[string]string{
			"error": "failed to create artist",
		})
		return
	}

	writeJSON(w, http.StatusCreated, artist)
}

func (h *Handler) Update(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.ParseInt(chi.URLParam(r, "id"), 10, 64)
	if err != nil || id <= 0 {
		writeJSON(w, http.StatusBadRequest, map[string]string{
			"error": "invalid artist id",
		})
		return
	}

	var input UpdateArtistInput

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{
			"error": "invalid request body",
		})
		return
	}

	artist, err := h.service.Update(id, input)
	if err != nil {
		switch {
		case errors.Is(err, ErrNotFound):
			writeJSON(w, http.StatusNotFound, map[string]string{
				"error": "artist not found",
			})

		case isValidationError(err):
			writeJSON(w, http.StatusBadRequest, map[string]string{
				"error": err.Error(),
			})

		default:
			log.Printf("update artist %d: %v", id, err)

			writeJSON(w, http.StatusInternalServerError, map[string]string{
				"error": "failed to update artist",
			})
		}
		return
	}

	writeJSON(w, http.StatusOK, artist)
}

func (h *Handler) Delete(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.ParseInt(chi.URLParam(r, "id"), 10, 64)
	if err != nil || id <= 0 {
		writeJSON(w, http.StatusBadRequest, map[string]string{
			"error": "invalid artist id",
		})
		return
	}

	if err := h.service.Delete(id); err != nil {
		if errors.Is(err, ErrNotFound) {
			writeJSON(w, http.StatusNotFound, map[string]string{
				"error": "artist not found",
			})
			return
		}

		log.Printf("delete artist %d: %v", id, err)

		writeJSON(w, http.StatusInternalServerError, map[string]string{
			"error": "failed to delete artist",
		})
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func writeJSON(w http.ResponseWriter, status int, data any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)

	if err := json.NewEncoder(w).Encode(data); err != nil {
		log.Printf("encode JSON response: %v", err)
	}
}

func isValidationError(err error) bool {
	return errors.Is(err, ErrFirstNameRequired) ||
		errors.Is(err, ErrLastNameRequired) ||
		errors.Is(err, ErrBiographyTooLong) ||
		errors.Is(err, ErrBibliographyTooLong) ||
		errors.Is(err, ErrInvalidBirthDate) ||
		errors.Is(err, ErrInvalidDeathDate)
}
