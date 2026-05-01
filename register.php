<?php
session_start();
require 'config.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['full_name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $pass = $_POST['password'] ?? '';

    if (!$name || !$email || !$pass) {
        echo json_encode(["success" => false, "message" => "Please fill in all fields."]);
        exit;
    }

    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        echo json_encode(["success" => false, "message" => "Email already registered."]);
        exit;
    }

    $hashed = password_hash($pass, PASSWORD_DEFAULT);
    $stmt = $pdo->prepare("INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)");
    $stmt->execute([$name, $email, $hashed]);

    $newId = $pdo->lastInsertId();
    $_SESSION['user_id'] = $newId;
    $_SESSION['user_name'] = $name;

    echo json_encode(["success" => true, "message" => "Account created!", "name" => $name]);
}
?>