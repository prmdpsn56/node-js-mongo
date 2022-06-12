const Company = require('../models/company');
const axios = require('axios')
const amqpFunctions = require('../app');

exports.findCompanies = async (req, res, send) => {
    const all_companies = await Company.find({}).select('-createdAt -updatedAt -__v');
    const total_companies = await Company.find().countDocuments();
    res.status(200).json({
        companies_list: all_companies,
        totalItems: total_companies
    });
}

exports.createCompany = async (req, res, send) => {
    const company_code = await req.body.code.toLowerCase()
    const company_exists = await Company.find({
        code: company_code
    }).countDocuments();

    if (company_exists) {
        //error code 409 for double conflict
        res.status(409).json({
            'message': 'company already exists, please check your entries'
        });
        return;
    }
    const company = new Company({
        code: company_code,
        name: req.body.name,
        ceo: req.body.ceo,
        turnover: req.body.turnover,
        website: req.body.website,
        exchange: req.body.exchange
    });
    try {
        //create a default company stock
        const response = await company.save();
        amqpFunctions.sendMessageToQueue('company_created', company_code);
        res.status(200).send(response);
    } catch (error) {
        console.log(error);
        res.status(400).json({response:'API not working properly, team looking into it'});
    }
}

exports.findCompany = async (req, res, send) => {
    const company_code = req.params.companycode.toLowerCase();
    try {
        const company = await Company.find({
            code: company_code
        }).lean();
        if (company.length === 0) {
            res.status(404).json({
                'message': 'No company found with this name'
            })
            return;
        }

        let response = await amqpFunctions.rpc(company_code)
        let stocks = JSON.parse(response)
        let result = {
            ...company[0],
            stocksValue: stocks
        };
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({
            'message': 'problem with the api, team looking into it'
        });
    }
}

exports.deleteCompany = async (req, res, send) => {
    const company_code = req.params.companycode.toLowerCase();
    const response = await Company.deleteOne({
        code: company_code
    })
    amqpFunctions.sendMessageToQueue('company_deleted', company_code);
    if (response.deletedCount === 0) {
        res.status(404).json({
            'message': 'no record found to be deleted'
        });
        return;
    }
    res.status(200).json({
        'message': company_code + ' is deleted from the database'
    });
}