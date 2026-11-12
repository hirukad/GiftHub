
<?php

// CORS configuration for GiftHub frontend.
$allowedOrigin = "http://localhost:5173";

if (
    isset($_SERVER["HTTP_ORIGIN"]) &&
    $_SERVER["HTTP_ORIGIN"] === $allowedOrigin
) {
    header("Access-Control-Allow-Origin: " . $allowedOrigin);
}

header("Vary: Origin");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

// Handle browser preflight requests.
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

// Start a PHP session only when authentication is checked.
function start_session_once() {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
}

// Send a standard JSON response.
function send_json($success, $message, $data = null) {
    header("Content-Type: application/json");

    echo json_encode([
        "success" => $success,
        "message" => $message,
        "data" => $data
    ]);

    exit;
}

// Check whether the user is logged in.
function require_login() {
    start_session_once();

    if (!isset($_SESSION["user_id"])) {
        http_response_code(401);

        send_json(
            false,
            "Authentication required",
            null
        );
    }
}

// Check whether the logged-in user is an admin.
function require_admin() {
    require_login();

    if ($_SESSION["role"] !== "admin") {
        http_response_code(403);

        send_json(
            false,
            "Admin access required",
            null
        );
    }
}
