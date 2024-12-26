const amqp = require('amqplib');
const dotenv = require('dotenv');

dotenv.config();

const amqp_url = process.env.AMQP_URL;

const receiveVideo = async () => {
    try {
        // 1. connect to rabbitmq
        const connection = await amqp.connect(amqp_url);

        // 2. create channel
        const channel = await connection.createChannel();

        // 3. assert exchange
        const queue_name = 'video';
        await channel.assertExchange(queue_name, 'fanout', {
            durable: false
        });

        // 4. create queue
        const {
            queue
        } = await channel.assertQueue('', {
            exclusive: true //auto kill hang doi khi user thoat queue
        });

        console.log(`nameQueue::: ${queue}`);

        // 5. bind queue to exchange
        await channel.bindQueue(queue, queue_name, '');

        await channel.consume(queue, msg => {
            console.log(`msg:::`, msg.content.toString());
        }, {
            noAck: true
        });

    } catch (error) {
        console.error(error);
    }
}

receiveVideo();
