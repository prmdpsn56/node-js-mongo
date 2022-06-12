const express = require('express');
const companyRoutes = require('./routes/routes');
const mongoose = require('mongoose');
const amqp = require('amqplib');
const {v4:uuidvv4} = require('uuid');

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
        const channelMain = await connection.createChannel();
        return channelMain;
    } catch (err) {
        console.log(err);
    }
}

exports.sendMessageToQueue = async (queueName,message) => {
    let channel = await amqpConnection();
    channel.sendToQueue(queueName,Buffer.from(message));
}

//RPC Test

exports.rpc = async (companyCode) => {

    let result;
    let channel = await amqpConnection();
    q = await channel.assertQueue('',{exclusive: true});
    const uuid = uuidvv4();

    try {
        channel.sendToQueue('rpc_queue',Buffer.from(companyCode),{
        replyTo: q.queue,
        correlationId: uuid
    });    

    await channel.consume(q.queue,msg => { 
        if(msg.properties.correlationId === uuid){
                result = msg.content.toString();
                console.log(result);
        }
    },{noAck:true});
    return result;
    } catch (error) {
        console.log(error);
    }

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