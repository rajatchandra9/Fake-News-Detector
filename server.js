const express= require("express");
var unirest = require("unirest");
const {spawn} = require('child_process');
const bp= require("body-parser");
const bcrypt=require("bcrypt-nodejs");
const cors=require("cors");
const mongoose=require("mongoose");
const app = express();
const nodemailer = require('nodemailer');
const crypto=require("crypto-extra");
const path=require("path");
require("dotenv/config");
app.use(bp.json());

const whitelist=["http://localhost:5000","http://localhost:3000","https://fakenewsdetectorbyhra.herokuapp.com"];
const corsopt={
    origin: function (origin,callback){
        console.log("Origin of request "+origin);
        if(whitelist.indexOf(origin) !== -1 || !origin){
            console.log("Origin acceptable");
            callback(null,true);
        }else{
            console.log("ORIGIN REJECTED");
            callback(new Error("Not allowed by CORS"));
        }
    }
}
app.use(cors(corsopt));

mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://fakeNews:"+process.env.MOngo_atlas_pwd+"@cluster0.mx17g.mongodb.net/fndUsers?retryWrites=true&w=majority",{
    useUnifiedTopology: true,
    useNewUrlParser: true
})
mongoose.connection.on("connected",()=>{
    console.log("Mongoose is connected!!!");
})
const User=require("./usermodel");
app.get('/',(req,res)=>{
    res.json("home");
})
app.post('/signin/detect/:id', (req, res) => {
    const {news}=req.body;
    var dataToSend;
    // spawn new child process to call the python script
    console.log(news);
    const python = spawn('python', ['./predict.py',news]);
    // collect data from script
    python.stdout.on('data', function (data) {
     console.log('Pipe data from python script ...');
     dataToSend = data.toString();
    });
    // in close event we are sure that stream from child process is closed
    python.on('close', (code) => {
    console.log(`child process close all stdio with code ${code}`);
    // send data to browser
    let isfake="";
    if(dataToSend==="The given statement is False"){
        isfake="yes";
    }
    else{
        isfake="no";
    }
    res.json({msg:dataToSend,fakeis:isfake});
    });
    
   })
