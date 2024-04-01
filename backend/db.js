const mongoose = require('mongoose')

const mongoURL = "mongodb://127.0.0.1:27017/expenseTrackingApp";

const connectToMongo = async () => {
    await mongoose.connect(mongoURL);
    console.log("Connected Successfully!")
}

module.exports = connectToMongo;