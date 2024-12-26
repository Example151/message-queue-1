const amqp = require('amqplib');
const dotenv = require('dotenv');

dotenv.config();

const amqp_url = process.env.AMQP_URL;

const sendEmail = async () => {
    try {
        // 1. connect to rabbitmq
        const connection = await amqp.connect(amqp_url);

        // 2. create channel
        const channel = await connection.createChannel();

        // 3. assert exchange
        const queue_name = 'send_email';
        await channel.assertExchange(queue_name, 'topic', {
            durable: false
        });

        // 4. publish email
        const args = process.argv.slice(2);
        const msg = args[1] || 'Fixed';
        const topic = args[0];
        console.log(`msg:: ${msg} :: topic:: ${topic}`);

        await channel.publish(queue_name, topic, Buffer.from(msg));

        console.log(`[x] Sent OK::: ${msg}`);
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

sendEmail();