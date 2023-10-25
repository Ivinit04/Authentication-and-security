//jshint esversion:6
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import ejs from "ejs";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.set("view engine" , "ejs");
app.use(bodyParser.urlencoded({extended: true}));

app.get("/" , (req ,res)=>{
    res.render("home");
})

app.get("/register" , (req , res)=>{
    res.render("register");
})

app.get("/login" , (req , res)=>{
    res.render("login");
})


app.listen(port , ()=>{
    console.log(`Server started on port ${port}`);
})