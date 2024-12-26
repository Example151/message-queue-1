const amqp = require('amqplib');
const dotenv = require('dotenv');

dotenv.config();

const amqp_url = process.env.AMQP_URL;
const queue_name = process.env.QUEUE_NAME;

const sendQueue = async ({ message }) => {
    try {
        //1. connect to rabbitmq
        const connection = await amqp.connect(amqp_url);
        //2. create channel
        const channel = await connection.createChannel();
        //3. assert queue
        await channel.assertQueue(queue_name, {
            durable: false //set bang false => queue khong luu tru message
        });
        //4. send message to queue
        await channel.sendToQueue(queue_name, Buffer.from(message), {
            //expiration: 10000 //set expiration time for message in milliseconds
        });
        //5. close channel and connection
        // await channel.close();
        // await connection.close();

        console.log('Message sent to queue');
    } catch (error) {
        console.error('Error sending message to queue:', error);
    }
}

const message = process.argv.slice(2).join(' ') || 'Hello Queue';

sendQueue({message});