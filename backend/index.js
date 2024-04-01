const connectToMongo = require("./db");
const express = require("express");
const { json } = require("express");


const app = express();
const port = 5500;

app.use(json());

app.use("/api/auth", require("./routes/auth.js"));
// app.use("/api/auth", require("./routes/expenses"));

app.get("/", (req, res) => {
    res.send("Hello Dobuuu🤭");
})

app.listen(port, () => {
    console.log(`expenseTrackerApp - Backend Listening on port ${port}`);
})

connectToMongo();