const express = require('express');
const multer = require('multer');
const Jimp = require('jimp');
const { BrowserMultiFormatReader, BarcodeFormat } = require('@zxing/library');
const path = require('path');
const mysql = require('mysql2/promise');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

const connectionConfig = {
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'your_database'
};
router.get("/view", (req, res) => {
  const query = `
    SELECT h.id, h.invoice_id, h.date, p.nameProduct, h.quantity, h.price
    FROM history h
    JOIN product p ON h.productid = p.productid
  `;
  
  connection.query(query, (err, result, fields) => {
    if (err) {
      console.error('Error fetching sales records: ', err);
      res.status(500).send('Error fetching sales records');
    } else {
      const updatedResult = result.map(record => {
        // تحويل التاريخ من UTC إلى التوقيت المحلي
        record.date = new Date(record.date).toISOString().split('T')[0];
        return record;
      });
      res.send(updatedResult);
      console.log(updatedResult);
    }
  });
});

router.delete("/delete/:id", (req, res) => {
  const { id } = req.params;
  connection.query("DELETE FROM product WHERE ?", { id: id }, (err, result) => {
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

// router.post('/upload', upload.single('file'), async (req, res) => {
//   try {
//     let code = null;

//     if (req.file) {
//       const imagePath = path.join(__dirname, '../', req.file.path);
//       const image = await Jimp.read(imagePath);
//       const width = image.bitmap.width;
//       const height = image.bitmap.height;
//       const rawImage = new Uint8Array(width * height);

//       for (let y = 0; y < height; y++) {
//         for (let x = 0; x < width; x++) {
//           const idx = (y * width + x) * 4;
//           const r = image.bitmap.data[idx];
//           const g = image.bitmap.data[idx + 1];
//           const b = image.bitmap.data[idx + 2];
//           const avg = (r + g + b) / 3;
//           rawImage[y * width + x] = avg;
//         }
//       }

//       const codeReader = new BrowserMultiFormatReader();
//       const luminanceSource = {
//         getRow: (y, row) => row.set(rawImage.slice(y * width, (y + 1) * width)),
//         getMatrix: () => rawImage,
//         getWidth: () => width,
//         getHeight: () => height,
//       };

//       const result = codeReader.decode(luminanceSource);
//       console.log('Barcode:', result.text);
//       code = result.text;
//     } else if (req.body.code) {
//       code = req.body.code;
//     }

//     if (!code) {
//       res.status(400).json({ message: 'No code provided' });
//       return;
//     }

//     const connection = await mysql.createConnection(connectionConfig);
//     const [rows] = await connection.execute(
//       'UPDATE products SET amount = amount - 1 WHERE code = ?',
//       [code]
//     );

//     await connection.end();

//     if (rows.affectedRows > 0) {
//       res.json({ message: `تم تحديث الكمية للمنتج الذي يحمل الكود ${code}` });
//     } else {
//       res.json({ message: 'لم يتم العثور على المنتج' });
//     }
//   } catch (error) {
//     console.error('Error processing file:', error);
//     res.status(500).json({ message: 'Error processing file' });
//   }
// });

module.exports = router;
