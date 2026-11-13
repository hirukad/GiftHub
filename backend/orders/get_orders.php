<?php
header("Content-Type: application/json");

require_once __DIR__ . "/../config/helpers.php";

require_once __DIR__ . "/../config/db.php";

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    http_response_code(405);
    send_json(false, "Method not allowed", null);
}

require_login();
$userId = $_SESSION["user_id"];

try {
    $stmt = $pdo->prepare(
        "SELECT order_id, order_date, total, status, delivery_name,
                delivery_address, phone, payment_method
         FROM orders
         WHERE user_id = ?
         ORDER BY order_date DESC, order_id DESC"
    );
    $stmt->execute([$userId]);
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

    send_json(true, "Orders loaded", $orders);

} catch (PDOException $error) {
    error_log($error->getMessage());
    http_response_code(500);
    send_json(false, "Could not load orders", null);
}