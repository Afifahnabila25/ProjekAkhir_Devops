<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Ambil menu_id dan cart_id dari URL
if (!isset($_GET['menu_id']) || !isset($_GET['cart_id'])) {
    http_response_code(400);
    echo json_encode(["error" => "menu_id dan cart_id harus diberikan"]);
    exit();
}

$menu_id = intval($_GET['menu_id']);
$cart_id = intval($_GET['cart_id']);

$koneksi = new mysqli("localhost", "root", "", "caneaten");

if ($koneksi->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Koneksi database gagal"]);
    exit();
}

// Hapus data berdasarkan menu_id dan cart_id
$sql = "DELETE FROM keranjangs WHERE menu_id = ? AND cart_id = ?";
$stmt = $koneksi->prepare($sql);
$stmt->bind_param("ii", $menu_id, $cart_id);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        // Kalau affected_rows == 0, artinya data sudah tidak ada di DB,
        // tapi anggap ini juga sukses karena item memang sudah tidak ada
        echo json_encode(["message" => "Item berhasil dihapus atau sudah tidak ada di keranjang"]);
    }
} else {
    http_response_code(500);
    echo json_encode(["error" => "Gagal menghapus item"]);
}

$stmt->close();
$koneksi->close();
?>
