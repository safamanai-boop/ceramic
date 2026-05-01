<?php
session_start();
require 'config.php';
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["error" => "not_logged_in"]);
    exit;
}

$user_id = intval($_SESSION['user_id']);

$stmt = $pdo->prepare("
    SELECT 
        o.id         AS order_id,
        o.quantity,
        o.ordered_at,
        p.name       AS product_name,
        p.category,
        p.price,
        p.image
    FROM orders o
    JOIN products p ON o.product_id = p.id
    WHERE o.user_id = ?
    ORDER BY o.ordered_at DESC
");

$stmt->execute([$user_id]);
$orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($orders);
?>