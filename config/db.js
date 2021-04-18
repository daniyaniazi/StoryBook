const mongoose = require("mongoose")

const connectDB = async () => {
    try {
        const conn = await mongoose.connect('mongodb+srv://admin:admin@Cluster0.22jeh.mongodb.net/storybooks?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        })
        console.log(`MongoDB connected ${conn.connection.host}`)
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
}

module.exports = connectDB