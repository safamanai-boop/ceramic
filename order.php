<?php
session_start();
require 'config.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $product_id = intval($_POST['product_id'] ?? 0);
    $user_id = $_SESSION['user_id'] ?? null;

    if (!$user_id) {
        echo json_encode(["success" => false, "message" => "not_logged_in"]);
        exit;
    }

    if (!$product_id) {
        echo json_encode(["success" => false, "message" => "Invalid product."]);
        exit;
    }

    $stmt = $pdo->prepare("INSERT INTO orders (user_id, product_id) VALUES (?, ?)");
    $stmt->execute([$user_id, $product_id]);

    echo json_encode(["success" => true, "message" => "Order placed!"]);
}
?>