const express = require('express');
const companyRoutes = require('./routes/routes');
const mongoose = require('mongoose');
const amqp = require('amqplib');

const app = express();
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    // define the settings of the below headers
    // res.setHeader('Access-Control-Allow-Headers','Content-Type,Authorization');
    next();
})

const amqpConnection = async () => {
    try {
        connection = await amqp.connect('amqps://kfzxhqby:sD38IHf5gxMWyzAeKOwt3ctQbY2Ypny8@codfish.rmq.cloudamqp.com/kfzxhqby');
        channel = await connection.createChannel();
        return channel;
    } catch (err) {
        console.log(err);
    }
}

exports.sendMessageToQueue = async (queueName,message) => {
    const channel = await amqpConnection();
    channel.sendToQueue(queueName,Buffer.from(message));
}

app.use('/company', companyRoutes);
app.use('/', async (req, res) => {
    res.status(200).send({
        message: 'mongo db is connected to the application' + result
    })
})

//mongoose connection is made
mongoose.connect('mongodb+srv://prmdpsn56:Paramdeep12345@cluster0.znsl8.mongodb.net/postsapi').then(result => {
    app.listen(9090);
}).catch(err => console.log(err));
process.on('beforeExit', () => {
    console.log('closing');
    connection.close();
});