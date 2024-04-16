const express = require('express');
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const fetchUser = require("../middleWare/fetchUser")

const JWT_SECRET = "maruDobuuu<3=RadhaRani<3";


// Creating new user
router.post(
    "/createUser",
    [
        body("name", "Name should be of at least 3 char.").isLength({ min: 3 }),
        body("email", "Invalid Email Address.").isEmail(),
        body("password", "Password must be of 8 char long.").isLength({ min: 8 })
    ],
    async (req, res) => {
        let success = false;
        const error = validationResult(req);
        if (!error.isEmpty()){
            return res.status(400).json({ success, error: error.array() });
        }
        try {
            // check is user already exists
            let user = await User.findOne({ email: req.body.email });
            if (user) {
                return res.status(400).json({ success, error: "Sorry, a user with same email already exist!" });
            }

            const salt = await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(req.body.password, salt);

            // create new user

            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                city: req.body.city,
                password: secPass
            });

            const data = {
                user: {
                    id: user.id
                }
            };

            // sending token as response
            const authToken = jwt.sign(data, JWT_SECRET);
            success = true;
            res.json({ success, authToken });
        } catch (error) {
            console.error(error.massage);
            res.status(500).sent("Internal Server Error!");
        }
    }
);

// Login user
router.post(
    "/login",
    [
        body("email", "Enter a valid email").isEmail(),
        body("password", "Password can't be blank").exists()
    ],
    async (req, res) => {
        let success = false;
        // check validation
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({ success, error: error.array() });
        }

        const { email, password } = req.body;
        try {
            // find user with same email
            let user = await User.findOne({ email });

            // if user not found
            if (!user) {
                return res.status(400).json({ success, error: "Please try to login with correct credential" });
            }

            const passwordCompare = await bcrypt.compare(password, user.password);
            if (!passwordCompare) {
                return res.status(400).json({ success, error: "Please try to login with correct credential" });
            }

            const data = {
                user: {
                    id: user.id
                }
            };

            // send token
            const authToken = await jwt.sign(data, JWT_SECRET);
            success = true;
            return res.json({ success, authToken });
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal server error!");
        }
    }
);

// Change User Password
router.put("/updatePassword", [
    body("password", "Should not be empty!").exists(),
    body("newPassword", "Password must be of 8 char long.").isLength({ min: 8 })
], fetchUser, async (req, res) => {
    let success = false;
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({ success, error: error.array() });
    }

    const { password, newPassword } = req.body;
    try {
        let user = await User.findById(req.user.id);

        const passwordCompare = await bcrypt.compare(password, user.password);
        if(!passwordCompare){
            return res.status(400).json({ success, error: "Please try to login with correct credential" });
        }

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(newPassword, salt);

        user = await User.findByIdAndUpdate(user.id, {
            $set: { password: secPass }
        }, { new: true });

        success = true;

        return res.json({ success, massage: "Password has been changed successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error!");
    }
})

// get user already login (With token)
router.post(
    "/getUser",
    fetchUser,
    async (req, res) => {
        try{
            let userId = req.user.id;
            const user = await User.findById(userId).select("-password");
            res.send(user);
        } catch (error) {
            console.error(error.massage);
            res.status(500).send("Internal server error!");
        }
    }
);

module.exports = router;