<?php
//This code verifies the password hash and creates a PHP session 
// with the required user_id, name, and role keys.

header("Content-Type: application/json");

require_once __DIR__ . '/../config/helpers.php';
require_once __DIR__ . "/../config/db.php";

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

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

$email = trim($input["email"] ?? "");
$password = $input["password"] ?? "";

if ($email === "" || $password === "") {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Email and password are required",
        "data" => null
    ]);
    exit;
}

try {
    $stmt = $pdo->prepare(
        "SELECT user_id, name, email, password, role
         FROM users
         WHERE email = ?"
    );

    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user || !password_verify($password, $user["password"])) {
        http_response_code(401);
        echo json_encode([
            "success" => false,
            "message" => "Invalid email or password",
            "data" => null
        ]);
        exit;
    }

    session_regenerate_id(true);

    $_SESSION["user_id"] = (int) $user["user_id"];
    $_SESSION["name"] = $user["name"];
    $_SESSION["role"] = $user["role"];

    echo json_encode([
        "success" => true,
        "message" => "Login successful",
        "data" => [
            "user_id" => (int) $user["user_id"],
            "name" => $user["name"],
            "role" => $user["role"]
        ]
    ]);

} catch (PDOException $error) {
    error_log($error->getMessage());
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Login failed",
        "data" => null
    ]);
}