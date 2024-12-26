1. Make sure you have Node.js installed
2. Open terminal and run `npm install` to install dependencies
3. Prepare RabbitMQ
    - resiger a RabbitMQ cloud free in https://cloudamqp.com and create a RabbitMQ instance
    OR
    - Install RabbitMQ in local machine in docker: `docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3.10-management`
    you can check admin on `http://localhost:15672` with username: `guest` and password: `guest`

4. clone .env.example and rename to .env
5. update AMQP_URL
6. Open terminal and run `node queue\producer.js` to send message to queue
7. Open one or more terminals and run `node queue\consumer.js` to receive message from queue
