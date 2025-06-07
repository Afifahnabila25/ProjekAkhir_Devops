<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-Type: application/json");


ini_set('display_errors', 1);
error_reporting(E_ALL);

$koneksi = new mysqli("localhost", "root", "", "caneaten");

if ($koneksi->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Koneksi database gagal"]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: *");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    http_response_code(200);
    exit();
}

$action = isset($_GET['action']) ? $_GET['action'] : null;

$method = $_SERVER['REQUEST_METHOD'];

function getLatestCartId($koneksi) {
    $query = "SELECT MAX(cart_id) AS latest_cart_id FROM keranjangs";
    $result = $koneksi->query($query);
    if ($result) {
        $row = $result->fetch_assoc();
        return $row['latest_cart_id'] ?? null;
    }
    return null;
}

if ($action === 'get_new_cart_id') {
    // Ini gabung fungsionalitas get_or_create_cart_id.php
    $latest_cart_id = getLatestCartId($koneksi);
    $new_cart_id = $latest_cart_id + 1;
    echo json_encode(['new_cart_id' => $new_cart_id]);
    exit();
}

if ($method === 'POST') {
    $input = json_decode(file_get_contents("php://input"), true);

    if (!isset($input['menu_id'], $input['quantity'])) {
        http_response_code(400);
        echo json_encode(["error" => "Data tidak lengkap"]);
        exit();
    }

    $menu_id = intval($input['menu_id']);
    $quantity = intval($input['quantity']);
    $cart_id = intval($input['cart_id']);

    // Jika belum ada cart sama sekali, mulai dari 1
    if ($cart_id === null) {
        $cart_id = 1;
    }

    $stmt = $koneksi->prepare("INSERT INTO keranjangs (cart_id, menu_id, quantity) VALUES (?, ?, ?)");
    $stmt->bind_param("iii", $cart_id, $menu_id, $quantity);

    if ($stmt->execute()) {
        http_response_code(201);
        echo json_encode(["message" => "Item berhasil ditambahkan ke keranjang"]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Gagal menambahkan item"]);
    }

    exit();
}

if ($method === 'PUT') {
    $input = json_decode(file_get_contents("php://input"), true);

    if (!isset($input['cart_id']) || !isset($input['day']) || !is_array($input['items'])) {
        http_response_code(400);
        echo json_encode(["error" => "cart_id, day, dan items wajib diisi"]);
        exit();
    }

    $cart_id = intval($input['cart_id']);
    $day = $koneksi->real_escape_string($input['day']);
    $items = $input['items'];

    if (empty($day)) {
    http_response_code(400);
    echo json_encode(["error" => "Day tidak boleh kosong/null"]);
    exit();
}


    // 1. Hapus semua item dengan hari yang sama pada cart ini
    $stmtDelete = $koneksi->prepare("DELETE FROM keranjangs WHERE day = ?");
    $stmtDelete->bind_param("s", $day);
    $stmtDelete->execute();
    $stmtDelete->close();

    // 2. Masukkan item baru
    $stmtInsert = $koneksi->prepare("INSERT INTO keranjangs (cart_id, menu_id, quantity, day) VALUES (?, ?, ?, ?)");

    foreach ($items as $item) {
        if (!isset($item['menu_id'], $item['quantity'])) {
            continue; // skip kalau tidak lengkap
        }

        $menu_id = intval($item['menu_id']);
        $quantity = intval($item['quantity']);

        $stmtInsert->bind_param("iiis", $cart_id, $menu_id, $quantity, $day);
        $success = $stmtInsert->execute();
        if (!$success) {
            error_log("Insert error: " . $stmtInsert->error);
        }
    }

    $stmtInsert->close();

    echo json_encode(["message" => "Keranjang untuk hari $day berhasil disimpan ulang."]);
    exit();
}

if ($method === 'GET') {

    $cart_id = isset($_GET['cart_id']) ? intval($_GET['cart_id']) : getLatestCartId($koneksi);
    $menu_id = isset($_GET['menu_id']) ? intval($_GET['menu_id']) : null;

    if ($menu_id !== null) {
        // Ambil satu item berdasarkan menu_id dan cart_id
        $stmt = $koneksi->prepare("SELECT 
                                        keranjangs.id, 
                                        keranjangs.cart_id,
                                        keranjangs.menu_id, 
                                        keranjangs.quantity,
                                        menus.name, 
                                        menus.price
                                    FROM keranjangs
                                    JOIN menus ON keranjangs.menu_id = menus.id
                                    WHERE keranjangs.cart_id = ? AND keranjangs.menu_id = ?");
        $stmt->bind_param("ii", $cart_id, $menu_id);
    } else {
        // Ambil semua item dari keranjang
        $stmt = $koneksi->prepare("SELECT 
                                        keranjangs.id, 
                                        keranjangs.cart_id,
                                        keranjangs.menu_id, 
                                        keranjangs.quantity,
                                        menus.name, 
                                        menus.price
                                    FROM keranjangs
                                    JOIN menus ON keranjangs.menu_id = menus.id
                                    WHERE keranjangs.cart_id = ?");
        $stmt->bind_param("i", $cart_id);
    }

    $stmt->execute();
    $result = $stmt->get_result();
    $data = [];

    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    echo json_encode($data);
    exit();
}
?>
