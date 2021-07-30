const amqp = require("amqplib");

async function connectMQ() {
  try {
    const amqpServer = "amqp://localhost:5672";
    const conn = await amqp.connect(amqpServer);
    const channel = await conn.createChannel();
    await channel.assertQueue("PRODUCT", { durable: true });

    return { channel, conn };
  } catch (error) {
    console.log(`Error in RabbitMQ ${error}`);
  }
}

module.exports = { connectMQ };
