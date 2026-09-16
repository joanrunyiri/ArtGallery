package database

import (
	"database/sql"
	"fmt"
)

func Seed(db *sql.DB) error {
	var artistCount int

	err := db.QueryRow("SELECT COUNT(*) FROM artists").Scan(&artistCount)
	if err != nil {
		return fmt.Errorf("count artists: %w", err)
	}

	if artistCount > 0 {
		return nil
	}

	return seedDemoData(db)
}

func seedDemoData(db *sql.DB) error {
	tx, err := db.Begin()
	if err != nil {
		return fmt.Errorf("begin seed transaction: %w", err)
	}

	defer tx.Rollback()

	// Demo data
	artistIDs := make(map[string]int64)

	artists := []struct {
		key         string
		firstName   string
		lastName    string
		artistType  string
		nationality string
		biography   string
	}{
		{
			key:         "james-appiah",
			firstName:   "James",
			lastName:    "Appiah",
			artistType:  "Individual",
			nationality: "Ghanaian",
			biography:   "James Appiah is a contemporary artist whose work explores memory, identity, and everyday experience.",
		},
		{
			key:         "amara-okafor",
			firstName:   "Amara",
			lastName:    "Okafor",
			artistType:  "Individual",
			nationality: "Nigerian",
			biography:   "Amara Okafor is a multidisciplinary artist working across painting and mixed media.",
		},
		{
			key:         "leila-hassan",
			firstName:   "Leila",
			lastName:    "Hassan",
			artistType:  "Individual",
			nationality: "Kenyan",
			biography:   "Leila Hassan is a visual artist whose practice examines place, movement, and personal histories.",
		},
	}

	for _, artist := range artists {
		result, err := tx.Exec(`
			INSERT INTO artists (
				first_name,
				last_name,
				artist_type,
				nationality,
				biography
			)
			VALUES (?, ?, ?, ?, ?)
		`,
			artist.firstName,
			artist.lastName,
			artist.artistType,
			artist.nationality,
			artist.biography,
		)
		if err != nil {
			return fmt.Errorf(
				"insert artist %s %s: %w",
				artist.firstName,
				artist.lastName,
				err,
			)
		}

		id, err := result.LastInsertId()
		if err != nil {
			return fmt.Errorf(
				"get inserted artist ID for %s %s: %w",
				artist.firstName,
				artist.lastName,
				err,
			)
		}

		artistIDs[artist.key] = id
	}

	if err := tx.Commit(); err != nil {
		return fmt.Errorf("commit seed transaction: %w", err)
	}

	return nil
}
