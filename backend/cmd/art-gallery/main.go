package main

import (
	"log"

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

	log.Println("database schema ready")

}
