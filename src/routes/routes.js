const express = require('express');
const controllers = require('../controllers/controller');
const router = express.Router();


router.get('/stock',controllers.getResponse);
router.post('/createCompany',controllers.createCompany)

// you can use this below export if this router is an extension of other route
module.exports = router;