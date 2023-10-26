//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();
const port = 3000;

app.use(express.static("public"));
app.set("view engine" , "ejs");
app.use(bodyParser.urlencoded({extended: true}));

//Initialize session
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false
}));

//Initialize passport
app.use(passport.initialize());
//Managing login sessions using passport
app.use(passport.session());

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(passportLocalMongoose);  //salt and hash password and save users into mongoDB database

const User = new mongoose.model("User" , userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/" , (req ,res)=>{
    res.render("home");
})

app.get("/register" , (req , res)=>{
    res.render("register");
})

app.get("/login" , (req , res)=>{
    res.render("login");
})

app.get("/secrets" , (req , res)=>{
    if(req.isAuthenticated()){
        res.render("secrets");
    } else{
        res.redirect("/login");
    }
})

app.get("/logout" , (req , res)=>{
    req.logout((err) => {
        if (err) {
            // Handle any logout errors, e.g., by showing an error message or redirecting to an error page.
            console.error(err);
        }
        // Redirect to the desired page (e.g., the home page) after successful logout.
        res.redirect("/");
    });
})

app.post("/register" , async (req , res)=>{
    // console.log(req.body);
    const user = await User.register({username: req.body.username} , req.body.password);
    // If registration is successful, authenticate the user
    passport.authenticate("local")(req ,res , ()=>{
        res.redirect("/secrets");
    })
})

app.post("/login", passport.authenticate("local", {
    successRedirect: "/secrets",  // Redirect to this route on successful login
    failureRedirect: "/login",   // Redirect to this route on failed login
}));

app.listen(port , ()=>{
    console.log(`Server started on port ${port}`);
})