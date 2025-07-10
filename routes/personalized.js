const express = require('express');
const router=express.Router();
const verifyToken= require('../Middleware/verifyToken');
const Ride = require('../Models/Ride');

router.get('/booked-rides', verifyToken, async (req, res) => {
     try{
    const rides = await Ride.find({bookings: {$elemMatch: {userId:req.userId} }}); 
    res.render('booked', {  rides:rides,   isLoggedIn:req.isLoggedIn,  username: req.username , userId:req.userId });
     }catch(err){
        console.log(err);
     }
});

module.exports=router;