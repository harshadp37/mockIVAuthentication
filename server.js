const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
require('./config/passport');
const session = require('express-session');
const MongoStore =  require('connect-mongo')(session);
const expressLayouts = require('express-ejs-layouts');

const path = require('path');
const morgan = require('morgan');
const dbConfig = require('./config/dbConfig');
const sessionConfig = require('./config/config');
const PORT = process.env.PORT || 3000;

const app = express();

mongoose.connect(dbConfig.url + dbConfig.databaseName, dbConfig.options, (err)=>{
    if(err){
        console.log('Error while connecting to Mongo');
        process.exit(0);
    }
    console.log("Successfully connected to MongoDB : " + dbConfig.databaseName);
})

app.use(expressLayouts);
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'assests')));

app.use(session({
    secret: sessionConfig.secret,
    saveUninitialized: false,
    resave: false,
    cookie: {maxAge: sessionConfig.maxAge},
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setUser)

app.use('/', require('./routes/index'));

app.listen(PORT, ()=>{
    console.log("Server Running on PORT : " + PORT);
})