const express = require("express"); 
const mongoose = require("mongoose");
const User = require("./models/user");

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


app.post("/api/register", (req, res) => {
    // console.log(req.body);
    
    res.json({ status: "ok" });
})