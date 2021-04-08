const mongoose = require('mongoose')

const StorySchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'public',
        emun: ['public', 'private']

    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model('Story', StorySchema);