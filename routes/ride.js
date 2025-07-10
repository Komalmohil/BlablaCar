const express = require('express');
const router = express.Router();
const Ride = require('../Models/Ride');
const verifyToken= require('../Middleware/verifyToken');

router.get('/publish', (req, res)=>{
  res.render('ride'); 
});

router.post('/create-ride', async(req,res) => {
  const { location,destination, date,pickupPoint, dropoffPoint, pickupTime,seats, price, returnTrip,returnTripDone,later}=req.body;
//    if(typeof returnTrip !=='undefined') { returnTrip=false; }else{  returnTrip=true; }
//    if(typeof returnTripDone !=='undefined') { returnTripDone =fasle;}else{ returnTripDone =true; }
//    if(typeof later !=='undefined') {  later =false;  } else {  later =true; }

  try{
    const newRide= new Ride({ location,destination, date,pickupPoint, dropoffPoint, pickupTime,seats, price, returnTrip,returnTripDone,});
    await newRide.save();
    res.send('Ride published successfully!');
  } catch(err){
    console.error(err);
  }
});

router.get('/get-rides',async (req,res) =>{
 const min =new Date().toISOString().slice(0,10);
  const allRides= await Ride.find();
  const FilteredRides =allRides.filter(ride =>ride.date>=min);
  res.render('allrides',{rides: FilteredRides});
});


router.get('/ride/:locDest', async (req, res) => {
  try {
    const [location, destination] = req.params.locDest.split('-');
    const ride = await Ride.findOne({ location, destination });
    if (!ride) return res.status(404).send('Ride not found');
    res.render('details', {ride});
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.post('/book-ride', verifyToken, async (req, res) => {
  console.log(req.body);
  const { rideId,passengerName,passengersNo, phoneNumber } = req.body;
  try {
    const ride = await Ride.findById(rideId);
    //console.log(req.username);
    if(ride.seats<=0){
      return res.send("The seats are already")
    }

    if(passengersNo>ride.seats){
     return res.send(`<script> alert("Only ${ride.seats} seats are available"); </script>`);
    }

    ride.bookings.push({ name:passengerName,phoneNo:phoneNumber, count:passengersNo,username:req.username,userId: req.userId});
    
    ride.seats -= passengersNo;
    await ride.save();
    res.send(`Ride booked successfully by ${passengerName} now ${ride.seats} seats are left!`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error booking ride');
  }
});
// console.log("Cookies:", req.cookies); 
   // console.log(req.username);
router.get('/search',verifyToken,async (req,res) => {
  
 try {
    const rides=await Ride.find();
    res.render('search',{rides, isLoggedIn: req.isLoggedIn, username:req.username}); 
  }catch(err){
    console.error(err);
  }
});

module.exports=router;
