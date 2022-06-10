const Company = require('../models/company');
const axios = require('axios')

exports.findCompanies = async (req, res, send) => {
    const all_companies = await Company.find({}).select('-createdAt -updatedAt -__v');
    const total_companies = await Company.find().countDocuments();
    res.status(200).json({
        companies_list: all_companies,
        totalItems: total_companies
    });
}

exports.createCompany = async (req, res, send) => {
    const company_code = req.body.code.toLowerCase()
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
        const stock_register = axios.post('http://localhost:8000/api/stock', {
            code: company_code
        })
        res.status(200).send(response);
    } catch (error) {
        console.log(error);
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
        // stocks fetching from the other database
        const stocks = await axios.get('http://localhost:8000/api/stocks/' + company_code);
        let result = {
            ...company[0],
            stocksValue: stocks.data
        };
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
    }
}

exports.deleteCompany = async (req, res, send) => {
    const code = req.params.companycode.toLowerCase();
    const response = await Company.deleteOne({
        code: code
    })
    await axios.delete('http://localhost:8000/api/stocks/' + code);
    if (response.deletedCount === 0) {
        res.status(404).json({
            'message': 'no record found to be deleted'
        });
        return;
    }
    res.status(200).json({
        'message': code + ' is deleted from the database'
    });
}