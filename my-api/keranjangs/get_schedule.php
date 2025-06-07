<?php
header('Content-Type: application/json');

// Koneksi ke database
$host = "localhost";
$user = "root";
$password = "";
$dbname = "caneaten";

$conn = new mysqli($host, $user, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(['error' => 'Gagal koneksi ke database']);
    exit;
}

// Query untuk ambil data keranjang yang sudah memiliki hari, join dengan menu
$query = "
    SELECT k.id, k.menu_id, k.quantity, k.cart_id, k.day, m.name, m.price
    FROM keranjangs k
    JOIN menus m ON k.menu_id = m.id
    WHERE k.day IS NOT NULL AND k.day != ''
";

// Eksekusi query
$result = $conn->query($query);

$data = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $data[] = [
            'id' => (int)$row['id'],
            'menu_id' => (int)$row['menu_id'],
            'name' => $row['name'],
            'price' => (int)$row['price'],
            'quantity' => (int)$row['quantity'],
            'cart_id' => (int)$row['cart_id'],
            'day' => ucfirst(strtolower($row['day'])) // Untuk pastikan format kapitalisasi
        ];
    }
}

// Fungsi untuk urutkan hari (Senin - Minggu)
function sortByDayOrder($a, $b) {
    $order = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
    return array_search($a['day'], $order) - array_search($b['day'], $order);
}

usort($data, 'sortByDayOrder');

echo json_encode($data);

$conn->close();
?>
