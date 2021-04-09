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


//@desc show all stories
//@route GET /stories
router.get('/', ensureAuth, async (req, res,) => {
    try {
        const stories = await await Story.find({ status: 'public' }).populate('user').
            sort({ createdAt: 'desc' }).
            lean()

        res.render('stories/index', {
            stories
        })
    } catch (error) {
        console.log("Error in Story GET", error)
        res.render('error/500')
    }
})

//@desc show edit stories page
//@route GET /stories/edit
router.get('/stories/edit/:id', ensureAuth, async (req, res, next) => {
    const story = await Story.findOne({
        _id: req.params.id
    }).lean()

    if (!story) {
        return res.render('error/404')
    }

    if (story.user != req.user.id) {
        res.redirect('/stories')

    }
    else {
        res.render('stories/edit', {
            story
        })
    }
})


//@desc Update storY
//@route PUT /stories/:id

router.get('/:id', ensureAuth, async (req, res, next) => {
    let story = await Story.findById(req.params.id).lean()

    if (!story) {
        return res.render('error/404')
    }

    if (story.user != req.user.id) {
        res.redirect('/stories')

    }

    else {
        story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
            new: true,
            runValidators: true
        })
    }
    res.redirect('/dashboard')
})


module.exports = router