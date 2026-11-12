<?php
header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/../config/helpers.php";

$productId = filter_input(INPUT_GET, "id", FILTER_VALIDATE_INT);

if ($productId === false || $productId === null || $productId < 1) {
    send_json(false, "A valid product id is required", null);
    exit;
}

try {
    $query = "
        SELECT product_id, name, description, price, image, category_id, stock
        FROM products
        WHERE product_id = :product_id
        LIMIT 1
    ";

    $statement = $pdo->prepare($query);
    $statement->bindValue(":product_id", $productId, PDO::PARAM_INT);
    $statement->execute();

    $product = $statement->fetch(PDO::FETCH_ASSOC);

    if ($product === false) {
        send_json(false, "Product not found", null);
        exit;
    }

    send_json(true, "Product loaded", $product);
} catch (PDOException $error) {
    http_response_code(500);
    send_json(false, "Could not load the product", null);
}