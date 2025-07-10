const express = require('express');
const mongoose = require('mongoose');
const user = require('./Models/User');
const path = require('path');
const first = require('./routes/auth');
require('dotenv').config();

const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/blabla')
.then(()=>{
    console.log("connected")
app.listen(3000, () => console.log(`Server is running`))
})
.catch((err)=>{console.log("err")})

app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({ extended: true }));
app.set('view engine','ejs');
app.use(express.json());

const authRoute= require('./routes/auth');
app.use('/',authRoute);

const rideRoutes= require('./routes/ride');
app.use('/',rideRoutes);

const userRoutes= require('./routes/personalized');
app.use('/',userRoutes);