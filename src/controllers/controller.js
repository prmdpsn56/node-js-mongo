const Company = require('../models/company');

exports.findCompanies = async (req,res,send) => {
    const all_companies = await Company.find({}).select('-createdAt -updatedAt -__v');
    const total_companies = await Company.find().countDocuments();
     res.status(200).json({
        companies_list: all_companies,
        totalItems: total_companies
    });
}

exports.createCompany = async (req,res,send) => {
    const company_exists = await Company.find({code:req.body.code}).countDocuments();
    if(company_exists){
        //error code 409 for double conflict
        res.status(409).json({'message':'company already exists, please check your entries'});
        return;
    }
    const company_code =  req.body.code.toLowerCase();
    const company = new Company({
        code: company_code,
        name: req.body.name,
        ceo: req.body.ceo,
        turnover: req.body.turnover,
        website: req.body.website,
        exchange: req.body.exchange
    });
    try {
        const response = await company.save();
        res.status(200).send(response);
    } catch (error) {
        console.log(error);
    }
}

exports.findCompany = async (req,res,send) => {
        const code = req.params.companycode.toLowerCase();
        try {
            const company = await Company.find({code:code});
            if(company.length === 0){
                res.status(404).json({'message':'No company found with this name'})
                return;
            }
            res.status(200).json({'company':company});
            
        } catch (error) {
            console.log(error);
        }
}

exports.deleteCompany = async (req,res,send) => {
        const code = req.params.companycode.toLowerCase();
        console.log(code);
        const response = await Company.deleteOne({code:code})
        if(response.deletedCount === 0){
            res.status(404).json({'message':'no record found to be deleted'});
            return;
        }
        res.status(200).json({'message': code + ' is deleted from the database'});
}

