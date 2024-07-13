const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors'); // إضافة CORS

const app = express();
const port = 4000;

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

// إعداد body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// استخدام CORS
app.use(cors());

// استيراد الروترات
const loginRouter = require('./login');
const registerRouter = require('./register');
const manageEmployeeRouter = require('./manageEmployee');
const manageProductRouter = require('./manageproduct');
const history = require('./history');
const barcode=require('./barcode')
// استخدام الروترات
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/manageEmployee', manageEmployeeRouter);
app.use('/manageProduct', manageProductRouter);
app.use('/history', history);
app.use('/scan',barcode)
app.listen(port, 'localhost', () => {
  console.log(`Server is running on port ${port}`);
});
