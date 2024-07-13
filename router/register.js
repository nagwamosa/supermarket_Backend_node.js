const express = require('express');
const router = express.Router();
const mysql = require('mysql');

// إعدادات قاعدة البيانات
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'supermarket',
  port: '3306',
});

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected as id ' + connection.threadId);
});

// مسار التسجيل
router.post("/", (req, res) => {
  const { email, password } = req.body;

  // Check if email or password is null or empty
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  // Check if user already exists
  connection.query(`SELECT * FROM employee WHERE email = ?`, [email], (err, results) => {
    if (err) throw err;

    if (results.length > 0) {
      res.status(409).json({ message: 'Email already taken' });
    } else {
      // Insert user into database
      connection.query(`INSERT INTO employee (email, password) VALUES (?, ?)`, [email, password], (err, results) => {
        if (err) throw err;
        res.status(201).json({ message: 'User registered successfully' });
      });
    }
  });
});

module.exports = router;
