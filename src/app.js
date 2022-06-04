const express = require('express');
const companyRoutes = require('./routes/routes');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE,OPTIONS');
    // define the settings of the below headers
    // res.setHeader('Access-Control-Allow-Headers','Content-Type,Authorization');
    next();
})
app.use('/company',companyRoutes);


app.use('/',(req,res)=>{
    res.status(200).send({
        message:'mongo db is connected to the application'
    })
})

mongoose.connect( 'mongodb+srv://prmdpsn56:Paramdeep12345@cluster0.znsl8.mongodb.net/postsapi').then(result => {
    app.listen(9090);
  }).catch(err => console.log(err));