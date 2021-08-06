package models

import (
	"time"

	"github.com/lib/pq"
	"gorm.io/gorm"
)

type Order struct {
	ID uint `json:"id" gorm:"primaryKey"`
	Products pq.StringArray `gorm:"type:text[]"`
	User string `json:"user"`
	Status string `json:"status"`
	TotalPrice float32 `json:"total_price"`
	CreatedAt time.Time      `json:"created"`
	UpdatedAt time.Time      `json:"updated"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted"`
}