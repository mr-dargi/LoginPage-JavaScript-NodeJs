const express = require("express");


const app = express();

app.listen(3000, () => {
    console.log("Listining on port 3000");
})

app.get("/", (req, res) => {
    res.sendFile("./views/main.html", { root: __dirname });
})