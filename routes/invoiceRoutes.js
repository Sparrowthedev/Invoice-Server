const express = require('express')
const { protectedRoute } = require('../middlewares/authMiddleWare')
const { addInvoice, getALlInvoice, getSingleInvoice, updateInvoice, deleteInvoice } = require('../controllers/invoiceController')
const router = express.Router()

router.post('/addInvoice', protectedRoute, addInvoice);
router.get('/allInvoice', protectedRoute, getALlInvoice);
router.get('/singleInvoice/:invoiceId', protectedRoute, getSingleInvoice);
router.put('/updateInvoice/:invoiceId', protectedRoute, updateInvoice)
router.delete('/deleteInvoice/:invoiceId', protectedRoute, deleteInvoice)


module.exports = router