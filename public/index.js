const express=require('express');
const mongoose=require('mongoose');
const path=require("path");
var bodyParser = require("body-parser")
const mongodb='mongodb://127.0.0.1/user';
const port=5000;
const app=express();
mongoose.connect(mongodb,{ useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
    console.log("connected succesfully");
}).catch((err)=>{
    console.log("error occurs",err);
})

    app.listen(5000,()=>{
    console.log("server is running");
})
app.use(bodyParser.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended:true
}))
 
    app.use(express.static('./public'))
    app.get('*',function (req,res) {
        res.sendfile('signup.html');
        })
        var db = mongoose.connection;

        db.on('error',()=>console.log("Error in Connecting to Database"));
        db.once('open',()=>console.log("Connected to Database"))
        
        app.post("/submit",(req,res)=>{
            var name = req.body.name;
            var email = req.body.email;
            var password = req.body.password;
        
            var data = {
                "name": name,
                "email" : email,
                "password" : password
            }
        
            db.collection('users').insertOne(data,(err,collection)=>{
                if(err){
                    throw err;
                }
                console.log("Record Inserted Successfully",collection);
            });
        
            return res.redirect('signup.html')
        
        })