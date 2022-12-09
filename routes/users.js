var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/login', (req, res) => {
  res.render('login.ejs')
})
router.get('/register', (req, res) => {
  res.render('register.ejs')
})
router.get('/profile', (req, res) => {
  res.render('profile.ejs')
})
router.get('/EGERCOMM', (req, res) => {
  res.render('EGERCOMM.ejs')
})
router.get('/Marketplace', (req, res) => {
  res.render('Marketplace.ejs')
})
module.exports = router;
