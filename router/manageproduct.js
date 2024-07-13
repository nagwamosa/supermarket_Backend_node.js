// manageProduct.js

const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const cors = require('cors');
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

// عرض جميع المنتجات
router.get("/viewproduct", (req, res) => {
  connection.query("SELECT * FROM `product`", (err, result, fields) => {
    if (err) {
      console.error('Error fetching products: ', err);
      res.status(500).send('Error fetching products');
    } else {
      res.send(result);
      console.log(result);
    }
  });
});

// إدراج منتج جديد
router.post("/insertproduct", (req, res) => {
  const product = req.body;
  console.log(product);

  connection.query("INSERT INTO product SET ?",
    {
      code: product.code,
      nameProduct: product.nameProduct,
      amount: product.amount,
      price: product.price,
      employid: product.employid,
      ProductionDate: product.ProductionDate,
      Expirydate: product.Expirydate,
      purchasingPrice: product.purchasingPrice // تم إضافة PurchasingPrice هنا
    },
    (err, result, fields) => {
      if (err) {
        console.log('Error inserting product: ', err);
        if (err.code === 'ER_DUP_ENTRY') {
          res.status(400).json({
            message: "Duplicate entry for code"
          });
        } else {
          res.status(500).json({
            message: "Error inserting product"
          });
        }
      } else {
        res.json({
          message: "Product created successfully!"
        });
      }
    });
});


// router.post('/insertproduct', async (req, res) => {
//   try {
//     const { code, nameProduct, amount, price, employid, productionDate, expiryDate } = req.body;

//     // استعلام قاعدة البيانات
//     await db.query(
//       "INSERT INTO product SET ?",
//       {
//         code: code,
//         nameProduct: nameProduct,
//         amount: amount,
//         price: price,
//         employid: employid,
//         ProductionDate: productionDate,
//         Expirydate: expiryDate
//       },
//       (error, results) => {
//         if (error) {
//           if (error.code === 'ER_DUP_ENTRY') {
//             res.status(400).send({ message: 'Duplicate entry for code' });
//           } else {
//             console.log('Error inserting product: ', error);
//             res.status(500).send({ message: 'Failed to add product' });
//           }
//         } else {
//           res.status(201).send({ message: 'Product added successfully' });
//         }
//       }
//     );
//   } catch (error) {
//     console.log('Unexpected error: ', error);
//     res.status(500).send({ message: 'Failed to add product' });
//   }
// });


// البحث عن منتج بواسطة ID
router.get("/searchbyproduct/:productid", (req, res) => {
  const { productid } = req.params;
  connection.query("SELECT * FROM product WHERE code = ?", productid, (err, result, fields) => {
    if (err) {
      console.log('Error fetching product: ', err);
      res.status(500).json({
        message: "Error fetching product"
      });
    } else if (result.length > 0) {
      res.json(result[0]);
    } else {
      res.status(404).json({
        message: "Product not found",
      });
    }
  });
});


// تحديث منتج
router.put("/updateproduct/:productid", (req, res) => {
  const { productid } = req.params;
  const product = req.body;
  console.log(product)
  connection.query(
    "UPDATE product SET ? WHERE productid = ?",
    [
      {
        code: product.code,
        nameProduct: product.nameProduct,
        amount: product.amount,
        price: product.price,
        employid: product.employid,
        ProductionDate: product.ProductionDate,
        Expirydate: product.Expirydate,
        purchasingPrice: product.purchasingPrice // تم إضافة PurchasingPrice هنا
      },
      productid
    ],
    (err, result) => {
      if (err) {
        console.log('Error updating product: ', err);
        res.status(500).json({
          message: "Failed to update the product"
        });
      } else {
        res.json({
          message: "Product updated successfully"
        });
        console.log(' updating product ')
      }
    }
  );
});


// حذف منتج
router.delete("/deleteproduct/:productid", (req, res) => {
  const { productid } = req.params;
  connection.query("DELETE FROM product WHERE code = ?", productid, (err, result) => {
    if (err) {
      console.log('Error deleting product: ', err);
      res.status(500).json({
        message: "Failed to delete the product",
      });
    } else {
      res.json({
        message: "Product deleted successfully"
      });
    }
  });
});



module.exports = router;
