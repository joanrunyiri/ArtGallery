package artist

import (
	"errors"
	"testing"

	"github.com/joanrunyiri/ArtGallery/backend/internal/testutil"
)

func TestCreateRejectsMissingFirstName(t *testing.T) {
	db := testutil.NewTestDB(t)

	repository := ArtistRepository(db)
	service := ArtistService(repository)

	_, err := service.Create(CreateArtistInput{
		LastName: "Appiah",
	})

	if !errors.Is(err, ErrFirstNameRequired) {
		t.Fatalf(
			"expected ErrFirstNameRequired, got %v",
			err,
		)
	}
}
func TestCreateArtist(t *testing.T) {
	db := testutil.NewTestDB(t)

	repository := ArtistRepository(db)
	service := ArtistService(repository)

	created, err := service.Create(CreateArtistInput{
		FirstName: "James",
		LastName:  "Appiah",
	})

	if err != nil {
		t.Fatalf("create artist: %v", err)
	}

	if created.ID == 0 {
		t.Fatal("expected created artist to have an ID")
	}

	if created.FirstName != "James" {
		t.Errorf(
			"expected first name James, got %s",
			created.FirstName,
		)
	}

	if created.LastName != "Appiah" {
		t.Errorf(
			"expected last name Appiah, got %s",
			created.LastName,
		)
	}
}
