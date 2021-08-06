package database

import (
	"fmt"
	"log"
	"order-go-service/database/migrations"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var db *gorm.DB

func StartDataBase() {
	str := "host=localhost port=25432 user=admin dbname=orders sslmode=disable password=123456"

	database, err := gorm.Open(postgres.Open(str), &gorm.Config{})

	if err != nil {
		fmt.Println("Could not connect to the Postgres Database")
		log.Fatal("error: ", err)
	}

	db = database

	config, _ := db.DB()

	config.SetMaxIdleConns(10)
	config.SetMaxIdleConns(100)
	config.SetConnMaxLifetime(time.Hour)

	migrations.RunMigrations(db)
}

// Method to get database and create only instance of database
func GetDataBase() *gorm.DB {
	return db
}