<?php
require 'config.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['full_name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $message = trim($_POST['message'] ?? '');

    if (!$name || !$email || !$message) {
        echo json_encode(["success" => false, "message" => "All fields required."]);
        exit;
    }

    $stmt = $pdo->prepare("INSERT INTO reviews (full_name, email, message) VALUES (?, ?, ?)");
    $stmt->execute([$name, $email, $message]);

    echo json_encode(["success" => true, "message" => "Review saved!"]);
}
?>