package main

import (
	"order-go-service/database"
	"order-go-service/server"
	"order-go-service/server/messages"
)

func main() {
	database.StartDataBase()

	messages.ConnectRabbit()

	server := server.NewServer()

	server.Run()
}