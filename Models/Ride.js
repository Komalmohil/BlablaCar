const mongoose = require('mongoose');

const rideSchema=new mongoose.Schema({
  location: String,
  destination: String,
  date : String,
  pickupPoint: String,
  dropoffPoint: String,
  pickupTime: String,
  seats : Number,
  price: Number,
  returnTrip: {type: Boolean,default:false },
  returnTripDone: { type: Boolean, default:false },
  createdAt:{ type:Date, default:Date.now },
  bookings: [  
    { username: String,
      userId:String,
      name: String ,
      count: Number,
      phoneNo: Number   }
]

});

module.exports=mongoose.model('Ride',rideSchema);
