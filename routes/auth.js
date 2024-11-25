const express = require("express")
const router = express.Router()
const { User } = require("../db")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.get("/login", (req, res) => {
    return res.render("login", {error: null, username: null, password: null})
})
router.post("/login", async(req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username });

    if (!user)
        return res.render("login", { error: "Username or pasword is incorrect",
            username: username,
            password: password
        })

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
        return res.render("login", {error: "Username or pasword is incorrect",
            username: username,
            password: password})

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
    return res.redirect("/admin/dashboard")
})

router.get("/logout", async(req, res) => {
    res.clearCookie('authToken');
    res.status(200).json({ message: 'Logout successful' });
})

module.exports = router