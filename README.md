# GiftHub - Personalised Gift Store

A student team project: customers browse and personalise gifts, order with
cash on delivery, and view order history. Admins manage products and orders.

## Tech stack

React + Vite, React Router, Axios, plain CSS | PHP (JSON APIs, PDO) | MySQL (XAMPP)

## Setup (every team member)

1. Install: Node.js, VS Code, Git, XAMPP
2. Clone the repo INTO `C:\xampp\htdocs\` so the path is `C:\xampp\htdocs\GiftHub`
3. Start **Apache** and **MySQL** in the XAMPP Control Panel
4. Database: open http://localhost/phpmyadmin, create a database named `gifthub`,
   then import `database/gifthub.sql` (when it is available)
5. Copy `backend/config/db.example.php` to `backend/config/db.php`
   and put your own database values. Never commit `db.php`.
6. Frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
7. Open the address Vite shows (usually http://localhost:5173)

## Git rules

- Never commit directly to `main`
- Work on your own branch: feature/layout, feature/products, feature/auth,
  feature/cart-orders, feature/admin
- Pull the latest `main` before starting work each day
- Small commits, push, then open a Pull Request
- Tell the team before editing shared files: App.jsx, api.js, App.css

## Team and ownership

| Member | Area                                 |
| ------ | ------------------------------------ |
| 1      | Layout, routing, integration, README |
| 2      | Product browsing                     |
| 3      | Database and authentication          |
| 4      | Cart and orders                      |
| 5      | Admin features                       |

API details: see `API_CONTRACT.md`
