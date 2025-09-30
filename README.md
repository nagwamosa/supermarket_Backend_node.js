# Supermarket Management System - Backend (Node.js + Express)

This is the **backend API** for the Supermarket Management System.
It is built with **Node.js, Express, and MySQL** to handle authentication, product management, employee management, and barcode-based operations.

---

## 🚀 Features

* User authentication (register, login).
* Manage products (add, edit, delete, search by barcode).
* Manage employees (add, edit, delete).
* API endpoints for sales and purchases.
* MySQL database integration.

---

## 🛠️ Tech Stack

* Node.js
* Express.js
* MySQL

---

## 📂 Project Structure

```
collect_node/
│
├── db/                  # Database connection
├── router/              # API routes (login, register, employees, products, barcode, etc.)
│   ├── login.js
│   ├── register.js
│   ├── manageProduct.js
│   ├── manageEmployee.js
│   ├── barcode.js
│   └── history.js
│
├── uploads/             # For storing uploaded files
├── index.js             # Main entry point
└── package.json         # Dependencies
```

---

## ⚙️ Setup & Installation

1. Navigate to the backend folder:

   ```bash
   cd collect_node
   npm install
   ```

2. Create a `.env` file in the root of `collect_node` with your database credentials:

   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=yourpassword
   DB_NAME=supermarket
   PORT=5000
   ```

3. Run the server:

   ```bash
   npm start
   ```

The backend will run at [http://localhost:5000](http://localhost:5000).

---

## 📊 Database Tables

* **users**: id, name, email, password
* **products**: id, name, barcode, price, quantity
* **employees**: id, name, email, phone

---

## 📌 API Examples

* `POST /register` → Register a new user
* `POST /login` → Login user
* `GET /products` → Get all products
* `POST /products` → Add a product
* `PUT /products/:id` → Update product
* `DELETE /products/:id` → Delete product

---
