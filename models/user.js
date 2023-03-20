const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}, { collection: "username&password" });


const model = mongoose.model("UserScheam", UserSchema);

module.exports = model;