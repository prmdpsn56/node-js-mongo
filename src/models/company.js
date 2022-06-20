const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const companySchema = new Schema(
    {
    code:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
        },
    ceo:{
        type: String,
        required: true
        },
    turnover:{
        type: String,
        required: true
        },
    website:{
        type: String,
        required: true
        },
    exchange:{
        type: String,
        required: true
        }
    },
    {timestamps: true}   
);

module.exports = mongoose.model('Company', companySchema);