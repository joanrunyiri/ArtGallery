package artwork

import (
	"errors"
	"testing"

	"github.com/joanrunyiri/ArtGallery/backend/internal/artist"
	"github.com/joanrunyiri/ArtGallery/backend/internal/testutil"
)

func TestCreateRejectsUnknownArtist(t *testing.T) {
	db := testutil.NewTestDB(t)

	artistRepository := artist.ArtistRepository(db)
	artworkRepository := ArtworkRepository(db)

	service := ArtworkService(
		artworkRepository,
		artistRepository,
	)

	unknownArtistID := int64(999)

	_, err := service.Create(CreateArtworkInput{
		ArtistID:    &unknownArtistID,
		Title:       "Whispers of Memory",
		PricingType: "Fixed Price",
	})

	if !errors.Is(err, ErrArtistNotFound) {
		t.Fatalf(
			"expected ErrArtistNotFound, got %v",
			err,
		)
	}
}

func TestCreateRejectsNegativePrice(t *testing.T) {
	db := testutil.NewTestDB(t)

	artistRepository := artist.ArtistRepository(db)
	artworkRepository := ArtworkRepository(db)

	service := ArtworkService(
		artworkRepository,
		artistRepository,
	)

	price := -100.0

	_, err := service.Create(CreateArtworkInput{
		Title:       "Fragments",
		PricingType: "Fixed Price",
		Price:       &price,
	})

	if !errors.Is(err, ErrInvalidPrice) {
		t.Fatalf(
			"expected ErrInvalidPrice, got %v",
			err,
		)
	}
}
