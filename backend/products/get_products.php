<?php
header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/../config/helpers.php";

try {
    $query = "
        SELECT
            p.product_id,
            p.name,
            p.description,
            p.price,
            p.image,
            p.category_id,
            p.stock,
            po.occasion_id
        FROM products AS p
        LEFT JOIN product_occasions AS po
            ON p.product_id = po.product_id
        ORDER BY p.product_id, po.occasion_id
    ";

    $statement = $pdo->prepare($query);
    $statement->execute();
    $rows = $statement->fetchAll(PDO::FETCH_ASSOC);

    $products = [];

    foreach ($rows as $row) {
        $productId = (int) $row["product_id"];

        if (!isset($products[$productId])) {
            $products[$productId] = [
                "product_id" => $productId,
                "name" => $row["name"],
                "description" => $row["description"],
                "price" => $row["price"],
                "image" => $row["image"],
                "category_id" => $row["category_id"] === null
                    ? null
                    : (int) $row["category_id"],
                "stock" => (int) $row["stock"],
                "occasion_ids" => []
            ];
        }

        if ($row["occasion_id"] !== null) {
            $products[$productId]["occasion_ids"][] =
                (int) $row["occasion_id"];
        }
    }

    send_json(true, "Products loaded", array_values($products));
} catch (PDOException $error) {
    http_response_code(500);
    send_json(false, "Could not load products", null);
}