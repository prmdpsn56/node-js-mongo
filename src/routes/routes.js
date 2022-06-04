const express = require('express');
const controllers = require('../controllers/controller');
const router = express.Router();

//Register Companies
router.post('/register',controllers.createCompany);

//Find Companies
router.get('/getall',controllers.findCompanies);

//get particular company record
router.get('/info/:companycode',controllers.findCompany);

//delete the company record
router.delete('/delete/:companycode',controllers.deleteCompany);

module.exports = router;