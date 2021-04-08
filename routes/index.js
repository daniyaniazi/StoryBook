const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')
const Story = require('../models/story')
//@desc Login/Landing Page
//@route GET/

router.get('/', ensureGuest, (req, res, next) => {
    //ensureGuest(req, res, next)
    res.render("login", {
        layout: "login"
    })
})

//@desc Login/Landing Page
//@route GET/
router.get('/dashboard', ensureAuth, async (req, res, next) => {
    console.log(req.user)
    try {
        const stories = await Story.find({ user: req.user._id }).lean() //plain Js object

        res.render("dashboard", {
            name: req.user.firstName,
            stories
        })
    } catch (error) {
        console.log('Stories error', error)
        res.render('error/500')
    }

})

module.exports = router