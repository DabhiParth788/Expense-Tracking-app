const mongoose = require("mongoose");
const { Schema } = mongoose;

const BudgetSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    amount: {
        type: Number,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category"
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Budget = mongoose.model("budget", BudgetSchema);
module.exports = Budget;