app.post("/signin",(req,res)=>{
    const {email,password}=req.body;
    User.find({email:email})
    .exec()
    .then(sameUser=>{
        if(sameUser.length<1){
            return res.json("No Such User Exists");
        }
        else{
            bcrypt.compare(password,sameUser[0].password, function(err, result) {
               if(result){
                   console.log("Successful log in",sameUser[0].email);
                   return res.json({
                       msg:"Successful",
                       data:{
                           name:sameUser[0].name,
                           _id:sameUser[0]._id
                       }
                   });
               }
               else{
                res.json("User not found")
               }
            });       
        }
    })
    .catch(err=>console.log(err));
})
app.get("/newsfeed/:que",(req,res)=>{
    var apireq = unirest("GET", "https://bing-news-search1.p.rapidapi.com/news/search");
    apireq.query({
        "q": req.params.que,
        "freshness": "Day",
        "textFormat": "Raw",
        "safeSearch": "Off"
    });
    
    apireq.headers({
        "x-bingapis-sdk": "true",
        "x-rapidapi-key": process.env.RAPIDAPI_KEY,
        "x-rapidapi-host": "bing-news-search1.p.rapidapi.com",
        "useQueryString": true
    });
    
    
    apireq.end(function (result) {
        if (result.error) throw new Error(result.error);
        console.log(result.body.value);
        res.json(result.body);
        // console.log(res.body);
    });
});
app.post("/reset/:tokenid",(req,res)=>{
    User.find({resetPasswordToken:req.params.tokenid})
    .exec()
    .then((user)=>{
        if (user.length<1) {
            console.log("not there");
            console.error('Token not in database');
            res.json('Token not found'); 
        }
        else if(Date.now()>user[0].resetPasswordExpires){
            console.log("Date crossed");
            user[0].resetPasswordToken="";
            user[0].save();
            res.json('Token not in db');
        }
        else{
            var validPass=/^[0-9a-zA-Z]+$/;
            if(req.body.newPass.length<6 || !(validPass.test(req.body.newPass))){
                res.status(409).json("Unauth");
            }
            bcrypt.hash(req.body.newPass, null, null, function(err, hash) {
                if(err){
                    console.log("Encryption error");
                    return res.json("Password enc err");
                }
                else{
                    user[0].password=hash;
                    user[0].save();
                    console.log("Password has been set");
                    return res.json("Done");
                } 
            });

        } 
    });
});
app.post("/reset",(req,res)=>{
    if (req.body.email === '') {
        res.status(400).json('email required');
    }    
    console.log(`${req.protocol}://${req.get('host')}${req.originalUrl}`);
    console.error(req.body.email);
    console.log(req.body.linkForReset);
    User.find({email:req.body.email})
    .exec()
    .then((user) => {
        console.log(user);
        if (user.length<1) {
            console.log("not there");
          console.error('email not in database');
          res.json('email not in db');
        } else {
          const token = crypto.randomBytes(20).toString("hex");
          user[0].resetPasswordToken=token;
          user[0].resetPasswordExpires=Date.now() + 3600000;
          user[0].save();
        //   setTimeout(()=>{
        //         const expToken = crypto.randomBytes(20).toString("hex");
        //         console.log("expired",expToken)
        //         user[0].resetPasswordToken=expToken;
        //         user[0].save();
        //         console.log("Timed out");
        //   },600000);
        //   User.update({email:req.body.email},{$set:{
        //     resetPasswordToken: token,
        //     resetPasswordExpires: Date.now() + 3600000,
        //   }});
          var transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
              user: `${process.env.EMAIL_ADDRESS}`,
              pass: `${process.env.EMAIL_PASSWORD}`
            }
          });
          const mailOptions = {
            from: 'fakenewdetectorinc@gmail.com',
            to: req.body.email,
            subject: 'Link To Reset Password',
            text:
              'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n'
              + 'Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n'
              + `${req.body.linkForReset}/${token}\n\n`
              + 'If you did not request this, please ignore this email and your password will remain unchanged.\n',
          };
  
          console.log('sending mail');
  
          transporter.sendMail(mailOptions, (err, response) => {
            if (err) {
              console.error('there was an error: ', err);
            } else {
              console.log('here is the res: ', response);
              res.status(200).json('recovery email sent');
            }
          });
        }
      }); 
})
app.post("/register",(req,res)=>{
    const {email,name,password}=req.body;
    var alphaNum=/^[0-9a-zA-Z]+$/;
    if(email==="" || name==="" || password===""){
        res.status(409).json("Blank Error");
    }
    else if(password.length<6 || !(alphaNum.test(password))){
        res.status(409).json("Password Error");
    }
    else{
        User.find({email:email})
        .exec()
        .then(sameUser=>{
            if(sameUser.length>=1){
                return res.status(409).json("Email Already Used");
            }
            else{
                bcrypt.hash(password, null, null, function(err, hash) {
                    if(err){
                        return res.json("Invalid Password");
                    }
                    else{
                        const newUser=new User({
                            _id:new mongoose.Types.ObjectId(),
                            name:name,
                            email:email,
                            password:hash,
                            resetPasswordToken:"",
                            resetPasswordExpires:Date.now()
                        });
                        newUser.save()
                        .then(result=>{
                            console.log("Succesfully registered as ",result.email);
                            res.json({
                                email:result.email
                            });
                        })
                        .catch(err=>console.log(err));
                        // res.json({
                        //     email:newUser.email
                        // });
                    }
                });
            }
        })   
    }
})
if(process.env.NODE_ENV == "production"){
    app.use(express.static("client/build"));
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,"client","build","index.html"));
    })
}
const PORT=process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`App is running on port ${PORT}`);
})
