const express = require('express');
const controllers = require('../controllers/controller');
const router = express.Router();

/**  
 * @swagger
 * /company/register:
 *   post:
 *     description: Register a new company
 *     parameters:
 *      -  in: body
 *         name: user
 *         description: The user to create.
 *         schema:
 *          type: object
 *          properties:
 *             code:
 *               type: string
 *             name:
 *               type: string
 *             ceo:
 *               type: string
 *             turnover:
 *               type: string
 *             website:
 *               type: string
 *             exchange:
 *               type: string
 *     responses:
 *       200:
 *         description: Success
 *       409:
 *          description: company already exists
 *       400:
 *          description: API not working properly, team looking into it
 */
router.post('/register', controllers.createCompany);

/** 
 * @swagger
 * /company/getall:
 *   get:
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: API not working properly
 */
router.get('/getall', controllers.findCompanies);


/**  
 * @swagger
 * /company/info/{companycode}:
 *   get:
 *     description: Delete company and related api stocks
 *     parameters:
 *        - in: path
 *          name: companycode 
 *          required: true
 *          description: The company code.
 *          schema:
 *              type: string
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *          description: API issue
 *       400:
 *          description: No company found with this name
 */
router.get('/info/:companycode', controllers.findCompany);

/**  
 * @swagger
 * /company/delete/{companycode}:
 *   delete:
 *     description: Delete company and related api stocks
 *     parameters:
 *        - in: path
 *          name: companycode 
 *          required: true
 *          description: The company code.
 *          schema:
 *              type: string
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *          description: no record found to be deleted
 */
router.delete('/delete/:companycode', controllers.deleteCompany);

module.exports = router;