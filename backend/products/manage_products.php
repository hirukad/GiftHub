<?php
require_once __DIR__ . '/../config/db.php';       // creates $pdo
require_once __DIR__ . '/../config/helpers.php';  // send_json(), require_admin()

require_admin(); // non-admins stop here (401 or 403)

// This endpoint only accepts POST. The "action" field says what to do.
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    send_json(false, 'Method not allowed', null);
}

// $requestBody stores the JSON React sends, as a PHP array.
$requestBody = json_decode(file_get_contents('php://input'), true);
if (!is_array($requestBody)) {
    http_response_code(400);
    send_json(false, 'Invalid JSON body', null);
}

// $action stores what the admin wants: create, update or delete.
$action = $requestBody['action'] ?? '';
if (!in_array($action, ['create', 'update', 'delete'], true)) {
    http_response_code(400);
    send_json(false, 'action must be create, update or delete', null);
}

// Checks name, description, price, image, category_id, stock.
// Returns a clean array, or stops with a 400 message.
function validate_product_input($requestBody) {
    $name = trim((string)($requestBody['name'] ?? ''));
    if ($name === '' || strlen($name) > 150) {
        http_response_code(400);
        send_json(false, 'name is required (max 150 characters)', null);
    }

    $price = filter_var($requestBody['price'] ?? null, FILTER_VALIDATE_FLOAT);
    if ($price === false || $price < 0 || $price > 99999999.99) {
        http_response_code(400);
        send_json(false, 'price must be a number, 0 or more', null);
    }

    $stock = filter_var($requestBody['stock'] ?? null, FILTER_VALIDATE_INT);
    if ($stock === false || $stock < 0) {
        http_response_code(400);
        send_json(false, 'stock must be a whole number, 0 or more', null);
    }

    $image = trim((string)($requestBody['image'] ?? ''));
    if (strlen($image) > 255) {
        http_response_code(400);
        send_json(false, 'image is too long (max 255 characters)', null);
    }

    $categoryId = $requestBody['category_id'] ?? null;
    if ($categoryId === '' || $categoryId === null) {
        $categoryId = null; // no category is allowed
    } else {
        $categoryId = filter_var($categoryId, FILTER_VALIDATE_INT);
        if ($categoryId === false || $categoryId < 1) {
            http_response_code(400);
            send_json(false, 'category_id must be a positive whole number or empty', null);
        }
    }

    return [
        'name' => $name,
        'description' => trim((string)($requestBody['description'] ?? '')),
        'price' => $price,
        'image' => $image,
        'category_id' => $categoryId,
        'stock' => $stock,
    ];
}

try {
    if ($action === 'create') {
        // ---------- CREATE ----------
        $productFields = validate_product_input($requestBody);
        $saveStatement = $pdo->prepare(
            'INSERT INTO products (name, description, price, image, category_id, stock)
             VALUES (:name, :description, :price, :image, :category_id, :stock)'
        );
        $saveStatement->execute([
            ':name' => $productFields['name'],
            ':description' => $productFields['description'],
            ':price' => $productFields['price'],
            ':image' => $productFields['image'],
            ':category_id' => $productFields['category_id'],
            ':stock' => $productFields['stock'],
        ]);
        $productFields['product_id'] = (int)$pdo->lastInsertId();
        http_response_code(201);
        send_json(true, 'Product created', $productFields);
    }

    // update and delete both need a valid product_id that exists.
    $productId = filter_var($requestBody['product_id'] ?? null, FILTER_VALIDATE_INT);
    if ($productId === false || $productId < 1) {
        http_response_code(400);
        send_json(false, 'product_id must be a positive whole number', null);
    }
    $checkStatement = $pdo->prepare('SELECT product_id FROM products WHERE product_id = :product_id');
    $checkStatement->execute([':product_id' => $productId]);
    if (!$checkStatement->fetch()) {
        http_response_code(404);
        send_json(false, 'Product not found', null);
    }

    if ($action === 'update') {
        // ---------- UPDATE ----------
        $productFields = validate_product_input($requestBody);
        $saveStatement = $pdo->prepare(
            'UPDATE products
             SET name = :name, description = :description, price = :price,
                 image = :image, category_id = :category_id, stock = :stock
             WHERE product_id = :product_id'
        );
        $saveStatement->execute([
            ':name' => $productFields['name'],
            ':description' => $productFields['description'],
            ':price' => $productFields['price'],
            ':image' => $productFields['image'],
            ':category_id' => $productFields['category_id'],
            ':stock' => $productFields['stock'],
            ':product_id' => $productId,
        ]);
        $productFields['product_id'] = $productId;
        send_json(true, 'Product updated', $productFields);
    }

    // ---------- DELETE (the only action left) ----------
    $saveStatement = $pdo->prepare('DELETE FROM products WHERE product_id = :product_id');
    $saveStatement->execute([':product_id' => $productId]);
    send_json(true, 'Product deleted', ['product_id' => $productId]);

} catch (PDOException $error) {
    // MySQL error 1451: product is used by order_items. 1452: category_id does not exist.
    $mysqlErrorCode = $error->errorInfo[1] ?? 0;
    if ($mysqlErrorCode === 1451) {
        http_response_code(409);
        send_json(false, 'This product is in existing orders and cannot be deleted', null);
    }
    if ($mysqlErrorCode === 1452) {
        http_response_code(400);
        send_json(false, 'category_id does not exist', null);
    }
    http_response_code(500);
    send_json(false, 'Could not save product', null);
}