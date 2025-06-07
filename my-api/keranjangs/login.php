<?php
header("Content-Type: application/json");
$conn = new mysqli("localhost", "root", "", "caneaten");

$data = json_decode(file_get_contents("php://input"));

$username = $conn->real_escape_string($data->username);
$password = $data->password;

$result = $conn->query("SELECT * FROM users WHERE username='$username'");

if ($result->num_rows === 0) {
    echo json_encode(["message" => "Username tidak ditemukan."]);
    exit;
}

$row = $result->fetch_assoc();

if (password_verify($password, $row['password'])) {
    echo json_encode(["message" => "Login berhasil!"]);
} else {
    echo json_encode(["message" => "Password salah."]);
}
?>
