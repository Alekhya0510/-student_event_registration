var mongoose = require("mongoose"),
    passportLocalmongoose = require("passport-local-mongoose");
var StudentSchema = new mongoose.Schema({
    username : String,
    password : String,
});

StudentSchema.plugin(passportLocalmongoose);
module.exports = mongoose.model("Student", StudentSchema);