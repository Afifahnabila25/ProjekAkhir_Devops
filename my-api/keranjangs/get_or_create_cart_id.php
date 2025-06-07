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

// Buat koneksi (pakai mysqli, bukan PDO di script ini)
$koneksi = mysqli_connect($host, $user, $pass, $db);

if (!$koneksi) {
    http_response_code(500);
    echo json_encode(['error' => 'Gagal koneksi ke database']);
    exit;
}

// Ambil cart_id terakhir
$query = "SELECT MAX(cart_id) AS latest_cart_id FROM keranjangs";
$result = mysqli_query($koneksi, $query);
$data = mysqli_fetch_assoc($result);
$latest_cart_id = $data['latest_cart_id'] ?? 0;

// Tambahkan +1
$new_cart_id = $latest_cart_id + 1;

// Tidak perlu insert, cukup dikirim ke frontend
echo json_encode(['new_cart_id' => $new_cart_id]);
?>
