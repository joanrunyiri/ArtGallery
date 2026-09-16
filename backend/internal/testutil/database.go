package testutil

import (
	"database/sql"
	"testing"

	"github.com/joanrunyiri/ArtGallery/backend/internal/database"
)

func NewTestDB(t *testing.T) *sql.DB {
	t.Helper()

	db, err := database.Open(":memory:")
	if err != nil {
		t.Fatalf("open test database: %v", err)
	}

	db.SetMaxOpenConns(1)

	t.Cleanup(func() {
		db.Close()
	})

	if err := database.CreateSchema(db); err != nil {
		t.Fatalf("create test schema: %v", err)
	}

	return db
}
