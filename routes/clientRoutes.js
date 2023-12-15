const express = require('express')
const router = express.Router()
const { protectedRoute } = require('../middlewares/authMiddleWare')

const {registerClient,
    getSingleClient,
    getAllClients,
    deleteAClientInfo,
    updateClientInfo,} = require('../controllers/clientController')

router.post('/registerClient', protectedRoute, registerClient)
router.get('/client/:clientId', protectedRoute, getSingleClient)
router.get('/allClients', protectedRoute, getAllClients)
router.delete('/deleteClient/:clientId', protectedRoute, deleteAClientInfo)
router.put('/updateClient/:clientId', protectedRoute, updateClientInfo)

module.exports = router;