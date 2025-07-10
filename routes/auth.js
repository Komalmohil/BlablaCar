const express= require('express');
const router =express.Router();
const User= require('../Models/User');
const jwt =require('jsonwebtoken');
const verifyToken= require('../Middleware/verifyToken');
const sendMail = require('../Middleware/sendMail');

router.get('/', verifyToken,(req,res)=>{
    res.render('home',{   isLoggedIn:req.isLoggedIn,  username: req.username });
});
router.get('/login', verifyToken,(req, res)=>{
    console.log("Is Logged In:",req.isLoggedIn);
    console.log("Username:",req.username);
  
    res.render('login', {   isLoggedIn:req.isLoggedIn,  username:req.username  });
});


router.get("/login/email",(req,res)=>{
  res.render('email',{
    isLoggedIn: req.isLoggedIn,
    username: req.username
  }); 
});

router.post('/login/email',async (req,res)=> {
  const {email,password } = req.body;
  const user= await User.findOne({email,password});
  if (user) {
    const token= jwt.sign({ id: user._id,username: user.username },process.env.secretKey,{expiresIn:'1d'});
    res.cookie('token',token,{
      httpOnly: true,
      maxAge: 10000000000 
    });
    return res.redirect('/search');
  }
  res.send("Invalid user details");
});

router.post("/check-email",async (req,res)=>{
  const {email}=req.body;
  try {
    const existingUser =await User.findOne({email});
    if(existingUser){   res.json({exists:true}); } 
    else { res.json({exists:false}); }
  }catch (err){
    console.log("signup err:", err); 
    res.status(500).json({ error: 'Internal Server Error' });}
});

router.get("/signup",(req,res)=>{
   res.render("signup"); 
});

router.post('/signup', async (req,res)=>{
  const {email,username,phone,password}= req.body;
  try {
    const newUser= new User({email,username,phone,password});
    await newUser.save();
    console.log('User registered');

    res.render("home")
  } catch (err) {
    console.error('err');
    res.status(500).send('Error registering user');
  }
});


router.get("/forget",(req, res)=>{
    res.render('forget')   
 });

router.get('/forgot/:token',(req, res)=>{
  res.render('reset',{token:req.params.token});
});

router.post('/forget', async(req, res)=>{
  const {email} =req.body;
  const user=await User.findOne({ email });

  if (!user) return res.send("Invalid email");

  const secretKey=process.env.secretKey;
  const token= jwt.sign({ id: user._id,username:user.username},secretKey,{ expiresIn:'10m'});
  


  const resetLink= `http://localhost:${process.env.port}/forgot/${token}`;

  const result=await sendMail({
    to: email,
    subject: 'Reset Password Link',
    html: `<p>Click to reset password:</p>
        <button><a href="${resetLink}">Click Here</a><button>`
  });

  if(result.success){
    res.render("login");
  } else {
    res.send("Failed to send email.");
  }
});
router.get("/reset/:token",(req, res)=>{
  res.render('reset', {token: req.params.token, error: null });
});

router.post('/reset/:token',verifyToken, async (req, res) => {
  const {pass,confirmPass}= req.body;

  if(pass !==confirmPass){
    return res.send("pass donot match"); 
  }
  try{
    const user=await User.findById(req.userId);
    if (!user)return res.send("User not found");
    user.password = pass;
    await user.save();
    return res.render("email",{auth:true});
  } catch(err){
    console.error(err);
  }
});

router.get('/logout',(req, res)=> {
  res.clearCookie('token');
  res.redirect('/login');
});

router.get("/profile",(req,res)=>{
  res.redirect("profile")
})


module.exports =router;
