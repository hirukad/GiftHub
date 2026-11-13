<?php
require_once __DIR__ . '/../config/db.php';       // creates $pdo
require_once __DIR__ . '/../config/helpers.php';  // send_json(), require_admin()

require_admin(); // non-admins stop here (401 or 403)

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    send_json(false, 'Method not allowed', null);
}

try {
    // No password column on purpose. No user input, so query() is safe.
    $customersStatement = $pdo->query(
        'SELECT user_id, name, email, role, created_at FROM users ORDER BY user_id'
    );
    $allCustomers = $customersStatement->fetchAll(PDO::FETCH_ASSOC);
    send_json(true, 'Customers loaded', $allCustomers);
} catch (PDOException $error) {
    http_response_code(500);
    send_json(false, 'Could not load customers', null);
}