const express = require("express");
const { connectMQ } = require("./src/rabbitmq/connection");
const { connectDB } = require("./src/db/connection");
const { routes } = require("./src/routes");
const { OrderModel } = require("./src/models/Order");

const app = express();
const PORT = process.env.PORT_ONE || 9090;
app.use(express.json());
app.use(routes);

function createOrder(products, userEmail) {
  let total = 0;
  for (const product of products) {
    total += product.price;
  }

  const newOrder = new OrderModel({
    products,
    user: userEmail,
    total_price: total,
  });

  newOrder.save();
  return newOrder;
}

(async () => {
  try {
    await connectDB();
    const { channel } = await connectMQ();

    channel.consume("ORDER", (data) => {
      const { products, userEmail } = JSON.parse(data.content);

      console.log("Consuming ORDER queue");
      const newOrder = createOrder(products, userEmail);

      channel.ack(data);
      channel.sendToQueue("PRODUCT", Buffer.from(JSON.stringify({ newOrder })));
    });

    app.listen(PORT, () => {
      console.log(`Order-Service at ${PORT}`);
    });
  } catch (error) {
    console.log("error", error);
  }
})();
