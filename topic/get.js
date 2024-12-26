const amqp = require('amqplib');
const dotenv = require('dotenv');

dotenv.config();

const amqp_url = process.env.AMQP_URL;

const getEmail = async () => {
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
        const { queue } = await channel.assertQueue('', {
            exclusive: true
        });

        const args = process.argv.slice(2);
        if (args.length < 1) {
            console.log(`Usage: node get.js [topic]`);
            process.exit(0);
        }

        /*
            * co nghia la phu hop voi bat ky ki tu nao
            # khop voi 1 hoajc nhieu ki tu bat ky
        */

        console.log(`waitting queue ${queue}:: topic:: ${args}`);
        args.forEach(async topic => {
            await channel.bindQueue(queue, queue_name, topic);
        });

        await channel.consume(queue, msg => {
            console.log(`msg::: ${msg.content.toString()}`);
        }, {
            noAck: true
        });

    } catch (error) {
        console.error(error);
    }
}

getEmail();