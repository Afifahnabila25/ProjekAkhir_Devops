<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
// ambil data input dari body
$data = json_decode(file_get_contents("php://input"), true);

// cek data lengkap (id, quantity, cart_id)
if (!isset($data['id']) || !isset($data['quantity']) || !isset($data['cart_id'])) {
    http_response_code(400);
    echo json_encode(["error" => "Data tidak lengkap, id, quantity, dan cart_id wajib"]);
    exit();
}

$id = intval($data['id']);
$quantity = intval($data['quantity']);
$cart_id = intval($data['cart_id']);

$koneksi = new mysqli("localhost", "root", "", "caneaten");

if ($koneksi->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Koneksi database gagal"]);
    exit();
}

// update quantity dengan tambahan kondisi cart_id
$sql = "UPDATE keranjangs SET quantity = ? WHERE id = ? AND cart_id = ?";
$stmt = $koneksi->prepare($sql);
$stmt->bind_param("iii", $quantity, $id, $cart_id);

if ($stmt->execute()) {
    echo json_encode(["message" => "Quantity berhasil diupdate"]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Gagal mengupdate quantity"]);
}
?>
