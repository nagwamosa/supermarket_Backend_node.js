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

// مسار تسجيل الدخول
router.post("/", (req, res) => {
  const data = req.body;
  console.log(data);
       
  connection.query(`SELECT * FROM employee 
     WHERE email = "${data.email}" AND password = ${data.password}`, (err, result, fields) => {
        if(result.length > 0) {
            res.send('correct email and password Address');
        } else {
            res.send('Incorrect Email or password Address');
        }
        res.end();
    });
});

module.exports = router;




// var express = require('express');
// const bodyParser = require('body-parser');
// const { v4 } = require('uuid');
// const app = express();
// // const connection = require('./db/connection.js');
// // parse application/json
// app.use(bodyParser.json());

// // parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false }));

// const  mysql = require('mysql');
// const { query } = require('mssql');
// const connection = mysql.createConnection({
//     host     : 'localhost',
//     user     : 'root',
//     password : '',
//     database : 'employee',
//     port: '3306',
//   });
//   connection.connect(function(err) {
//     if (err) {
//       console.error('error connecting: ' + err.stack);
//       return;
//     }
   
//     console.log('connected as id ' + connection.threadId);
//   });
//   app.use(bodyParser.urlencoded({ extended: false }));


// ////////////////////في ربط هنا بالفرونت search ////////
// // const users={
// //   busno:null, 
// //   userid:null
// // };
// // const count={
// //   maxnumberoftravelers:null,
// //   countTraveler:null,
// // }
//         ///////////////Search///////////////////////
// // app.get('/search?', function(req, res, next) {
// //     var from  = req.query.from;
// //     var to = req.query.to;
// //     var countTraveler = req.query.countTraveler;
// //  // var timing = req.query.time;

// //     connection.query(`select * from appointment where fromLocation = ?AND toLocation= ? 'maxnumberoftravelers'-${countTraveler}>=0 `,[from , to],
 
// //       function (error, result) {
      
// //       if (error) {res.redirect("/");}
// //         else {
// //                 console.log(result);
// //                 res.send(result);
// //                 var manytomany =result[0];
// //              // console.log(manytomany.busno);
// //         if (result.length>0){
// //                   users.busno = manytomany.busno;
// //                   console.log(users);
// //                   count.maxnumberoftravelers=manytomany.maxnumberoftravelers;
// //                   count.countTraveler=countTraveler;              
// //                   console.log(users);
// //                   console.log(count);
// //                 }
                      
// //               }     
// //             });
// //        });
//         ////////////////////Login///////////////////
// app.post("/login", (req, res) => {
//     const data = req.body;
//     console.log(data);
         
//     connection.query(`SELECT * FROM employee 
//        WHERE email  = "${data.email}" AND password = ${data.password}`, (err, result, fields) => {
               
//               if(result.length > 0)
//               { 
//                   const user = result[0];
//                    res.send('correct email and password Address');
//                   // console.log(user.type);
//                   //  if (user.type === 'admin') {
//                   //     console.log("admin")
//                   // //   res.redirect('/admin');
//                   // } else {
//                   // //   res.redirect('/user');
//                   //   console.log("user")
//                   //   users.userid=user.id;
//                   //     const id = user.id
//                   //     console.log(id);
//                   //     // const data = req.body;
//                   //     connection.query(`UPDATE user SET status = 'active' WHERE  id = ${user.id}`
//                   //        , (error, result) => {
//                   //         if (error) throw error;
//                   //         console.log(result);
//                   //         })                     
//                   // }                     
//                    }      
//               else
//               {
//                   res.send('Incorrect Email or password Address');
//               }
//               res.end();
//           });
                 
//         });
      
//       /////////////////////////Logout//////////////////
// //  app.get('/logout', function(req, res, next){
// //      connection.query(`UPDATE user SET status = 'inactive' WHERE  id = ${users.userid}`
// //      , (error, result) => {
// //       if (error) throw error;
// //           console.log(users.userid);
// //           })
// //       });


//         /////////////////////Register/////////////////
// app.post('/register', (req, res) => {
//     const {email, password  } = req.body;
        
//           // Check if user already exists
//     connection.query(`SELECT * FROM employee WHERE email = ?`, [email], (err, results) => {
//             if (err) throw err;
        
//             if (results.length > 0) {
//               res.status(409).json({ message: 'email already taken' });
//             } else {
//               // Insert user into database
//               connection.query(`INSERT INTO employee (email, password) VALUES (?, ?)`, [email, password],
//                (err, results) => {
//                 if (err) throw err;
//               //   connection.query(`SELECT * FROM user WHERE email = ?`, [email], (err, results) => {
//               //     if (err) throw err;
//               //   infouser=results[0];
//               //   users.userid=infouser.id;
//               //  console.log(users);
//               // //  connection.query(`INSERT INTO manytomany (busno,userid)VALUES (?, ?)`,[users.busno,users.userid], (err, results) => {
//               // //   if (err) throw err;
//               // //   // remaining=count.maxnumberoftravelers-count.countTraveler;
//               // //   // console.log(remaining);
//               // //   // connection.query(`UPDATE appointment SET maxnumberoftravelers=${remaining} where busno = ${users.busno}`,[users.busno,users.userid], (err, results) => {
//               // //   //   if (err) throw err;
//               // //   // })
//               // // })
//               // });
                
//                 res.status(201).json({ message: 'User registered successfully' });
//               });
//             }
//           });
//         });
//       ///////////////////Requst User/////////////////
// // app.post('/requests', (req, res) => {
// //   //const {  userid,  busno } = req.body;
// //     const status = 'pending';

// //     connection.query('INSERT INTO manytomany ( userid, busno, request_status) VALUES ( ?, ?, ?)',
// //      [users.userid,users. busno, status], (error, results) => {
// //             if (error) throw error;
// //                 res.send('Request sent to admin');
// //         });
// //         });
//     //////////////////Requst Admin/////////////////    
//       // Accept a request
// // app.put('/accept', (req, res) => {
// //  // const { id } = req.params;
// //     const status = 'accepted';

// //   connection.query('UPDATE manytomany SET request_status = ? WHERE userid = ?', [status,users.userid] , (error, results) => {
// //       if (error) throw error;
// //                  res.send(`Request with id ${users.userid} has been accepted`);
// //                  remaining=count.maxnumberoftravelers-count.countTraveler;
// //                  console.log(remaining);
// //                  connection.query(`UPDATE appointment SET maxnumberoftravelers=${remaining} where busno = ${users.busno}`, (err, results) => {
// //                   if (err) throw err;
// //                 })
// //   });
// //        });

// //       // Decline a request
// // app.put('/decline', (req, res) => {
// // //const id = req.params.id;
// //   const status = 'declined';

// //   connection.query('UPDATE manytomany SET request_status = ? WHERE userid = ?', [status, users.userid], (error, results) => {
// //       if (error) throw error;
// //       res.send(`Request with userid ${id} has been declined`);
// //   });
// //        });

// app.listen(4000, 'localhost', () => {
//     console.log("SERVER IS RUNNING");
//           });
        