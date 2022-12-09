const mysql = require('mysql');
const con = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'Kipkoech@2001',
    database:'userlogin'
});
con.connect(function (err) {
 if(err) throw err;
 console.log("MSQL Database connection created successfully");   
})
module.exports = con;