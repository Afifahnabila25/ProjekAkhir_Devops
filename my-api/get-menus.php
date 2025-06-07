<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // tambahkan ini
header("Access-Control-Allow-Headers: Content-Type"); // jika perlu header tambahan
header("Content-Type: application/json");

// Tangani preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
// Koneksi ke database
$host = "localhost";
$user = "root";
$password = ""; // default XAMPP tanpa password
$database = "caneaten"; // ganti sesuai nama databasenya

$conn = new mysqli($host, $user, $password, $database);

// Cek koneksi
if ($conn->connect_error) {
    die(json_encode(["error" => "Koneksi gagal: " . $conn->connect_error]));
}

// Ambil data dari tabel menus
$sql = "SELECT * FROM menus";
$result = $conn->query($sql);

$menus = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $menus[] = $row;
    }
}

// Output JSON
echo json_encode(["menus" => $menus]);

$conn->close();

