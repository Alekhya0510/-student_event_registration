var mongoose = require("mongoose");
   
var RegSchema = new mongoose.Schema({
    name : String,
    reg : String,
    branch : String,
    year: String,
    event: String,
    venue : String,
    datefrom: String,
    dateto : String,
});


module.exports = mongoose.model("Reg", RegSchema);