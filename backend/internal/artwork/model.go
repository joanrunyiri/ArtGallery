package artwork

import (
	"errors"
	"time"
)

var ErrNotFound = errors.New("artwork not found")

type Artwork struct {
	ID                   int64     `json:"id"`
	ArtistID             *int64    `json:"artist_id,omitempty"`
	Title                string    `json:"title"`
	PricingType          string    `json:"pricing_type"`
	Price                *float64  `json:"price,omitempty"`
	Description          *string   `json:"description,omitempty"`
	Height               *float64  `json:"height,omitempty"`
	Width                *float64  `json:"width,omitempty"`
	Depth                *float64  `json:"depth,omitempty"`
	DimensionUnit        *string   `json:"dimension_unit,omitempty"`
	Framing              *string   `json:"framing,omitempty"`
	Medium               *string   `json:"medium,omitempty"`
	ReleaseDate          *string   `json:"release_date,omitempty"`
	EditionSize          *int      `json:"edition_size,omitempty"`
	Materials            *string   `json:"materials,omitempty"`
	HandSigned           bool      `json:"hand_signed"`
	IndividuallyNumbered bool      `json:"individually_numbered"`
	COAIncluded          bool      `json:"coa_included"`
	Packaging            *string   `json:"packaging,omitempty"`
	ImageURL             *string   `json:"image_url,omitempty"`
	CreatedAt            time.Time `json:"created_at"`
	UpdatedAt            time.Time `json:"updated_at"`
}
type CreateArtworkInput struct {
	ArtistID             *int64   `json:"artist_id"`
	Title                string   `json:"title"`
	PricingType          string   `json:"pricing_type"`
	Price                *float64 `json:"price"`
	Description          *string  `json:"description"`
	Height               *float64 `json:"height"`
	Width                *float64 `json:"width"`
	Depth                *float64 `json:"depth"`
	DimensionUnit        *string  `json:"dimension_unit"`
	Framing              *string  `json:"framing"`
	Medium               *string  `json:"medium"`
	ReleaseDate          *string  `json:"release_date"`
	EditionSize          *int     `json:"edition_size"`
	Materials            *string  `json:"materials"`
	HandSigned           bool     `json:"hand_signed"`
	IndividuallyNumbered bool     `json:"individually_numbered"`
	COAIncluded          bool     `json:"coa_included"`
	Packaging            *string  `json:"packaging"`
	ImageURL             *string  `json:"image_url"`
}

type UpdateArtworkInput struct {
	ArtistID             *int64   `json:"artist_id"`
	Title                string   `json:"title"`
	PricingType          string   `json:"pricing_type"`
	Price                *float64 `json:"price"`
	Description          *string  `json:"description"`
	Height               *float64 `json:"height"`
	Width                *float64 `json:"width"`
	Depth                *float64 `json:"depth"`
	DimensionUnit        *string  `json:"dimension_unit"`
	Framing              *string  `json:"framing"`
	Medium               *string  `json:"medium"`
	ReleaseDate          *string  `json:"release_date"`
	EditionSize          *int     `json:"edition_size"`
	Materials            *string  `json:"materials"`
	HandSigned           bool     `json:"hand_signed"`
	IndividuallyNumbered bool     `json:"individually_numbered"`
	COAIncluded          bool     `json:"coa_included"`
	Packaging            *string  `json:"packaging"`
	ImageURL             *string  `json:"image_url"`
}
