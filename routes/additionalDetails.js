const express=require('express');
const { userDetails, campusDetails } = require('../controllers/additionalDetails');
const router=express.Router();
const isAuthenticated=require('../middlewares/isAuthenticated')

router.post('/user/details',isAuthenticated,userDetails);
router.post('/campus/details',campusDetails)
module.exports=router;