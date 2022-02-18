
var express = require('express'),
app = express(),
bodyParser = require('body-parser'),
mongoose = require('mongoose'),
passport = require('passport'),
LocalStrategy = require('passport-local'),
flash = require('connect-flash'),
session = require('express-session'),
cookieParser = require('cookie-parser'),
expressSanitizer = require('express-sanitizer'),
methodOverride = require('method-override'),
Student = require('./public/schema/studentschema'),
Reg = require('./public/schema/regschema');

//APP CONFIG
mongoose.connect("mongodb://localhost/studentevents");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
app.use(cookieParser('secret'));


// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "VPC is the best!!",
    resave: false,
    saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Student.authenticate()));
passport.serializeUser(Student.serializeUser());
passport.deserializeUser(Student.deserializeUser());


app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});



app.get("/",(req,res)=>{
    res.render("landing");
});


app.get("/login/user", function (req, res) {
    res.render("login");
});


app.get("/register/user", function (req, res) {
    res.render("register");
});


//register
app.post("/register/user", function (req, res) {

    var newUser = new Student({
        username: req.body.username
    });

    Student.register(newUser, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res.render("register/user", { error: err.message });
        }
        passport.authenticate("local")(req, res, function () {
            req.flash("success", "Successfully Signed Up! Nice to meet you " + req.body.username);
            res.redirect("/login/user");
        });
    });
});

//login
app.post("/login/user", passport.authenticate("local",

    {
        successRedirect: "/landing/user",
        failureRedirect: "/login/user",
        failureFlash: true,
        successFlash: "Login Success!"

    }), function (req, res) {

    });

// logout route
app.get("/logout/user", function (req, res) {
    req.logout();
    req.flash("success", "See you later!");
    res.redirect("/");
});


app.get("/landing/user",(req,res)=>{
    res.render("eventRegistration")
});


app.post("/regs",(req,res)=>{
    req.body.Reg.body = req.sanitize(req.body.Reg.body);
        Reg.create(req.body.Reg, function (err, newReg) {
            if (err) {
                res.render("/landing/user");
            }
            else {
                //then, redirect to index
                res.redirect("/logout/user");
            }
        });
});



//admin
app.get("/admin", function (req, res) {
    res.render("admin");
});

app.post("/admin", function (req, res) {

    if (req.body.username == "rameshbabu" && req.body.password == "12345") {
		req.flash("success", "Login Success!");
        res.redirect("/userslist");
    }
    else {
		req.flash("error", "Password or username is incorrect!");
        res.redirect("/admin");
    }
});


//admin students list
app.get("/userslist", function (req, res) {
    Reg.find({}, function (err, allusers) {
        if (err) {
            console.log(err);
        } else {
            res.render("userslist.ejs", { user: allusers });
        }
    });

});

//Delete Route 
app.delete("/userslist/:id", function (req, res) {

    Reg.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.redirect("/userslist");
        } else {
            //redirect somewhere
            res.redirect("/userslist");
        }
    })
});


app.listen(process.env.PORT || 3000, process.env.IP, () => {
    console.log("server is started");
});


