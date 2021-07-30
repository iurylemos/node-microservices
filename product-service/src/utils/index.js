async function returnConsume(channel) {
  return new Promise(async (resolve, reject) => {
    channel.consume("PRODUCT", function (msg) {
      console.log("aqui?", msg.content.toString());
      channel.ack(msg);
      resolve(JSON.parse(msg.content));
    });
  });
}

module.exports = { returnConsume };
