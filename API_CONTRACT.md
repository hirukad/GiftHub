# GiftHub API Contract (v1)

Base URL (set in frontend/src/services/api.js):
http://localhost/GiftHub/backend/

## Response shape (ALL endpoints)

```json
{ "success": true, "message": "Products loaded", "data": [] }
```

On failure: `"success": false`, with a clear `message`, and `data` = null.

## Endpoints and owners

| Method | Endpoint                      | Owner    | Auth      |
| ------ | ----------------------------- | -------- | --------- |
| GET    | products/get_products.php     | Member 2 | public    |
| GET    | products/get_product.php?id=1 | Member 2 | public    |
| POST   | auth/register.php             | Member 3 | public    |
| POST   | auth/login.php                | Member 3 | public    |
| POST   | auth/logout.php               | Member 3 | logged in |
| POST   | orders/create_order.php       | Member 4 | customer  |
| GET    | orders/get_orders.php         | Member 4 | customer  |
| POST   | products/manage_products.php  | Member 5 | admin     |
| POST   | admin/update_order.php        | Member 5 | admin     |
| GET    | admin/get_all_orders.php      | Member 5 | admin     |
| GET    | admin/get_customers.php       | Member 5 | admin     |

## Request / response fields

### auth/register.php (POST, JSON body)

Request: name, email, password
Response data: user_id, name, role

### auth/login.php (POST, JSON body)

Request: email, password
Response data: user_id, name, role

### products/get_products.php

Response data: array of
product_id, name, description, price, image, category_id, stock

### orders/create_order.php (POST, JSON body)

Request: delivery_name, delivery_address, phone, payment_method,
items: [ { product_id, quantity, custom_name, custom_message } ]
Response data: order_id

### orders/get_orders.php

Response data: array of
order_id, order_date, total, status, delivery_name, delivery_address, phone, payment_method

### admin/update_order.php (POST, JSON body)

Request: order_id, status
(status values: Pending, Processing, Delivered, Cancelled)

### products/manage_products.php (POST, JSON body, admin only)

Request: action ("create" | "update" | "delete")

- create: name, description, price, image, category_id, stock
- update: product_id plus the same fields as create
- delete: product_id

Response data: the saved product (create, update) or { product_id } (delete)
Delete is refused with HTTP 409 if the product is already in an order.

### admin/get_all_orders.php (GET, admin only)

Response data: array of
order_id, user_id, customer_name, order_date, total, status,
delivery_name, delivery_address, phone, payment_method

### admin/get_customers.php (GET, admin only)

Response data: array of
user_id, name, email, role, created_at
(password is never returned)

## Rules

- Session keys: user_id, role, name
- localStorage keys: gifthub_cart, gifthub_user
- Roles: customer, admin
- Never rename JSON fields in React. Use snake_case exactly.
- Any change to this file must go through the team lead (Member 1).

## Agreed decisions (updated 09/11)

| Topic                 | Decision                                               |
| --------------------- | ------------------------------------------------------ |
| payment_method value  | `COD` (exactly this text, capital letters)             |
| categories columns    | `category_id`, `name`, `description`, `created_at`     |
| Optional colour field | NOT in MVP (dropped)                                   |
| manage_products.php   | Uses an `action` field: `create`, `update` or `delete` |
| Admin product image   | Admin types the image file name (no upload in MVP)     |
| Order statuses        | `Pending`, `Processing`, `Delivered`, `Cancelled`      |
| Base URL (api.js)     | `http://localhost/GiftHub/backend/`                    |
| Cookies               | `withCredentials: true` in api.js                      |
| Allowed origin (CORS) | `http://localhost:5173` only (never `*`)               |
| localStorage keys     | `gifthub_cart`, `gifthub_user` only                    |
| PHP session keys      | `user_id`, `role`, `name`                              |

## Still open (owner must answer)

- Admin "get all orders" endpoint name: Member 5 to propose
  (may JOIN `users` to include customer name)
- helpers.php: session_start(), JSON header, CORS headers and
  require_admin() status codes: Member 3 to confirm
- Admin product endpoint name (manage_products.php?): Member 5 + Member 2 to agree
