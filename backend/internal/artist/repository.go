package artist

import (
	"database/sql"
	"errors"
	"fmt"
)

type Repository struct {
	db *sql.DB
}

func ArtistRepository(db *sql.DB) *Repository {
	return &Repository{
		db: db,
	}
}

// list all artists
func (r *Repository) List() ([]Artist, error) {
	rows, err := r.db.Query(`
		SELECT
			id,
			first_name,
			last_name,
			artist_type,
			birth_date,
			death_date,
			nationality,
			biography,
			bibliography,
			website_url,
			cv_url,
			instagram_url,
			facebook_url,
			profile_image_url,
			created_at,
			updated_at
		FROM artists
		ORDER BY created_at DESC
	`)
	if err != nil {
		return nil, fmt.Errorf("list artists: %w", err)
	}
	defer rows.Close()

	artists := make([]Artist, 0)

	for rows.Next() {
		var artist Artist

		if err := rows.Scan(
			&artist.ID,
			&artist.FirstName,
			&artist.LastName,
			&artist.ArtistType,
			&artist.BirthDate,
			&artist.DeathDate,
			&artist.Nationality,
			&artist.Biography,
			&artist.Bibliography,
			&artist.WebsiteURL,
			&artist.CVURL,
			&artist.InstagramURL,
			&artist.FacebookURL,
			&artist.ProfileImageURL,
			&artist.CreatedAt,
			&artist.UpdatedAt,
		); err != nil {
			return nil, fmt.Errorf("scan artist: %w", err)
		}

		artists = append(artists, artist)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("iterate artists: %w", err)
	}

	return artists, nil
}

// extract artist by id
func (r *Repository) GetByID(id int64) (*Artist, error) {
	var artist Artist

	err := r.db.QueryRow(`
		SELECT
			id,
			first_name,
			last_name,
			artist_type,
			birth_date,
			death_date,
			nationality,
			biography,
			bibliography,
			website_url,
			cv_url,
			instagram_url,
			facebook_url,
			profile_image_url,
			created_at,
			updated_at
		FROM artists
		WHERE id = ?
	`, id).Scan(
		&artist.ID,
		&artist.FirstName,
		&artist.LastName,
		&artist.ArtistType,
		&artist.BirthDate,
		&artist.DeathDate,
		&artist.Nationality,
		&artist.Biography,
		&artist.Bibliography,
		&artist.WebsiteURL,
		&artist.CVURL,
		&artist.InstagramURL,
		&artist.FacebookURL,
		&artist.ProfileImageURL,
		&artist.CreatedAt,
		&artist.UpdatedAt,
	)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrNotFound
		}

		return nil, fmt.Errorf("get artist by id: %w", err)
	}

	return &artist, nil
}

// create artist
func (r *Repository) Create(input CreateArtistInput) (*Artist, error) {
	result, err := r.db.Exec(`
		INSERT INTO artists (
			first_name,
			last_name,
			artist_type,
			birth_date,
			death_date,
			nationality,
			biography,
			bibliography,
			website_url,
			cv_url,
			instagram_url,
			facebook_url,
			profile_image_url
		)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`,
		input.FirstName,
		input.LastName,
		input.ArtistType,
		input.BirthDate,
		input.DeathDate,
		input.Nationality,
		input.Biography,
		input.Bibliography,
		input.WebsiteURL,
		input.CVURL,
		input.InstagramURL,
		input.FacebookURL,
		input.ProfileImageURL,
	)
	if err != nil {
		return nil, fmt.Errorf("create artist: %w", err)
	}

	id, err := result.LastInsertId()
	if err != nil {
		return nil, fmt.Errorf("get created artist id: %w", err)
	}

	artist, err := r.GetByID(id)
	if err != nil {
		return nil, fmt.Errorf("get created artist: %w", err)
	}

	return artist, nil
}

// update
func (r *Repository) Update(id int64, input UpdateArtistInput) (*Artist, error) {
	result, err := r.db.Exec(`
		UPDATE artists
		SET
			first_name = ?,
			last_name = ?,
			artist_type = ?,
			birth_date = ?,
			death_date = ?,
			nationality = ?,
			biography = ?,
			bibliography = ?,
			website_url = ?,
			cv_url = ?,
			instagram_url = ?,
			facebook_url = ?,
			profile_image_url = ?,
			updated_at = CURRENT_TIMESTAMP
		WHERE id = ?
	`,
		input.FirstName,
		input.LastName,
		input.ArtistType,
		input.BirthDate,
		input.DeathDate,
		input.Nationality,
		input.Biography,
		input.Bibliography,
		input.WebsiteURL,
		input.CVURL,
		input.InstagramURL,
		input.FacebookURL,
		input.ProfileImageURL,
		id,
	)
	if err != nil {
		return nil, fmt.Errorf("update artist: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return nil, fmt.Errorf("get updated rows count: %w", err)
	}

	if rowsAffected == 0 {
		return nil, ErrNotFound
	}

	artist, err := r.GetByID(id)
	if err != nil {
		return nil, fmt.Errorf("get updated artist: %w", err)
	}

	return artist, nil
}

// delete
func (r *Repository) Delete(id int64) error {
	result, err := r.db.Exec(`
		DELETE FROM artists
		WHERE id = ?
	`, id)
	if err != nil {
		return fmt.Errorf("delete artist: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("get deleted rows count: %w", err)
	}

	if rowsAffected == 0 {
		return ErrNotFound
	}

	return nil
}
