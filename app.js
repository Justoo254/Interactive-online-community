const express = require('express')
const bcrypt = require('bcrypt')
const saltRounds = 5;
const multer = require('multer');
const app = express();
const userRouter = require('./routes/users')
const storage = multer.diskStorage({
  destination: (req, file, cb) =>{
cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
})
const upload = multer({storage:storage})
// const session = require('express-session') 
const bodyParser = require('body-parser')
const database = require('./database')
const path = require('path')
const mysql = require('mysql');
const session = require('express-session');
const con = require('./database');
const passport = require('passport');
const router = require('./routes/users');
const { hasUncaughtExceptionCaptureCallback } = require('process');
app.set('view-engine', 'ejs')
app.use('/', userRouter)
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,'views')))
app.use(session({
  secret: 'Justoo',
  cookie:{maxAge:60000},
  resave: true,
  saveUninitialized: true
}))
app.get('/contact_us', (req, res) => {
  if(req.session.loggedin) {
  res.render('contact_us.ejs')
} else {
  res.status(404).send("Operation prohibited")
}})
app.get('/home', (req, res) => {
  if(req.session.loggedin) {
  res.render('home.ejs', ({
    name: req.session.username,
    title: "Egerton best interactive online community",
    nav: ['Marketplace', 'Househunting', 'Product adverts']
  }))
  } else {
    res.status(404).send("Operation prohibited.Login/register first")
  }
})
app.get ('/logout', (req,res) => {
  if (req.session.loggedin) {
  res.render('logout.ejs', ({name:req.session.username}))
  } else {
    res.status(400).send("operation prohibited")
  }})
  app.get('/logout_confirm', (req,res) => {
    if (req.session.loggedin) {
    req.session.destroy();
    console.log("User successfully logged out");
    res.render('logout_confirm.ejs')
    } else {
      res.status(400).send("Operation prohibited")
    }
  })
app.post('/register', (req, res) => {
   let username = req.body.username;
   let password = req.body.password;

   const searchSql = 'SELECT * FROM users WHERE user_name = ?';
   const sqlInsert = 'INSERT INTO users(user_name, user_password) VALUES(?, ?)';
   con.query(searchSql,[username], async(err, results, fields) => {
    if (err) throw err;
    if (results.length > 0) {
      res.send ("Account with that username exists!")
    } else {
      const hashPassword = await bcrypt.hash(password, saltRounds)
      con.query(sqlInsert,[username,hashPassword], (err, results) => {
        if (err) throw err;
        console.log("User added to database");
        res.redirect('./login')
        res.end();
      })
    }
   })

})
app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const searchSql2 = 'SELECT * FROM users WHERE user_name = ?'
  con.query(searchSql2,[username], async(err, results,fields) => {
  if (err) throw err;
  const hashedPassword = results[0].user_password;
  await bcrypt.compare(password, hashedPassword,(err,result) => {
  if (result) {
    //password matched
    req.session.loggedin = true;
    req.session.username = username;
    res.redirect('./home')
    res.end();
  } else {
    res.send("Invalid username or password")
  } 
})
  })
})

app.post('/upload-profile-pic', upload.single('profile_pic'), (req, res) => {
  // profile_pic is the name of our file input field in the HTML form
  const file = req.file;
  if(!file) {
    res.send("Please select profile pic to upload")
  }
  console.log("User has uploaded profile pic")
  res.send(`You have successfully uploaded this image: <hr/><img src="${req.file}" width="500"><hr>`)
  })
const PORT = 5057;
app.listen(PORT, (err) => {
  if (err) throw err
  console.log("Server running on port " + PORT)})
