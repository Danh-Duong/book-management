const express = require("express")
const router = express.Router()
const { User } = require("../db")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post("/login", async(req, res) => {
    const { username, password } = req.body;
    console.log("Test: " , username)
    const user = await User.findOne({ username: username });

    if (!user)
        return res.status(400).json({ message: 'User not found' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
        return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
        { username: user.username, id: user._id },
        'abc123!@#',
        { expiresIn: '1h' }
    );

    res.cookie('authToken', token, {
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000
    });
    res.status(200).json({ message: 'Login successful' });
})

router.get("/logout", async(req, res) => {
    res.clearCookie('authToken');
    res.status(200).json({ message: 'Logout successful' });
})

module.exports = router