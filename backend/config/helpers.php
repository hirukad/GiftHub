
<?php

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
