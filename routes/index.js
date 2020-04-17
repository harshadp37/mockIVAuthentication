const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/', (req, res)=>{
    console.log(req.session)
    return res.render('home')
})

/* USER ROUTES */
router.use('/user', require('./user'))

module.exports = router;