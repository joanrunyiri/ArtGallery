package artist

import (
	"errors"
	"time"
)

type Artist struct {
	ID              int64     `json:"id"`
	FirstName       string    `json:"first_name"`
	LastName        string    `json:"last_name"`
	ArtistType      *string   `json:"artist_type,omitempty"`
	BirthDate       *string   `json:"birth_date,omitempty"`
	DeathDate       *string   `json:"death_date,omitempty"`
	Nationality     *string   `json:"nationality,omitempty"`
	Biography       *string   `json:"biography,omitempty"`
	Bibliography    *string   `json:"bibliography,omitempty"`
	WebsiteURL      *string   `json:"website_url,omitempty"`
	CVURL           *string   `json:"cv_url,omitempty"`
	InstagramURL    *string   `json:"instagram_url,omitempty"`
	FacebookURL     *string   `json:"facebook_url,omitempty"`
	ProfileImageURL *string   `json:"profile_image_url,omitempty"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}
type CreateArtistInput struct {
	FirstName       string  `json:"first_name"`
	LastName        string  `json:"last_name"`
	ArtistType      *string `json:"artist_type"`
	BirthDate       *string `json:"birth_date"`
	DeathDate       *string `json:"death_date"`
	Nationality     *string `json:"nationality"`
	Biography       *string `json:"biography"`
	Bibliography    *string `json:"bibliography"`
	WebsiteURL      *string `json:"website_url"`
	CVURL           *string `json:"cv_url"`
	InstagramURL    *string `json:"instagram_url"`
	FacebookURL     *string `json:"facebook_url"`
	ProfileImageURL *string `json:"profile_image_url"`
}
type UpdateArtistInput struct {
	FirstName       string  `json:"first_name"`
	LastName        string  `json:"last_name"`
	ArtistType      *string `json:"artist_type"`
	BirthDate       *string `json:"birth_date"`
	DeathDate       *string `json:"death_date"`
	Nationality     *string `json:"nationality"`
	Biography       *string `json:"biography"`
	Bibliography    *string `json:"bibliography"`
	WebsiteURL      *string `json:"website_url"`
	CVURL           *string `json:"cv_url"`
	InstagramURL    *string `json:"instagram_url"`
	FacebookURL     *string `json:"facebook_url"`
	ProfileImageURL *string `json:"profile_image_url"`
}

var ErrNotFound = errors.New("artist not found")
