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

// making sign up
// bcrypt is using for hashing 
app.post("/api/register", async (req, res) => {
    const { username, password: plainTextPassword } = req.body;

    if(!username || typeof username !== "string") {
        return res.json({ 
            status: "error",
            error: "Invalid username"
        });
    }

    if(!plainTextPassword || typeof plainTextPassword !== "string") {
        return res.json({ 
            status: "error",
            error: "Invalid password"
        });
    }

    if(plainTextPassword.length < 8) {
        return res.json({ 
            status: "error",
            error: "Password is too small, the password should be atleast 8 characters"
        });
    }

    // hashing a password
    const password = await bcrypt.hash(plainTextPassword, 10);

    try{
        const response = await User.create({
            username,
            password
        })
        console.log("User Created successfully: " ,response);
    } catch (error) {
        if(error.code === 11000) {
            return res.json({ 
                status: "error",
                error: "User name is alerady exist"
            });
        }
        throw error
    }
})  