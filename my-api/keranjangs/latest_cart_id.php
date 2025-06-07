<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$host = 'localhost';
$db = 'caneaten';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

// Buat koneksi
$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);

    $stmt = $pdo->query("SELECT MAX(cart_id) AS latest_cart_id FROM keranjangs");
    $result = $stmt->fetch();

    echo json_encode([
        'latest_cart_id' => $result['latest_cart_id'] ?? 0
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'error' => 'Database error: ' . $e->getMessage()
    ]);
    http_response_code(500);
}
