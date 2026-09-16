package database

import (
	"database/sql"
	"fmt"
)

func CreateSchema(db *sql.DB) error {
	const schema = `
	CREATE TABLE IF NOT EXISTS artists (
		id INTEGER PRIMARY KEY,
		first_name TEXT NOT NULL,
		last_name TEXT NOT NULL,
		artist_type TEXT,
		birth_date TEXT,
		death_date TEXT,
		nationality TEXT,
		biography TEXT
			CHECK(length(biography) <= 3000),
		bibliography TEXT
			CHECK(length(bibliography) <= 5000),
		website_url TEXT,
		cv_url TEXT,
		instagram_url TEXT,
		facebook_url TEXT,
		profile_image_url TEXT,
		created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
	);

	CREATE TABLE IF NOT EXISTS artworks (
		id INTEGER PRIMARY KEY,
		artist_id INTEGER,
		title TEXT NOT NULL,
		pricing_type TEXT NOT NULL,
		price REAL,
		currency TEXT NOT NULL DEFAULT 'USD',
		description TEXT,
		height REAL,
		width REAL,
		depth REAL,
		dimension_unit TEXT,
		framing TEXT,
		medium TEXT,
		release_date TEXT,
		edition_size INTEGER,
		materials TEXT,
		hand_signed INTEGER NOT NULL DEFAULT 0,
		individually_numbered INTEGER NOT NULL DEFAULT 0,
		coa_included INTEGER NOT NULL DEFAULT 0,
		packaging TEXT,
		image_url TEXT,
		created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

		FOREIGN KEY (artist_id)
			REFERENCES artists(id)
			ON DELETE SET NULL
	);

	CREATE TABLE IF NOT EXISTS events (
		id INTEGER PRIMARY KEY,
		name TEXT NOT NULL,
		start_date TEXT,
		end_date TEXT,
		ticket_price REAL,
		currency TEXT NOT NULL DEFAULT 'USD',
		created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
	);

	CREATE TABLE IF NOT EXISTS event_daily_metrics (
		id INTEGER PRIMARY KEY,
		event_id INTEGER NOT NULL,
		metric_date TEXT NOT NULL,
		event_views INTEGER NOT NULL DEFAULT 0,
		ticket_page_views INTEGER NOT NULL DEFAULT 0,
		tickets_sold INTEGER NOT NULL DEFAULT 0,
		revenue REAL NOT NULL DEFAULT 0,

		FOREIGN KEY (event_id)
			REFERENCES events(id)
			ON DELETE CASCADE,

		UNIQUE(event_id, metric_date)
	);

	CREATE INDEX IF NOT EXISTS idx_artworks_artist_id
		ON artworks(artist_id);

	CREATE INDEX IF NOT EXISTS idx_event_metrics_event_id
		ON event_daily_metrics(event_id);
	`

	if _, err := db.Exec(schema); err != nil {
		return fmt.Errorf("create database schema: %w", err)
	}

	return nil
}
