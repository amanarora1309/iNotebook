const express = require('express');
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middlewares/fetchuser")

const JWT_SECRET = 'Harryisagoodb$oy';

// Route 1: Create a user using: POST "api/auth/createuser". No login required
router.post('/createuser',
    [body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 5 characters').isLength({ min: 5 })],
    async (req, res) => {
        let success = false;
        // If there are errors, return Bad request and errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors)
            return res.status(400).json({success: success, error: errors.array() });
        }

        // Check weather the user with this email exists already
        try {
            let user = await User.findOne({ email: req.body.email });
            if (user) {
                return res.status(400).send({success: success, error: "Sorry a user with this email already exists" })
            }

            const salt = await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(req.body.password, salt);
            // Create a new user
            user = await User.create({
                name: req.body.name,
                password: secPass,
                email: req.body.email
            })

            const data = {
                user: {
                    id: user.id
                }
            }

            const authtoken = jwt.sign(data, JWT_SECRET);
            success = true;
            res.send({success: success, authtoken: authtoken});
        } catch (error) {
            console.log(error.message);
            res.status(500).send({success: success, message: "Internal Server Error"});
        }
    })


// Route 2: Authenticate a user using: POST "api/auth/login". No login required

router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 5 characters').exists()
], async (req, res) => {
    let success = false;
    // If there are errors, return Bad request and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors)
        return res.status(400).json({success: success, error: errors.array() });
    }

    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send({success: success, error: "Please try to login correct credentials" });
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if(!passwordCompare){
            return res.status(400).send({success: success, error: "Please try to login with correct credentials"})
        }
        
        

        const data = {
            user: {
                id: user.id
            }
        }

        const authtoken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.send({success: success, authtoken: authtoken });

    } catch (error) {
        console.log(error.message);
        console.log(error)
        res.status(500).send({success: success, message: "Internal Server Error"});
    }

})


// Route 3: Get logged in user details: POST "api/auth/getuser". Login required

router.post('/getuser', fetchuser,  async (req, res) => {
    try {
        let userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);
    } catch (error) {
        console.log(error);
        console.log(error.message);
        res.status(500).send("Internal server error")
    }
})
module.exports = router;