const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const companySchema = new Schema(
    {
    title:{
        type: String,
        required: true
    },
    creator:{
        type: String,
        required: true
        }
    },
    {timestamps: true}   
);

module.exports = mongoose.model('Company', companySchema);