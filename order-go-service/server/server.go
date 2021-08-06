package server

import (
	"log"
	"order-go-service/server/routes"

	"github.com/gin-gonic/gin"
)

// Struct to gin create server
type Server struct {
	port string
	server *gin.Engine
}

func NewServer() Server {
	return Server{
		port: "5000",
		server: gin.Default(),
	}
}

func (s *Server) Run() {
	router := routes.ConfigRoutes(s.server)

	log.Print("Server is running at port: ", s.port)
	log.Fatal(router.Run(":" + s.port))
}