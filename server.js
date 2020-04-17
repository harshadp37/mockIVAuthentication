const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const MongoStore =  require('connect-mongo')(session);
const expressLayouts = require('express-ejs-layouts');

const path = require('path');
const morgan = require('morgan');
const dbConfig = require('./config/dbConfig');
const sessionConfig = require('./config/config');
require('./config/passport');
const PORT = process.env.PORT || 3000;

const app = express();

/* MONGODB CONNECTION */
mongoose.connect(dbConfig.url + dbConfig.databaseName, dbConfig.options, (err)=>{
    if(err){
        console.log('Error while connecting to Mongo');
        process.exit(0);
    }
    console.log("Successfully connected to MongoDB : " + dbConfig.databaseName);
})

// EXPRESS-LAYOUT MIDDLEWARES
app.use(expressLayouts);
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// VIEW ENGINE
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// MIDDLEWARES
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'assests')));

// USED MONGODB TO STORE SESSION
app.use(session({
    secret: sessionConfig.secret,
    saveUninitialized: false,
    resave: false,
    cookie: {maxAge: sessionConfig.maxAge},
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
}))

// PASSPORT SETUP
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setUser)

// INDEX ROUTE
app.use('/', require('./routes/index'));

// START SERVER
app.listen(PORT, ()=>{
    console.log("Server Running on PORT : " + PORT);
})