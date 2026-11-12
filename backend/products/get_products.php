<?php
header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/../config/helpers.php";

try {
    $query = "
        SELECT product_id, name, description, price, image, category_id, stock
        FROM products
    ";

    $statement = $pdo->prepare($query);
    $statement->execute();

    $products = $statement->fetchAll(PDO::FETCH_ASSOC);

    send_json(true, "Products loaded", $products);
} catch (PDOException $error) {
    http_response_code(500);
    send_json(false, "Could not load products", null);
}