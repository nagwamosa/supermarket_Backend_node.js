const express = require('express');
const router = express.Router();
const mysql = require('mysql');

// إعدادات الاتصال بقاعدة البيانات
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
const addToInvoice = (product, barcode) => {
  const price = product?.price ?? 0;
  const nameProduct = product?.nameProduct ?? 'غير معروف';

  setInvoiceItems(prevItems => {
    const existingItemIndex = prevItems.findIndex(item => item.barcode === barcode);
    if (existingItemIndex >= 0) {
      const updatedItems = [...prevItems];
      updatedItems[existingItemIndex].quantity += 1;
      updatedItems[existingItemIndex].total = updatedItems[existingItemIndex].quantity * price;
      return updatedItems;
    } else {
      return [...prevItems, { ...product, barcode: barcode, quantity: 1, total: price, nameProduct }];
    }
  });
};

router.get("/barcode/:productid", (req, res) => {
  const { productid } = req.params;
  console.log('Received product ID:', productid);

  // التحقق من كمية المنتج الحالية وجلب تفاصيل المنتج
  connection.query("SELECT * FROM product WHERE code = ?", [productid], (err, results) => {
    if (err) {
      console.error('Error fetching product details:', err);
      return res.status(500).json({
        message: "Error fetching product details"
      });
    }

    if (results.length > 0) {
      const product = results[0];
      const currentAmount = product.amount;

      if (currentAmount <= 0) {
        console.log('Product amount is zero or less for code:', productid);
        return res.json({ message: 'المنتج غير متوفر', product });
      }

      console.log('Product details fetched successfully for code:', productid);
      res.json({ message: `تم جلب تفاصيل المنتج الذي يحمل الكود ${productid}`, product });

    } else {
      console.log('Product not found for code:', productid);
      res.json({ message: 'لم يتم العثور على المنتج', product: { price: 0, nameProduct: 'غير معروف' } });  // تعيين قيم افتراضية
    }
  });
});


router.post("/reduce-quantity", (req, res) => {
  const { items } = req.body;
  console.log('Received request to reduce quantity for items:', items);

  const promises = items.map(item => {
    return new Promise((resolve, reject) => {
      const { barcode, quantity } = item;

      // التحقق من كمية المنتج الحالية وجلب تفاصيل المنتج
      connection.query("SELECT * FROM product WHERE code = ?", [barcode], (err, results) => {
        if (err) {
          console.error('Error fetching product details:', err);
          return reject({ message: "Error fetching product details", barcode });
        }

        if (results.length > 0) {
          const product = results[0];
          const currentAmount = product.amount;

          if (currentAmount <= 0) {
            console.log('Product amount is zero or less for code:', barcode);
            return resolve({ message: 'المنتج غير متوفر', barcode });
          }

          if (currentAmount < quantity) {
            console.log('Requested quantity exceeds available stock for code:', barcode);
            return resolve({ message: 'الكمية المطلوبة غير متوفرة', barcode });
          }

          // تحديث كمية المنتج إذا كانت أكثر من أو تساوي الكمية المطلوبة
          connection.query("UPDATE product SET amount = amount - ? WHERE code = ?", [quantity, barcode], (err, result) => {
            if (err) {
              console.error('Error updating product:', err);
              return reject({ message: "Error updating product", barcode });
            }

            console.log('Product updated successfully for code:', barcode, 'by reducing quantity:', quantity);
            resolve({ message: `تم تحديث الكمية للمنتج الذي يحمل الكود ${barcode}`, barcode });
          });

        } else {
          console.log('Product not found for code:', barcode);
          resolve({ message: 'لم يتم العثور على المنتج', barcode });
        }
      });
    });
  });

  Promise.all(promises)
    .then(results => {
      res.json({ message: "تم تحديث الكمية للمنتجات", results });
    })
    .catch(error => {
      console.error('Error reducing quantities:', error);
      res.status(500).json({ message: "Error reducing quantities", error });
    });
});


// const getProductID = (barcode) => {
//   return new Promise((resolve, reject) => {
//     const query = "SELECT productid FROM `product` WHERE `code` = ?";
//     connection.query(query, [barcode], (error, results) => {
//       if (error) return reject(error);
//       if (results.length === 0) return reject(new Error('Product not found'));
//       resolve(results[0].productid);
//     });
//   });
// };

const getProductID = (barcode) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT productid FROM product WHERE code = ?";
    connection.query(query, [barcode], (error, results) => {
      if (error) return reject(error);
      if (results.length === 0) return reject(new Error('Product not found'));
      resolve(results[0].productid);
    });
  });
};

const getOpenInvoiceID = (userID) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT invoice_id FROM history WHERE user_id = ? AND status = 'open' LIMIT 1";
    connection.query(query, [userID], (error, results) => {
      if (error) return reject(error);
      if (results.length === 0) return resolve(null); // لا توجد فاتورة مفتوحة
      resolve(results[0].invoice_id);
    });
  });
};

const createInvoiceID = () => {
  return new Promise((resolve, reject) => {
    const query = "SELECT MAX(invoice_id) AS maxInvoiceID FROM history";
    connection.query(query, (error, results) => {
      if (error) return reject(error);
      const newInvoiceID = results[0].maxInvoiceID ? results[0].maxInvoiceID + 1 : 1;
      resolve(newInvoiceID);
    });
  });
};

// نقطة النهاية لتسجيل الفاتورة
router.post('/invoices', async (req, res) => {
  const { userID, items } = req.body;

  try {
    let invoiceID = await getOpenInvoiceID(userID);

    if (!invoiceID) {
      invoiceID = await createInvoiceID();
    }

    const invoiceItems = await Promise.all(
      items.map(async (item) => {
        const productID = await getProductID(item.barcode);
        if (!item.price) {
          console.error('Item price is missing for:', item);
          throw new Error('Item price is missing');
        }
        return [invoiceID, new Date(), productID, item.quantity, item.price];
      })
    );
    

    const query = "INSERT INTO history(invoice_id, date, productid, quantity, price) VALUES ?";
    connection.query(query, [invoiceItems], (error, results) => {
      if (error) {
        console.error('خطأ في إدراج الفاتورة:', error);
        return res.status(500).send({ message: 'فشل في تسجيل الفاتورة' });
      }
      res.send({ message: 'تم تسجيل الفاتورة بنجاح' });
    });
  } catch (error) {
    console.error('خطأ في معالجة الفاتورة:', error);
    res.status(500).send({ message: 'فشل في معالجة الفاتورة' });
  }
});




router.get("/view", (req, res) => {
  const query = `
    SELECT h.id, h.invoice_id, h.date, p.nameProduct, h.quantity, h.price
    FROM history h
    JOIN product p ON h.productid = p.productid
  `;

  connection.query(query, (err, result) => {
    if (err) {
      console.error('Error fetching sales records: ', err);
      res.status(500).send('Error fetching sales records');
    } else {
      const updatedResult = result.map(record => {
        // تحويل التاريخ من UTC إلى التوقيت المحلي بصيغة اليوم-الشهر-السنة
        const localDate = new Date(record.date);
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        record.date = localDate.toLocaleDateString('en-GB', options); // استخدام en-GB لتنسيق اليوم-الشهر-السنة
        return record;
      });
      res.send(updatedResult);
    }
  });
});



router.delete("/delete/:id", (req, res) => {
  const { id } = req.params;
  connection.query("DELETE FROM history WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.log('Error deleting sales record: ', err);
      res.status(500).json({
        message: "Failed to delete the sales record",
      });
    } else {
      res.json({
        message: "Sales record deleted successfully"
      });
    }
  });
});


module.exports = router;
