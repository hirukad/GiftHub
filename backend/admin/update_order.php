<?php
// File: backend/admin/update_order.php (I own this file)
require_once __DIR__ . '/../config/db.php';       // creates $pdo
require_once __DIR__ . '/../config/helpers.php';  // send_json(), require_admin()

require_admin(); // non-admins stop here with 401 or 403

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    send_json(false, 'Method not allowed', null);
}

// $requestBody stores the JSON that React sends, as a PHP array.
$requestBody = json_decode(file_get_contents('php://input'), true);
if (!is_array($requestBody)) {
    http_response_code(400);
    send_json(false, 'Invalid JSON body', null);
}

$orderId = filter_var($requestBody['order_id'] ?? null, FILTER_VALIDATE_INT); // int, or false
$newStatus = $requestBody['status'] ?? '';                                    // text sent by React
$allowedStatuses = ['Pending', 'Processing', 'Delivered', 'Cancelled'];       // same as the contract

if ($orderId === false || $orderId < 1) {
    http_response_code(400);
    send_json(false, 'order_id must be a positive whole number', null);
}
if (!in_array($newStatus, $allowedStatuses, true)) { // true = exact spelling and capitals
    http_response_code(400);
    send_json(false, 'Invalid status value', null);
}

try {
    $checkStatement = $pdo->prepare('SELECT order_id FROM orders WHERE order_id = :order_id');
    $checkStatement->execute([':order_id' => $orderId]);
    if (!$checkStatement->fetch()) {
        http_response_code(404);
        send_json(false, 'Order not found', null);
    }

    $updateStatement = $pdo->prepare('UPDATE orders SET status = :status WHERE order_id = :order_id');
    $updateStatement->execute([':status' => $newStatus, ':order_id' => $orderId]);

    send_json(true, 'Order status updated', ['order_id' => $orderId, 'status' => $newStatus]);
} catch (PDOException $error) {
    http_response_code(500);
    send_json(false, 'Could not update order', null);
}