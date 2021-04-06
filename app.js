const express = require("express")
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const connectDB = require('./config/db')

//locad config 
dotenv.config({ path: './config/config.env' })
connectDB()


const app = express()
const PORT = process.env.PORT || 5000

//logging 
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

//Hnadlebars
app.engine('.hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', '.hbs');

//listen
app.listen(PORT, console.log(
    `server is running in ${process.env.NODE_ENV} mode on port  ${PORT}`
))