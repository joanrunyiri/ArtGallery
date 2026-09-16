package artwork

import (
	"errors"
	"strings"
	"time"

	"github.com/joanrunyiri/ArtGallery/backend/internal/artist"
)

var (
	ErrTitleRequired       = errors.New("title is required")
	ErrPricingTypeRequired = errors.New("pricing type is required")
	ErrInvalidPrice        = errors.New("price cannot be negative")
	ErrInvalidDimensions   = errors.New("dimensions cannot be negative")
	ErrInvalidEditionSize  = errors.New("edition size cannot be negative")
	ErrInvalidReleaseDate  = errors.New("release date must use YYYY-MM-DD format")
	ErrArtistNotFound      = errors.New("assigned artist not found")
)

type Service struct {
	repository       *Repository
	artistRepository *artist.Repository
}

func ArtworkService(
	repository *Repository,
	artistRepository *artist.Repository,
) *Service {
	return &Service{
		repository:       repository,
		artistRepository: artistRepository,
	}
}

func (s *Service) List() ([]Artwork, error) {
	return s.repository.List()
}

func (s *Service) GetByID(id int64) (*Artwork, error) {
	return s.repository.GetByID(id)
}

func (s *Service) Delete(id int64) error {
	return s.repository.Delete(id)
}

func validateArtwork(
	title string,
	pricingType string,
	price *float64,
	height *float64,
	width *float64,
	depth *float64,
	editionSize *int,
	releaseDate *string,
) error {
	if strings.TrimSpace(title) == "" {
		return ErrTitleRequired
	}

	if strings.TrimSpace(pricingType) == "" {
		return ErrPricingTypeRequired
	}

	if price != nil && *price < 0 {
		return ErrInvalidPrice
	}

	if (height != nil && *height < 0) ||
		(width != nil && *width < 0) ||
		(depth != nil && *depth < 0) {
		return ErrInvalidDimensions
	}

	if editionSize != nil && *editionSize < 0 {
		return ErrInvalidEditionSize
	}

	if releaseDate != nil && *releaseDate != "" {
		if _, err := time.Parse("2006-01-02", *releaseDate); err != nil {
			return ErrInvalidReleaseDate
		}
	}

	return nil
}
func (s *Service) validateArtist(artistID *int64) error {
	if artistID == nil {
		return nil
	}

	if *artistID <= 0 {
		return ErrArtistNotFound
	}

	_, err := s.artistRepository.GetByID(*artistID)
	if err != nil {
		if errors.Is(err, artist.ErrNotFound) {
			return ErrArtistNotFound
		}

		return err
	}

	return nil
}

func (s *Service) Create(input CreateArtworkInput) (*Artwork, error) {
	input.Title = strings.TrimSpace(input.Title)
	input.PricingType = strings.TrimSpace(input.PricingType)

	if err := validateArtwork(
		input.Title,
		input.PricingType,
		input.Price,
		input.Height,
		input.Width,
		input.Depth,
		input.EditionSize,
		input.ReleaseDate,
	); err != nil {
		return nil, err
	}

	if err := s.validateArtist(input.ArtistID); err != nil {
		return nil, err
	}

	return s.repository.Create(input)
}

func (s *Service) Update(id int64, input UpdateArtworkInput) (*Artwork, error) {
	input.Title = strings.TrimSpace(input.Title)
	input.PricingType = strings.TrimSpace(input.PricingType)

	if err := validateArtwork(
		input.Title,
		input.PricingType,
		input.Price,
		input.Height,
		input.Width,
		input.Depth,
		input.EditionSize,
		input.ReleaseDate,
	); err != nil {
		return nil, err
	}

	if err := s.validateArtist(input.ArtistID); err != nil {
		return nil, err
	}

	return s.repository.Update(id, input)
}
