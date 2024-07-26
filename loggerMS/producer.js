const amqp = require("amqplib")
const config = require("./config")

// 1>Connect to the rabitMQ server
// 2>Create a channel on that connection
// 3>create  a exchange
// 4>publish the message to the exchange with a ROUTING KEY


class Producer {
    channel;
    
    async createChannel() {
        const connection = await amqp.connect(config.rabbitMq.url)
        this.channel = await connection.createChannel()
    }

    async publishMessage(routingkey, message){
        if(!this.channel){
           await this.createChannel();
        }

        const exchangeName = config.rabbitMq.exchangeName
        await this.channel.assertExchange(exchangeName,"direct")

        const logDetails = {
            logType: routingkey,
            message: message,
            dateTime: new Date()
        }

        await this.channel.publish(exchangeName,routingkey,Buffer.from(JSON.stringify(logDetails)))

        console.log(`The message ${message} is sent to exchange ${exchangeName}`)
    }
}


module.exports=
    Producer
