const express = require('express');
const  mysql = require('mysql');
const { query } = require('mssql');
const app = express();
const router = require('express').Router();
const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'supermarket',
    port: '3306',
  });
  connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
   
  console.log('connected as id ' + connection.threadId);
  });
  app.listen(4000, 'localhost', () => {
    console.log("SERVER IS RUNNING");
});


// connection.connect((err) => {
//   if (err) throw err;
//   console.log("DB CONNECTED");
// });

module.exports = connection;