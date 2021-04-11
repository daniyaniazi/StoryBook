const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')
const story = require('../models/story')
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
router.get('/edit/:id', ensureAuth, async (req, res) => {

    try {
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
    } catch (error) {
        console.log("update error", error)
        res.render('error/500')
    }


})


//@desc Update story
//@route PUT /stories/:id
router.put('/:id', ensureAuth, async (req, res) => {

    try {
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
    } catch (error) {
        console.log("update error", error)
        res.render('error/500')
    }

})

// @desc    Delete story
// @route   DELETE /stories/:id
router.delete('/:id', ensureAuth, async (req, res) => {
    try {
        let story = await Story.findById(req.params.id).lean()

        if (!story) {
            return res.render('error/404')
        }

        if (story.user != req.user.id) {
            res.redirect('/stories')
        } else {
            await Story.remove({ _id: req.params.id })
            res.redirect('/dashboard')
        }
    } catch (err) {
        console.error(err)
        return res.render('error/500')
    }
})

// @desc    User stories
// @route   GET /stories/user/:userId
router.get('/user/:userId', ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({
            user: req.params.userId,
            status: 'public',
        })
            .populate('user')
            .lean()

        res.render('stories/index', {
            stories,
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})


// @desc    Show single story
// @route   GET /stories/:id
router.get('/:id', ensureAuth, async (req, res) => {
    try {
        let story = await Story.findById(req.params.id).populate('user').lean()

        if (!story) {
            return res.render('error/404')
        }

        if (story.user._id != req.user.id && story.status == 'private') {
            res.render('error/404')
        } else {
            res.render('stories/show', {
                story,
            })
        }
    } catch (err) {
        console.error(err)
        res.render('error/404')
    }
})

module.exports = router