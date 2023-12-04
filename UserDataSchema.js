const mongoose = require("mongoose");
const Data = new mongoose.Schema({
    inputName:
    {
        type:String,
        required:true
    },
    inputEmail:
    {
        type: String,
        required: true
    },
    inputPassword:
    {
        type: String,
        required: true
    }
});
const data = mongoose.model("UserData", Data);
module.exports = data;