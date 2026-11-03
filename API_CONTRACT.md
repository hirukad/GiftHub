# GiftHub API Contract (v1)

Base URL (set in frontend/src/services/api.js):
http://localhost/GiftHub/backend/

## Response shape (ALL endpoints)

```json
{ "success": true, "message": "Products loaded", "data": [] }
```

On failure: `"success": false`, with a clear `message`, and `data` = null.

## Endpoints and owners

| Method                       | Endpoint                      | Owner    | Auth      |
| ---------------------------- | ----------------------------- | -------- | --------- |
| GET                          | products/get_products.php     | Member 2 | public    |
| GET                          | products/get_product.php?id=1 | Member 2 | public    |
| POST                         | auth/register.php             | Member 3 | public    |
| POST                         | auth/login.php                | Member 3 | public    |
| POST                         | auth/logout.php               | Member 3 | logged in |
| POST                         | orders/create_order.php       | Member 4 | customer  |
| GET                          | orders/get_orders.php         | Member 4 | customer  |
| Product create/update/delete | (name agreed by Member 2 + 5) | Member 5 | admin     |
| Order status update          | admin/update_order.php        | Member 5 | admin     |

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

## Rules

- Session keys: user_id, role, name
- localStorage keys: gifthub_cart, gifthub_user
- Roles: customer, admin
- Never rename JSON fields in React. Use snake_case exactly.
- Any change to this file must go through the team lead (Member 1).
