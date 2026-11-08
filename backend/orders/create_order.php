<?php
header("Content-Type: application/json");

require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/../config/helpers.php";

const ALLOWED_PAYMENT_METHOD = "COD";

function clean_text($value) {
    return is_string($value) ? trim($value) : "";
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    send_json(false, "Method not allowed", null);
}

require_login();
$userId = $_SESSION["user_id"];

$input = json_decode(file_get_contents("php://input"), true);

if (!is_array($input)) {
    http_response_code(400);
    send_json(false, "Invalid request body", null);
}

$deliveryName = clean_text($input["delivery_name"] ?? "");
$deliveryAddress = clean_text($input["delivery_address"] ?? "");
$phone = clean_text($input["phone"] ?? "");
$paymentMethod = clean_text($input["payment_method"] ?? "");
$items = $input["items"] ?? [];

if ($deliveryName === "" || $deliveryAddress === "" || $phone === "") {
    http_response_code(400);
    send_json(false, "Name, address and phone are required", null);
}

if (mb_strlen($deliveryName) > 100 || mb_strlen($phone) > 20) {
    http_response_code(400);
    send_json(false, "Name or phone is too long", null);
}

if ($paymentMethod !== ALLOWED_PAYMENT_METHOD) {
    http_response_code(400);
    send_json(false, "Invalid payment method", null);
}

if (!is_array($items) || count($items) === 0) {
    http_response_code(400);
    send_json(false, "Order must have at least one item", null);
}

try {
    $priceStmt = $pdo->prepare("SELECT price FROM products WHERE product_id = ?");

    $orderItems = [];
    $total = 0;

    foreach ($items as $item) {
        if (!is_array($item)) {
            http_response_code(400);
            send_json(false, "Invalid item", null);
        }

        $productId = filter_var(
            $item["product_id"] ?? null,
            FILTER_VALIDATE_INT,
            ["options" => ["min_range" => 1]]
        );
        $quantity = filter_var(
            $item["quantity"] ?? null,
            FILTER_VALIDATE_INT,
            ["options" => ["min_range" => 1]]
        );

        if ($productId === false || $quantity === false) {
            http_response_code(400);
            send_json(false, "Each item needs a valid product_id and quantity", null);
        }

        $customName = clean_text($item["custom_name"] ?? "");
        $customMessage = clean_text($item["custom_message"] ?? "");

        if (mb_strlen($customName) > 100) {
            http_response_code(400);
            send_json(false, "custom_name is too long", null);
        }

        $priceStmt->execute([$productId]);
        $product = $priceStmt->fetch(PDO::FETCH_ASSOC);

        if (!$product) {
            http_response_code(400);
            send_json(false, "Product not found", null);
        }

        $total += (float) $product["price"] * $quantity;

        $orderItems[] = [
            "product_id" => $productId,
            "quantity" => $quantity,
            "unit_price" => $product["price"],
            "custom_name" => $customName === "" ? null : $customName,
            "custom_message" => $customMessage === "" ? null : $customMessage
        ];
    }

    $total = round($total, 2);

    $pdo->beginTransaction();

    $orderStmt = $pdo->prepare(
        "INSERT INTO orders
            (user_id, total, delivery_name, delivery_address, phone, payment_method)
         VALUES (?, ?, ?, ?, ?, ?)"
    );
    $orderStmt->execute([
        $userId,
        $total,
        $deliveryName,
        $deliveryAddress,
        $phone,
        $paymentMethod
    ]);

    $orderId = (int) $pdo->lastInsertId();

    $itemStmt = $pdo->prepare(
        "INSERT INTO order_items
            (order_id, product_id, quantity, unit_price, custom_name, custom_message)
         VALUES (?, ?, ?, ?, ?, ?)"
    );

    foreach ($orderItems as $orderItem) {
        $itemStmt->execute([
            $orderId,
            $orderItem["product_id"],
            $orderItem["quantity"],
            $orderItem["unit_price"],
            $orderItem["custom_name"],
            $orderItem["custom_message"]
        ]);
    }

    $pdo->commit();

    send_json(true, "Order created", ["order_id" => $orderId]);

} catch (PDOException $error) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log($error->getMessage());
    http_response_code(500);
    send_json(false, "Could not create order", null);
}