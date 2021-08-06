package main

import (
	"order-go-service/database"
	"order-go-service/server"
)

func main() {
	database.StartDataBase()

	server := server.NewServer()

	server.Run()
}