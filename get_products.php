<?php
require 'config.php';
header('Content-Type: application/json');

$category = $_GET['category'] ?? '';

if ($category) {
    $stmt = $pdo->prepare("SELECT * FROM products WHERE category = ?");
    $stmt->execute([$category]);
} else {
    $stmt = $pdo->query("SELECT * FROM products");
}

echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
?>