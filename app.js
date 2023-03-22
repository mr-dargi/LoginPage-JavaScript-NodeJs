const express = require("express"); 
const mongoose = require("mongoose");
const User = require("./models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "";  // your secret key

// middleware & json parser
const app = express();
app.use(express.json());

// mongodb connection with mongoose
const dbURI = "mongodb://localhost:27017/users";

mongoose.connect(dbURI)
    .then(result => {
        // listinig on port 3000
        app.listen(3000, () => {
            console.log("Listining on port 3000");
        })
    })
    .catch(err => console.log(err));


// routes of the application
app.get("/signUp", (req, res) => {
    res.sendFile("./views/main.html", { root: __dirname });
})

app.get("/login", (req, res) => {
    res.sendFile("./views/login.html", { root: __dirname });
})

app.get("/change-password", (req, res) => {
    res.sendFile("./views/change-password.html", { root: __dirname });
})

// changing a password page
app.post("/api/change-password", async (req, res) => {
    const { token, newpassword } = req.body;

    if(!newpassword || typeof newpassword !== "string") {
        return res.json({ 
            status: "error",
            error: "Invalid password"
        });
    }

    if(newpassword.length < 8) {
        return res.json({ 
            status: "error",
            error: "Password is too small, the password should be atleast 8 characters"
        });
    }


    try {
        const user = jwt.verify(token, JWT_SECRET);

        const _id = user.id;

        const hashedPassword = await bcrypt.hash(newpassword, 10);
        await User.updateOne({ _id }, {
            $set: { password: hashedPassword }
        })

        res.json({
            status: "ok"
        })
    } catch (error) {
        res.json({
            status: "error",
            error: ":))"
        })
    }

})

// making a login page
app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username }).lean();

    if(!user) {
        res.json({
            status: "error",
            error: "Invalid Username/Password"
        })
    }

    if (await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({
            id: user._id,
            username: user.username
        }, 
        JWT_SECRET
        )

        res.json({ status: "ok", data: token });
    } else {
        res.json({
            status: "error",
            error: "Invalid Username/Password"
        })
    }
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