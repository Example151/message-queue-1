const amqp = require('amqplib');
const dotenv = require('dotenv');

dotenv.config();

const amqp_url = process.env.AMQP_URL;

const postVideo = async ({ message }) => {
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

        // 4. publish message to exchange
        await channel.publish(queue_name, '', Buffer.from(message));

        console.log(`[x] Sent OK::: ${message}`);
        //5. close channel and connection

        // await channel.close();
        // await connection.close();
        setTimeout(() => {
            connection.close();
            process.exit(0);
        }, 2000);

    } catch (error) {
        console.error(error);
    }
}

const message = process.argv.slice(2).join(' ') || 'Hello Exchange';

postVideo({ message });
