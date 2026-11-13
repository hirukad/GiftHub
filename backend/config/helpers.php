<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}


function start_session_once() {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
}


function send_json($success, $message, $data = null) {
    header("Content-Type: application/json");

    echo json_encode([
        "success" => $success,
        "message" => $message,
        "data" => $data
    ]);

    exit;
}


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
