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
	artworks := []struct {
		artistKey            string
		title                string
		pricingType          string
		price                float64
		description          string
		height               float64
		width                float64
		depth                float64
		dimensionUnit        string
		framing              string
		medium               string
		releaseDate          string
		editionSize          int
		materials            string
		handSigned           bool
		individuallyNumbered bool
		coaIncluded          bool
		packaging            string
		imageURL             string
	}{
		{
			artistKey:            "james-appiah",
			title:                "Whispers of Memory",
			pricingType:          "Fixed Price",
			price:                4200,
			description:          "A contemplative exploration of memory and identity.",
			height:               120,
			width:                90,
			depth:                3,
			dimensionUnit:        "cm",
			framing:              "Framed",
			medium:               "Oil on canvas",
			releaseDate:          "2026-03-15",
			editionSize:          1,
			materials:            "Oil, canvas",
			handSigned:           true,
			individuallyNumbered: false,
			coaIncluded:          true,
			packaging:            "Wooden crate",
			imageURL:             "/images/artworks/whispers-of-memory.jpg",
		},
		{
			artistKey:            "amara-okafor",
			title:                "Fragments",
			pricingType:          "Fixed Price",
			price:                3100,
			description:          "A mixed-media work exploring fragmented personal histories.",
			height:               100,
			width:                80,
			depth:                2,
			dimensionUnit:        "cm",
			framing:              "Unframed",
			medium:               "Mixed media",
			releaseDate:          "2026-05-10",
			editionSize:          1,
			materials:            "Acrylic, paper, canvas",
			handSigned:           true,
			individuallyNumbered: false,
			coaIncluded:          true,
			packaging:            "Protective art box",
			imageURL:             "/images/artworks/fragments.jpg",
		},
		{
			artistKey:            "leila-hassan",
			title:                "Between Places",
			pricingType:          "Fixed Price",
			price:                2800,
			description:          "A study of movement, belonging, and the spaces between destinations.",
			height:               75,
			width:                60,
			depth:                2,
			dimensionUnit:        "cm",
			framing:              "Framed",
			medium:               "Acrylic on canvas",
			releaseDate:          "2026-06-21",
			editionSize:          1,
			materials:            "Acrylic, canvas",
			handSigned:           true,
			individuallyNumbered: false,
			coaIncluded:          true,
			packaging:            "Protective art box",
			imageURL:             "/images/artworks/between-places.jpg",
		},
	}

	for _, artwork := range artworks {
		artistID, ok := artistIDs[artwork.artistKey]
		if !ok {
			return fmt.Errorf(
				"artist ID not found for seed key %s",
				artwork.artistKey,
			)
		}

		_, err := tx.Exec(`
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
			artistID,
			artwork.title,
			artwork.pricingType,
			artwork.price,
			artwork.description,
			artwork.height,
			artwork.width,
			artwork.depth,
			artwork.dimensionUnit,
			artwork.framing,
			artwork.medium,
			artwork.releaseDate,
			artwork.editionSize,
			artwork.materials,
			artwork.handSigned,
			artwork.individuallyNumbered,
			artwork.coaIncluded,
			artwork.packaging,
			artwork.imageURL,
		)
		if err != nil {
			return fmt.Errorf(
				"insert artwork %s: %w",
				artwork.title,
				err,
			)
		}
	}

	eventResult, err := tx.Exec(`
	INSERT INTO events (
		name,
		start_date,
		end_date,
		ticket_price
	)
	VALUES (?, ?, ?, ?)
`,
		"Whispers of the Forgotten",
		"2026-09-14",
		"2026-09-20",
		50.00,
	)
	if err != nil {
		return fmt.Errorf("insert demo event: %w", err)
	}

	eventID, err := eventResult.LastInsertId()
	if err != nil {
		return fmt.Errorf("get inserted event ID: %w", err)
	}

	metrics := []struct {
		date            string
		eventViews      int
		ticketPageViews int
		ticketsSold     int
		revenue         float64
	}{
		{"2026-09-14", 1450, 280, 32, 1600},
		{"2026-09-15", 1620, 310, 38, 1900},
		{"2026-09-16", 1780, 350, 44, 2200},
		{"2026-09-17", 1690, 325, 41, 2050},
		{"2026-09-18", 1850, 370, 48, 2400},
		{"2026-09-19", 2140, 420, 57, 2850},
		{"2026-09-20", 1920, 390, 52, 2600},
	}
	for _, metric := range metrics {
		_, err := tx.Exec(`
		INSERT INTO event_daily_metrics (
			event_id,
			metric_date,
			event_views,
			ticket_page_views,
			tickets_sold,
			revenue
		)
		VALUES (?, ?, ?, ?, ?, ?)
	`,
			eventID,
			metric.date,
			metric.eventViews,
			metric.ticketPageViews,
			metric.ticketsSold,
			metric.revenue,
		)
		if err != nil {
			return fmt.Errorf(
				"insert event metrics for %s: %w",
				metric.date,
				err,
			)
		}
	}

	if err := tx.Commit(); err != nil {
		return fmt.Errorf("commit seed transaction: %w", err)
	}

	return nil
}
