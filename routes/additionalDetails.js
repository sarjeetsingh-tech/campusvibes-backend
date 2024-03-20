const express=require('express');
const { userDetails, campusDetails } = require('../controllers/additionalDetails');
const router=express.Router();

router.post('/user/details',userDetails);
router.post('/campus/details',campusDetails)




module.exports=router;