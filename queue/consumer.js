const amqp = require('amqplib');
const dotenv = require('dotenv');

dotenv.config();

const amqp_url = process.env.AMQP_URL;
const queue_name = process.env.QUEUE_NAME;

const receiveQueue = async () => {
    try {
        //1. connect to rabbitmq
        const connection = await amqp.connect(amqp_url);
        //2. create channel
        const channel = await connection.createChannel();
        //3. assert queue
        await channel.assertQueue(queue_name, {
            durable: false
        });
        //4. receive to queue
        await channel.consume(queue_name, message => {
            console.log(`Msg::::`, message.content.toString());
        }, {
            noAck: true //set bang false => chua nhan duoc message
        });

        //5. close channel and connection

    } catch (error) {
        console.error('Error sending message to queue:', error);
    }
}

receiveQueue();