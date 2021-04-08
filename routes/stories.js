const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')
const Story = require('../models/story')
//@desc show add page
//@route GET /stories/add

router.get('/add', ensureAuth, (req, res, next) => {
    //ensureGuest(req, res, next)
    res.render('stories/add')
})

router.post('/', ensureAuth, async (req, res, next) => {
    try {
        req.body.user = req.user.id
        await Story.create(req.body)
        res.redirect('/dashboard')
    } catch (error) {
        console.log(
            "add stories err", error)

        res.render('error/500')
    }
})

module.exports = router