package main

import (
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/joanrunyiri/ArtGallery/backend/internal/artist"
	"github.com/joanrunyiri/ArtGallery/backend/internal/artwork"
	"github.com/joanrunyiri/ArtGallery/backend/internal/dashboard"
	"github.com/joanrunyiri/ArtGallery/backend/internal/database"
	"github.com/joanrunyiri/ArtGallery/backend/internal/event"
	"github.com/joanrunyiri/ArtGallery/backend/internal/middleware"
)

func main() {
	db, err := database.Open("data/gallery.db")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	if err := database.CreateSchema(db); err != nil {
		log.Fatal(err)
	}
	if err := database.Seed(db); err != nil {
		log.Fatal(err)
	}

	artistRepository := artist.ArtistRepository(db)
	artistService := artist.ArtistService(artistRepository)
	artistHandler := artist.ArtistHandler(artistService)
	artworkRepository := artwork.ArtworkRepository(db)
	artworkService := artwork.ArtworkService(
		artworkRepository,
		artistRepository,
	)
	artworkHandler := artwork.ArtworkHandler(artworkService)
	eventRepository := event.EventRepository(db)
	dashboardService := dashboard.DashboardService(eventRepository)
	dashboardHandler := dashboard.DashboardHandler(dashboardService)

	router := chi.NewRouter()

	router.Use(middleware.Logger)
	router.Use(middleware.CORS)

	//artist routes

	router.Get("/api/artists", artistHandler.List)
	router.Get("/api/artists/{id}", artistHandler.GetByID)
	router.Post("/api/artists", artistHandler.Create)
	router.Put("/api/artists/{id}", artistHandler.Update)
	router.Delete("/api/artists/{id}", artistHandler.Delete)

	//artwork routes
	router.Get("/api/artworks", artworkHandler.List)
	router.Get("/api/artworks/{id}", artworkHandler.GetByID)
	router.Post("/api/artworks", artworkHandler.Create)
	router.Put("/api/artworks/{id}", artworkHandler.Update)
	router.Delete("/api/artworks/{id}", artworkHandler.Delete)

	//event stats
	router.Get("/api/dashboard", dashboardHandler.Get)

	log.Println("server listening on http://localhost:8080")

	if err := http.ListenAndServe(":8080", router); err != nil {
		log.Fatal(err)
	}

}
