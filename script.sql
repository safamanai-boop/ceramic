CREATE DATABASE IF NOT EXISTS pottery_soul CHARACTER SET utf8;
USE pottery_soul;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category ENUM('mug','bowl','vase','tea') NOT NULL,
    price DECIMAL(6,2) NOT NULL,
    image VARCHAR(200),
    description TEXT,
    stock INT DEFAULT 10
);

CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT DEFAULT 1,
    ordered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO products (name, category, price, image) VALUES
('Morning Mug','mug',10.00,'mug.jpg'),
('Earth Bowl','bowl',11.00,'bowl.jpg'),
('Celadon Bowl','bowl',10.75,'bowl2.jpg'),
('Mini Bowl','bowl',5.25,'bowl3.jpg'),
('Tea Set Classic','tea',12.00,'tea8.jpg'),
('Tall Vase','vase',25.00,'vase11.jpg'),
('Round Vase','vase',32.55,'vase1.jpg');