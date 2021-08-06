package messages

import (
	"encoding/json"
	"fmt"
	"log"
	"order-go-service/database"
	"order-go-service/models"
	"time"

	"github.com/streadway/amqp"
)

type Product struct {
	ID string `json:"_id"`
	CreateAt time.Time `json:"create_at"`
	Name string `json:"name"`
	Description string `json:"description"`
	Price float32 `json:"price"`
}

type OrderRabbitMq struct {
	Products []Product
	UserEmail string
}

func handleError(err error, msg string) {
	if err != nil {
		log.Fatalf("%s: %s", msg, err)
	}

}

func ConnectRabbit() {
	// amqpServerURL := os.Getenv("")

	connectRabbitMQ, err := amqp.Dial("amqp://localhost:5672");

	if err != nil {
		fmt.Println("Error to connect with rabbitMQ")
		log.Fatal("error: ",err)
	}

	defer connectRabbitMQ.Close()

	// Opening a channel to RaabitMQ instance over
	// the connect we have already established

	channelRabbitMQ, err := connectRabbitMQ.Channel()

	if err != nil {
		fmt.Println("Could not get instance the channel in RabbitMQ")
		log.Fatal("error: ", err)
	}

	queue, err := channelRabbitMQ.QueueDeclare("ORDER", true, false, false, false, nil)
	if err != nil {
		fmt.Println("Could not create channel order")
		log.Println(err)
	}

	messages, err := channelRabbitMQ.Consume(queue.Name, "", true, false, false, false, nil)

	if err != nil {
		fmt.Println("Could not get instance the channel in RabbitMQ")
		log.Println(err)
	}

	// Build a welcome message.
    log.Println("Successfully connected to RabbitMQ")
    log.Println("Waiting for messages")

	var newOrder models.Order

	 // Make a channel to receive messages into infinite loop.
	 forever := make(chan bool)

	 go func() {
		 for message := range messages {
			 // For example, show received message in a console.
			log.Printf(" > Received message: %s\n", message.Body)
			newOrder = createOrderDatabase(message.Body)

			body, err := json.Marshal(newOrder)

			if err != nil {
				fmt.Println("Could transform orderDatabase in json")
				log.Println(err)
			}

			err = channelRabbitMQ.Publish("", "PRODUCT", false, false, amqp.Publishing{
				DeliveryMode: amqp.Persistent,
				ContentType: "text/plain",
				Body: body,
			})

			handleError(err, "Could not publish to product")
		 }
	 }()
 
	 <-forever	 
}

func createOrderDatabase(messages []byte) models.Order {
	// log.Printf(" > Received message 02: %s\n", messages)

	var orderRabbit OrderRabbitMq

	err := json.Unmarshal(messages, &orderRabbit)
    if err != nil {
        fmt.Println("error:", err)
    }

	fmt.Println(orderRabbit.Products, orderRabbit.UserEmail)

	var sum float32
	var productsId []string

	for _, product := range orderRabbit.Products {
		productsId = append(productsId, product.ID)
		sum += product.Price
	}

	log.Println("sum", sum)

	db := database.GetDataBase()

	order := models.Order{
		Products: productsId,
		User: orderRabbit.UserEmail,
		TotalPrice: sum,
		Status: "Em andamento",
	}

	err = db.Create(&order).Error

	if err != nil {
		fmt.Println("Something erro to created in database", err.Error())
	}

	return order
}