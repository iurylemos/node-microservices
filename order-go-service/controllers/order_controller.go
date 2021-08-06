package controllers

import (
	"order-go-service/database"
	"order-go-service/models"

	"github.com/gin-gonic/gin"
)

func CreateOrder(c *gin.Context) {
	db := database.GetDataBase()

	var order models.Order

	err := c.ShouldBindJSON(&order)

	if err != nil {
		c.JSON(400, gin.H{
			"error": "Cannot bind JSON " + err.Error(),
		})

		return
	}

	err = db.Create(&order).Error

	if err != nil {
		c.JSON(400, gin.H{
			"error": "Cannot create order " + err.Error(),
		})

		return
	}

	c.JSON(200, order)
}

func GetOrders(c *gin.Context) {
	db := database.GetDataBase()

	var orders []models.Order

	err := db.Find(&orders).Error

	if err != nil {
		c.JSON(400, gin.H{
			"error": "Cannot find data: " + err.Error(),
		})

		return
	}

	c.JSON(200, orders)
}