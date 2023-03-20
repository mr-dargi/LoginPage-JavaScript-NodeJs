const express = require("express"); 
const mongoose = require("mongoose");
const User = require("./models/user");
const bcrypt = require("bcryptjs");

// middleware & json parser
const app = express();
app.use(express.json());

// mongodb connection with mongoose
const dbURI = "mongodb://localhost:27017/users";

mongoose.connect(dbURI)
    .then(result => {
        app.listen(3000, () => {
            console.log("Listining on port 3000");
        })
    })
    .catch(err => console.log(err));

// listinig on port 3000


// routes of the application
app.get("/", (req, res) => {
    res.sendFile("./views/main.html", { root: __dirname });
})


// bcrypt is using for hashing 

app.post("/api/register", async (req, res) => {
    // hashing a password
    const { username, password: plainTextPassword } = req.body;


    const password = await bcrypt.hash(plainTextPassword, 10);

    try{
        const response = await User.create({
            username,
            password
        })
        console.log("User Created successfully: " ,response);
    } catch (error) {
        return res.json({ status: "error" });
    }

    res.json({ status: "ok" });
})