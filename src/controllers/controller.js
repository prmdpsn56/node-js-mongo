const Company = require('../models/company');

exports.getResponse = async (req,res,send) => {
    res.status(200).send({
        message:"response returned from the stock route"
    })
}

exports.createCompany = async (req,res,send) => {
    const post = new Company({
        title:req.body.title,
        creator: req.body.creator
    })
    try {
        const response = await post.save();
        res.status(200).send(response);
    } catch (error) {
        console.log(error);
    }
}