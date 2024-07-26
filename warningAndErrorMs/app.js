const amqp = require("amqplib")
// 1 create a connection with rabbitMq server
// 2 create a new channel
// 3 create a exchange
// 4 create a queue
// 5 bind the queue to the exchange
// 6 consume the message from the queue


async function consumeMesaage(){
    const connect = await amqp.connect("amqp://localhost")
    const channel = await connect.createChannel()

    await channel.assertExchange("logExchange","direct")

    const q = channel.assertQueue("warningANDerrorQueue")

    await channel.bindQueue(q.queue,"logExchange","warning")
    await channel.bindQueue(q.queue,"logExchange","error")

    channel.consume(q.queue,(msg) => {
        const data = JSON.parse(msg.content)
        console.log(data)
        channel.ack(msg)
    })
}

consumeMesaage()