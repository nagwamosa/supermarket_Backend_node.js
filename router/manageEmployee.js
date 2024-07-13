// manageEmployee.js

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

// عرض جميع الموظفين
router.get("/viewemployee", (req, res) => {
  connection.query("select * from employee", (err, result, fields) => {
    res.send(result);
  });
});

// إدراج موظف جديد
router.post("/insertemployee", (req, res) => {
  const data = req.body;
  console.log(data);
  connection.query(`SELECT * FROM employee WHERE email = ?`, [data.email], (err, results) => {
    if (err) throw err;

    if (results.length > 0) {
      res.status(409).json({ message: 'email already taken' });
    } else {
      connection.query("insert into employee set ?",
        { name: data.name, email: data.email, password: data.password, phone: data.phone },
        (err, result, fields) => {
          if (err) {
            console.log('Error inserting user: ', err);
          } else {
            res.json({
              message: "EMPLOYEE Inserted Successfully !"
            })
          }
        });
    }
  });
});

// البحث عن موظف بواسطة ID
router.get("/serachbyidemployee/:id", (req, res) => {
  const { id } = req.params;
  connection.query("select * from employee where ?", { employeeid: id }, (err, result, fields) => {
    if (result[0]) {
      res.json(result[0]);
    } else {
      res.status(404).json({
        message: "employee Not Found",
      });
    }
  });
});

// تحديث معلومات موظف
router.put("/updateemployee/:id", (req, res) => {
  const { id } = req.params;
  const data = req.body;
  connection.query("update employee set ? where employeeid = ?",
    [{ email: data.email, password: data.password }, id], (err, result) => {
      if (err) {
        res.status(505).json({
          message: "Failed to update the Employee"
        });
      } else {
        res.json({
          message: "EMPLOYEE updated successfully"
        });
      }
    });
});

// حذف موظف
router.delete("/deleteemployee/:id", (req, res) => {
  const { id } = req.params;
  connection.query("delete from employee where ?", { employeeid: id }, (err, result) => {
    if (err) {
      res.status(500).json({
        message: "failed to delete the employee",
      });
    } else {
      res.json({
        message: "employee deleted successfully"
      });
    }
  });
});

module.exports = router;
