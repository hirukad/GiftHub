<?php
require_once __DIR__ . '/../config/db.php';       // creates $pdo
require_once __DIR__ . '/../config/helpers.php';  // send_json(), require_admin()

require_admin(); // non-admins stop here (401 or 403)

// This endpoint only accepts GET.
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    send_json(false, 'Method not allowed', null);
}

try {
    // JOIN users so the admin sees the customer's name.
    // No user input is used here, so a plain query() is safe.
    $ordersStatement = $pdo->query(
        'SELECT o.order_id, o.user_id, u.name AS customer_name, o.order_date,
                o.total, o.status, o.delivery_name, o.delivery_address,
                o.phone, o.payment_method
         FROM orders o
         JOIN users u ON u.user_id = o.user_id
         ORDER BY o.order_date DESC, o.order_id DESC'
    );
    // $allOrders stores every row as an array of associative arrays.
    $allOrders = $ordersStatement->fetchAll(PDO::FETCH_ASSOC);
    send_json(true, 'Orders loaded', $allOrders);
} catch (PDOException $error) {
    http_response_code(500);
    send_json(false, 'Could not load orders', null);
}