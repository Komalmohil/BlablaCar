const jwt = require('jsonwebtoken');
const dotenv= require('dotenv');
dotenv.config();

module.exports =function (req,res,next){
  const token= req.cookies.token;
  if(!token){
    console.log("No token in cookie");
     req.isLoggedIn=false;
    return next();
  }
  try {
    const decoded = jwt.verify(token,process.env.secretKey);
    req.userId=decoded.id;
    req.username =decoded.username;
     req.isLoggedIn = true;
  }catch (err){
     req.isLoggedIn=false;
    console.log("Token error:", err);
    return res.redirect('/login');
  }
  next();
};