package artwork

import (
	"database/sql"
	"errors"
	"fmt"
)

type Repository struct {
	db *sql.DB
}

func ArtworkRepository(db *sql.DB) *Repository {
	return &Repository{db: db}
}
func (r *Repository) List() ([]Artwork, error) {
	rows, err := r.db.Query(`
		SELECT
			id,
			artist_id,
			title,
			pricing_type,
			price,
			description,
			height,
			width,
			depth,
			dimension_unit,
			framing,
			medium,
			release_date,
			edition_size,
			materials,
			hand_signed,
			individually_numbered,
			coa_included,
			packaging,
			image_url,
			created_at,
			updated_at
		FROM artworks
		ORDER BY created_at DESC
	`)
	if err != nil {
		return nil, fmt.Errorf("list artworks: %w", err)
	}
	defer rows.Close()

	artworks := make([]Artwork, 0)

	for rows.Next() {
		var artwork Artwork

		if err := rows.Scan(
			&artwork.ID,
			&artwork.ArtistID,
			&artwork.Title,
			&artwork.PricingType,
			&artwork.Price,
			&artwork.Description,
			&artwork.Height,
			&artwork.Width,
			&artwork.Depth,
			&artwork.DimensionUnit,
			&artwork.Framing,
			&artwork.Medium,
			&artwork.ReleaseDate,
			&artwork.EditionSize,
			&artwork.Materials,
			&artwork.HandSigned,
			&artwork.IndividuallyNumbered,
			&artwork.COAIncluded,
			&artwork.Packaging,
			&artwork.ImageURL,
			&artwork.CreatedAt,
			&artwork.UpdatedAt,
		); err != nil {
			return nil, fmt.Errorf("scan artwork: %w", err)
		}

		artworks = append(artworks, artwork)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("iterate artworks: %w", err)
	}

	return artworks, nil
}

func (r *Repository) GetByID(id int64) (*Artwork, error) {
	var artwork Artwork

	err := r.db.QueryRow(`
		SELECT
			id,
			artist_id,
			title,
			pricing_type,
			price,
			description,
			height,
			width,
			depth,
			dimension_unit,
			framing,
			medium,
			release_date,
			edition_size,
			materials,
			hand_signed,
			individually_numbered,
			coa_included,
			packaging,
			image_url,
			created_at,
			updated_at
		FROM artworks
		WHERE id = ?
	`, id).Scan(
		&artwork.ID,
		&artwork.ArtistID,
		&artwork.Title,
		&artwork.PricingType,
		&artwork.Price,
		&artwork.Description,
		&artwork.Height,
		&artwork.Width,
		&artwork.Depth,
		&artwork.DimensionUnit,
		&artwork.Framing,
		&artwork.Medium,
		&artwork.ReleaseDate,
		&artwork.EditionSize,
		&artwork.Materials,
		&artwork.HandSigned,
		&artwork.IndividuallyNumbered,
		&artwork.COAIncluded,
		&artwork.Packaging,
		&artwork.ImageURL,
		&artwork.CreatedAt,
		&artwork.UpdatedAt,
	)

	if errors.Is(err, sql.ErrNoRows) {
		return nil, ErrNotFound
	}

	if err != nil {
		return nil, fmt.Errorf("get artwork: %w", err)
	}

	return &artwork, nil
}

func (r *Repository) Create(input CreateArtworkInput) (*Artwork, error) {
	result, err := r.db.Exec(`
		INSERT INTO artworks (
			artist_id,
			title,
			pricing_type,
			price,
			description,
			height,
			width,
			depth,
			dimension_unit,
			framing,
			medium,
			release_date,
			edition_size,
			materials,
			hand_signed,
			individually_numbered,
			coa_included,
			packaging,
			image_url
		)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`,
		input.ArtistID,
		input.Title,
		input.PricingType,
		input.Price,
		input.Description,
		input.Height,
		input.Width,
		input.Depth,
		input.DimensionUnit,
		input.Framing,
		input.Medium,
		input.ReleaseDate,
		input.EditionSize,
		input.Materials,
		input.HandSigned,
		input.IndividuallyNumbered,
		input.COAIncluded,
		input.Packaging,
		input.ImageURL,
	)
	if err != nil {
		return nil, fmt.Errorf("create artwork: %w", err)
	}

	id, err := result.LastInsertId()
	if err != nil {
		return nil, fmt.Errorf("get artwork id: %w", err)
	}

	return r.GetByID(id)
}
func (r *Repository) Update(id int64, input UpdateArtworkInput) (*Artwork, error) {
	result, err := r.db.Exec(`
		UPDATE artworks
		SET
			artist_id = ?,
			title = ?,
			pricing_type = ?,
			price = ?,
			description = ?,
			height = ?,
			width = ?,
			depth = ?,
			dimension_unit = ?,
			framing = ?,
			medium = ?,
			release_date = ?,
			edition_size = ?,
			materials = ?,
			hand_signed = ?,
			individually_numbered = ?,
			coa_included = ?,
			packaging = ?,
			image_url = ?,
			updated_at = CURRENT_TIMESTAMP
		WHERE id = ?
	`,
		input.ArtistID,
		input.Title,
		input.PricingType,
		input.Price,
		input.Description,
		input.Height,
		input.Width,
		input.Depth,
		input.DimensionUnit,
		input.Framing,
		input.Medium,
		input.ReleaseDate,
		input.EditionSize,
		input.Materials,
		input.HandSigned,
		input.IndividuallyNumbered,
		input.COAIncluded,
		input.Packaging,
		input.ImageURL,
		id,
	)
	if err != nil {
		return nil, fmt.Errorf("update artwork: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return nil, fmt.Errorf("get affected rows: %w", err)
	}

	if rowsAffected == 0 {
		return nil, ErrNotFound
	}

	return r.GetByID(id)
}

func (r *Repository) Delete(id int64) error {
	result, err := r.db.Exec(`
		DELETE FROM artworks
		WHERE id = ?
	`, id)
	if err != nil {
		return fmt.Errorf("delete artwork: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("get affected rows: %w", err)
	}

	if rowsAffected == 0 {
		return ErrNotFound
	}

	return nil
}
