<?php
header("Content-Type: application/json");
$conn = new mysqli("localhost", "root", "", "caneaten");
$data = json_decode(file_get_contents("php://input"));

$username = $conn->real_escape_string($data->username ?? '');
$password_raw = $data->password ?? '';

if (empty($username) || empty($password_raw)) {
    echo json_encode(["success" => false, "message" => "Username dan password wajib diisi."]);
    exit;
}

$password = password_hash($password_raw, PASSWORD_DEFAULT);

// Cek user sudah ada
$check = $conn->query("SELECT * FROM users WHERE username='$username'");
if ($check->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "Username sudah digunakan!"]);
    exit;
}

$result = $conn->query("INSERT INTO users (username, password) VALUES ('$username', '$password')");

if ($result) {
    echo json_encode(["success" => true, "message" => "Registrasi berhasil!"]);
} else {
    echo json_encode(["success" => false, "message" => "Gagal registrasi."]);
}
?>
