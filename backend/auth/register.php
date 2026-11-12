<?php

header("Content-Type: application/json");

require_once __DIR__ . '/../config/helpers.php';
require_once __DIR__ . "/../config/db.php";
start_session_once();

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Method not allowed",
        "data" => null
    ]);
    exit;
}

$input = json_decode(file_get_contents("php://input"), true);

if (!is_array($input)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Invalid request data",
        "data" => null
    ]);
    exit;
}

$name = trim($input["name"] ?? "");
$email = trim($input["email"] ?? "");
$password = $input["password"] ?? "";

if ($name === "" || $email === "" || $password === "") {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "All fields are required",
        "data" => null
    ]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Invalid email address",
        "data" => null
    ]);
    exit;
}

if (strlen($password) < 8) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Password must be at least 8 characters",
        "data" => null
    ]);
    exit;
}

try {
    $check = $pdo->prepare(
        "SELECT user_id FROM users WHERE email = ?"
    );
    $check->execute([$email]);

    if ($check->fetch()) {
        http_response_code(409);
        echo json_encode([
            "success" => false,
            "message" => "Email already registered",
            "data" => null
        ]);
        exit;
    }

    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $pdo->prepare(
        "INSERT INTO users (name, email, password, role)
         VALUES (?, ?, ?, 'customer')"
    );

    $stmt->execute([$name, $email, $hashedPassword]);

    $userId = (int) $pdo->lastInsertId();

    echo json_encode([
        "success" => true,
        "message" => "Registration successful",
        "data" => [
            "user_id" => $userId,
            "name" => $name,
            "role" => "customer"
        ]
    ]);

} catch (PDOException $error) {
    error_log($error->getMessage());
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Registration failed",
        "data" => null
    ]);
}