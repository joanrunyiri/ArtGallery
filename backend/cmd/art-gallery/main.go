package main

import (
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/joanrunyiri/ArtGallery/backend/internal/artist"
	"github.com/joanrunyiri/ArtGallery/backend/internal/database"
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

	router := chi.NewRouter()

	router.Get("/api/artists", artistHandler.List)
	router.Get("/api/artists/{id}", artistHandler.GetByID)
	router.Post("/api/artists", artistHandler.Create)
	router.Put("/api/artists/{id}", artistHandler.Update)
	router.Delete("/api/artists/{id}", artistHandler.Delete)

	log.Println("server listening on http://localhost:8080")

	if err := http.ListenAndServe(":8080", router); err != nil {
		log.Fatal(err)
	}

}
