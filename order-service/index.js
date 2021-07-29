const express = require("express");
const { connectMQ } = require("./src/rabbitmq/connection");
const { connectDB } = require("./src/db/connection");
const { routes } = require("./src/routes");

const app = express();
const PORT = process.env.PORT_ONE || 9090;
app.use(express.json());
app.use(routes);

(async () => {
  try {
    await connectDB();
    const { channel } = await connectMQ();

    channel.consume("ORDER", (data) => {
      const { products, userEmail } = JSON.parse(data.content);

      console.log("Consuming ORDER queue");
      console.log(products);
    });

    app.listen(PORT, () => {
      console.log(`Order-Service at ${PORT}`);
    });
  } catch (error) {
    console.log("error", error);
  }
})();
