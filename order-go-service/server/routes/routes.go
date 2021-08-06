package routes

import (
	"order-go-service/controllers"

	"github.com/gin-gonic/gin"
)

func ConfigRoutes(router *gin.Engine) *gin.Engine {
	main := router.Group("api")
	{
		orders := main.Group("orders")
		{
			orders.GET("/:id")
			orders.GET("/", controllers.GetOrders)
			orders.POST("/", controllers.CreateOrder)
		}
	}

	return router
}