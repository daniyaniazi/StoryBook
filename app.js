const express = require("express")
const path = require("path")
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const passport = require('passport')
const connectDB = require('./config/db')
const routes = require('./routes/index')
const session = require("express-session")
const MongoDBStore = require('connect-mongodb-session')(session);
const mongoose = require('mongoose')
const methodOverride = require('method-override')

//locad config 
dotenv.config({ path: './config/config.env' })
connectDB()


//passport config
require('./config/passport')(passport)

const app = express()
const PORT = process.env.PORT || 5000


//body parser 
app.use(express.urlencoded({ extended: false }))
app.use(express.json())


//logging 
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}


//handlebars helpers
const { formatDate, truncate, stripTags, select } = require('./helpers/hbs')


//Hnadlebars
app.engine('.hbs', exphbs({ helpers: { formatDate, truncate, stripTags, select }, defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', '.hbs');

//sessions
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUnitialized: false,
    store: new MongoDBStore({
        mongooseConnection: mongoose.connection
    })
    //cookie: { secure: true }
}))


//set passport middleware
app.use(passport.initialize())
app.use(passport.session())

//set global variable
app.use(function (req, res, next) {
    res.locals.user = req.user || null
})

//static folder
app.use('/', express.static(path.join(__dirname, 'public')))


//Routes
app.use('/', routes);
app.use('/auth', require('./routes/auth'));
app.use('/stories', require('./routes/stories'));


//listen
app.listen(PORT, console.log(
    `server is running in ${process.env.NODE_ENV} mode on port  ${PORT}`
))