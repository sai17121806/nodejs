const express = require("express");
const app = express();
const bcryptjs = require("bcryptjs");
const userData = require("./UserDataSchema");
const nodemailer = require("nodemailer");

//Connecting Database
const database = "mongodb+srv://Sai5685:Sai568599@cluster.y3rescu.mongodb.net/MyDatabase?retryWrites=true&w=majority";
const mongoose = require("mongoose");
mongoose.connect(database)
        .then((success) => {
                console.log("Database Connected");
                app.listen(5000);
        })
        .catch((error) => {
                console.log(error);
        });


//Middleware
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("static"));

//Get Requests
let mailBool = 1;
let invalidEmailBool = 1;
let invalidPasswordBool = 1;
app.get("/", (req, res) => {
        res.render("HomePage");
});
app.get("/logIn", (req, res) => {
        setTimeout(() => {
                res.render("LogInActive", {
                        invalidEmailBool: 1,
                        invalidPasswordBool: 1
                });
        }, 100)
});
app.get("/signUp", (req, res) => {
        setTimeout(() => {
                res.render("SignUpActive", { mailBool: 1 });
        }, 100);
});
app.get("/forgotPassword", (req, res) => {
        setTimeout(() => {
                res.render("forgotPassword", { inputEmail, inputOTP, forgotEmailBool: 1, forgotOTPBool: 1 });
        }, 100);
});
app.get("/reload",(req,res)=>
{
        res.redirect("/");
})
//Post Requests
app.post("/logIn", (req, res) => {

        userData.find({
                inputEmail: req.body.inputEmail,
        })
                .then((success) => {
                        bcryptjs.compare(req.body.inputPassword, success[0].inputPassword, function (error, data) {
                                if (error) {
                                        console.log(error);
                                }
                                if (data) {
                                        res.redirect("/");
                                }
                                else {
                                        res.render("LogInActive", {
                                                invalidEmailBool: 1,
                                                invalidPasswordBool: 0
                                        });
                                }
                        });
                })
                .catch((error) => {
                        res.render("LogInActive", {
                                invalidEmailBool: 0,
                                invalidPasswordBool: 1
                        });
                });
});

let inputName;
let inputEmail;
let otpGenerate;
let otpBool = 1;
let inputOTP;
let inputPassword;
let forgotEmailBool = 1;
let forgotOTPBool = 1;
let storeMail;
var transporter1 = nodemailer.createTransport(
        {
                service: "gmail",
                auth:
                {
                        user: "venkatsaimail10@gmail.com",
                        pass: "amcy tlfy qzfy lvac"
                }
        }
);
var transporter2 = nodemailer.createTransport(
        {
                service: "gmail",
                auth:
                {
                        user: "venkatsaimail10@gmail.com",
                        pass: "amcy tlfy qzfy lvac"
                }
        }
);
var mailOptions1;
var mailOptions2;
app.post("/verifyEmail", (req, res) => {

        userData.find({
                inputEmail: req.body.inputEmail,
        })
                .then((success) => {
                        if(success[0].inputEmail==req.body.inputEmail)
                        res.render("SignUpActive", { mailBool: 0 });
                }).catch((fail) => {


                        inputName = req.body.inputName;
                        inputEmail = req.body.inputEmail;
                        otpGenerate = Math.floor(1000 + Math.random() * 9999);
                        console.log("otp ", otpGenerate);

                        mailOptions1 = {
                                from: "venkatsaimail10@gmail.com",
                                to: req.body.inputEmail,
                                subject: `${otpGenerate} is OTP to Sign Up`,
                                html: `<h3>Dear User</h3><br>
                <h4>Your OTP is ${otpGenerate}</h4>`
                        };
                        transporter1.sendMail(mailOptions1, (error, info) => {
                                if (error) {
                                        console.log(error);
                                }
                                else {
                                        console.log("OTP Sent");
                                }
                        });

                        res.render("ReloadSignUpActive", { inputName, inputEmail, inputOTP, inputPassword, otpBool: 1 });
                });
});
app.post("/verifyOTP", (req, res) => {

        if (req.body.inputOTP == otpGenerate) {
                req.body.inputName = inputName;
                req.body.inputEmail = inputEmail;
                inputOTP = req.body.inputOTP;
                inputPassword = req.body.inputPassword;
                bcryptjs.genSalt(10, function (error, Salt) {
                        if (error)
                                console.log(error);
                        bcryptjs.hash(req.body.inputPassword, Salt, function (err, Hashed) {
                                if (err)
                                        console.log(err)
                                req.body.inputPassword = Hashed;

                                const UserData = new userData(req.body);
                                UserData.save()
                                        .then((success) => {

                                        })
                                        .catch((error) => {
                                                console.log(error);
                                        });
                        });
                });
                res.redirect("/");
        }
        else {
                mailBool = 0;
                otpBool = 0;
                res.render("ReloadSignUpActive", { inputName, inputEmail, inputOTP, inputPassword, otpBool: 0 });
        }
});

app.post("/forgotVerifyEmail", (req, res) => {


        userData.find({
                inputEmail: req.body.inputEmail,
        })
                .then((success) => {
                        if (success[0].inputEmail == req.body.inputEmail) {
                                inputEmail = req.body.inputEmail;
                                storeMail = req.body.inputEmail;
                                otpGenerate = Math.floor(1000 + Math.random() * 9999);
                                console.log("otp ", otpGenerate);
                                mailOptions2 = {
                                        from: "venkatsaimail10@gmail.com",
                                        to: req.body.inputEmail,
                                        subject: `${otpGenerate} is OTP to Sign Up`,
                                        html: `<h3>Dear User</h3><br>
                <h4>Your OTP is ${otpGenerate}</h4>`
                                };
                                transporter2.sendMail(mailOptions2, (error, info) => {
                                        if (error) {
                                                console.log(error);
                                        }
                                        else {
                                                console.log("OTP Sent");
                                                res.render("ReloadForgotPassword", { inputEmail, inputOTP, forgotEmailBool: 1, forgotOTPBool: 1 });
                                        }
                                });
                        }
                        else {

                                res.render("forgotPassword", { inputEmail, inputOTP, forgotEmailBool: 0, forgotOTPBool: 1 });
                        }

                }).catch((fail) => {
                        res.render("forgotPassword", { inputEmail, inputOTP, forgotEmailBool: 0, forgotOTPBool: 1 });
                });
});

app.post("/forgotVerifyOTP", (req, res) => {
        if (req.body.inputOTP == otpGenerate) {

                res.render("createNewPassword", { inputEmail, inputOTP, forgotEmailBool: 1, forgotOTPBool: 1 });
        }
        else {
                res.render("forgotPassword", { inputEmail, inputOTP, forgotEmailBool: 1, forgotOTPBool: 0 });
        }
});

app.post("/createNewPassword", (req, res) => {

        bcryptjs.genSalt(10, function (error, Salt) {
                if (error)
                        console.log(error);
                bcryptjs.hash(req.body.inputPassword, Salt, function (err, Hashed) {
                        if (err)
                                console.log(err)
                        req.body.inputPassword = Hashed;
                        userData.updateOne({ inputEmail: storeMail }, { inputPassword: req.body.inputPassword }).then((success) => {
                                console.log("Updated");
                                res.redirect("/");
                        }).catch((error) => {
                                console.log(error);
                        });
                });
        })

});