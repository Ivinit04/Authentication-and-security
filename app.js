//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

app.use(express.static("public"));
app.set("view engine" , "ejs");
app.use(bodyParser.urlencoded({extended: true}));

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})

const User = new mongoose.model("User" , userSchema);

app.get("/" , (req ,res)=>{
    res.render("home");
})

app.get("/register" , (req , res)=>{
    res.render("register");
})

app.get("/login" , (req , res)=>{
    res.render("login");
})

app.post("/register" , async (req , res)=>{
    // console.log(req.body);
    const userPassword = req.body.password;
    const hashPassword = await bcrypt.hash(userPassword , 10);   //hashed password
    const user = new User({
        email: req.body.username,
        password: hashPassword  
    })
    user.save();
    res.render("secrets");
})

app.post("/login" , async (req , res)=>{
    // console.log(req.body);
    const userEmail = req.body.username;
    const userPassword = req.body.password;
    const userExists = await User.findOne({email: userEmail});
    
    if(userExists) {
        if(await bcrypt.compare(userPassword , userExists.password)){   //comparing hashed password with the password user entered
            res.render("secrets");
        }
        else{
            res.redirect("login");
        }
    }else{
        console.log("user not exists");
    }
});

app.listen(port , ()=>{
    console.log(`Server started on port ${port}`);
})