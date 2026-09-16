package artist

import (
	"errors"
	"strings"
	"time"
)

var (
	ErrFirstNameRequired   = errors.New("first name is required")
	ErrLastNameRequired    = errors.New("last name is required")
	ErrBiographyTooLong    = errors.New("biography must not exceed 3000 characters")
	ErrBibliographyTooLong = errors.New("bibliography must not exceed 5000 characters")
	ErrInvalidBirthDate    = errors.New("birth date must use YYYY-MM-DD format")
	ErrInvalidDeathDate    = errors.New("death date must use YYYY-MM-DD format")
)

func validOptionalDate(value *string) bool {
	if value == nil || *value == "" {
		return true
	}

	_, err := time.Parse("2006-01-02", *value)
	return err == nil
}
func validateArtist(
	firstName string,
	lastName string,
	biography *string,
	bibliography *string,
	birthDate *string,
	deathDate *string,
) error {
	if strings.TrimSpace(firstName) == "" {
		return ErrFirstNameRequired
	}

	if strings.TrimSpace(lastName) == "" {
		return ErrLastNameRequired
	}

	if biography != nil && len(*biography) > 3000 {
		return ErrBiographyTooLong
	}

	if bibliography != nil && len(*bibliography) > 5000 {
		return ErrBibliographyTooLong
	}

	if !validOptionalDate(birthDate) {
		return ErrInvalidBirthDate
	}

	if !validOptionalDate(deathDate) {
		return ErrInvalidDeathDate
	}

	return nil
}

type Service struct {
	repository *Repository
}

func ArtistService(repository *Repository) *Service {
	return &Service{
		repository: repository,
	}
}
func (s *Service) List() ([]Artist, error) {
	return s.repository.List()
}

func (s *Service) GetByID(id int64) (*Artist, error) {
	return s.repository.GetByID(id)
}
func (s *Service) Create(input CreateArtistInput) (*Artist, error) {
	input.FirstName = strings.TrimSpace(input.FirstName)
	input.LastName = strings.TrimSpace(input.LastName)

	if err := validateArtist(
		input.FirstName,
		input.LastName,
		input.Biography,
		input.Bibliography,
		input.BirthDate,
		input.DeathDate,
	); err != nil {
		return nil, err
	}

	return s.repository.Create(input)
}
func (s *Service) Update(id int64, input UpdateArtistInput) (*Artist, error) {
	input.FirstName = strings.TrimSpace(input.FirstName)
	input.LastName = strings.TrimSpace(input.LastName)

	if err := validateArtist(
		input.FirstName,
		input.LastName,
		input.Biography,
		input.Bibliography,
		input.BirthDate,
		input.DeathDate,
	); err != nil {
		return nil, err
	}

	return s.repository.Update(id, input)
}
func (s *Service) Delete(id int64) error {
	return s.repository.Delete(id)
}
