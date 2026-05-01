<?php
session_start();
require 'config.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = intval($_POST['id'] ?? 0);
    $qty = intval($_POST['quantity'] ?? 1);

    if (!$id || $qty < 1) {
        echo json_encode(['success' => false, 'message' => 'Invalid data.']);
        exit;
    }

    $stmt = $pdo->prepare("UPDATE orders SET quantity = ? WHERE id = ?");
    $stmt->execute([$qty, $id]);
    echo json_encode(['success' => true]);
}
?>