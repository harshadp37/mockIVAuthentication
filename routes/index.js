const express = require('express');
const router = express.Router();
const passport = require('passport');

/* HOME ROUTE */
router.get('/', (req, res)=>{
    return res.render('home', {title: "Home"})
})

/* USERS ROUTES */
router.use('/user', require('./user'))

module.exports = router;