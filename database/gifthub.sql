CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('customer', 'admin') NOT NULL DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image VARCHAR(255),
    category_id INT,
    stock INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (category_id)
        REFERENCES categories(category_id)
);

CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10, 2) NOT NULL,
    status ENUM(
        'Pending',
        'Processing',
        'Delivered',
        'Cancelled'
    ) NOT NULL DEFAULT 'Pending',
    delivery_name VARCHAR(100) NOT NULL,
    delivery_address TEXT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    payment_method VARCHAR(50) NOT NULL DEFAULT 'COD',

    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
);

CREATE TABLE order_items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    custom_name VARCHAR(100),
    custom_message TEXT,

    FOREIGN KEY (order_id)
        REFERENCES orders(order_id)
        ON DELETE CASCADE,

    FOREIGN KEY (product_id)
        REFERENCES products(product_id)
);

CREATE TABLE occasions (
    occasion_id INT AUTO_INCREMENT PRIMARY KEY,
    occasion_name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE product_occasions (
    product_id INT NOT NULL,
    occasion_id INT NOT NULL,

    PRIMARY KEY (product_id, occasion_id),

    FOREIGN KEY (product_id)
        REFERENCES products(product_id)
        ON DELETE CASCADE,

    FOREIGN KEY (occasion_id)
        REFERENCES occasions(occasion_id)
        ON DELETE CASCADE
);



INSERT INTO categories (category_id, name, description)
VALUES
(1, 'Mugs & Drinkware', 'Personalized mugs and drinkware, perfect for adding a special touch to everyday moments.'),
(2, 'Photo Frames', 'Beautiful photo frames to preserve and display your favourite memories and special moments.'),
(3, 'Cushions & Home Decor', 'Custom cushions and decorative gifts that bring personality and warmth to any space.'),
(4, 'Keychains & Accessories', 'Personalized keychains, bracelets, and accessories made to keep meaningful memories close.'),
(5, 'Greeting Cards & Gift Boxes', 'Thoughtful greeting cards and beautifully arranged gift boxes for every special occasion.')
ON DUPLICATE KEY UPDATE
name = VALUES(name),
description = VALUES(description);


INSERT INTO products
(name, description, price, image, category_id, stock)
VALUES
('Personalized Mug', 'A personalized mug', 1500.00, 'mug.jpg', 1, 10),
('Magic Colour-Change Mug', 'A colour-changing personalized mug', 2200.00, 'magic-mug.jpg', 1, 8),
('Custom Water Bottle', 'A custom water bottle', 2500.00, 'bottle.jpg', 1, 12),
('Wooden Photo Frame', 'A personalized wooden photo frame', 2800.00, 'wooden-frame.jpg', 2, 10),
('Collage Photo Frame', 'A collage photo frame', 3500.00, 'collage-frame.jpg', 2, 6),
('Name Printed Cushion', 'A cushion with a printed name', 2300.00, 'cushion.jpg', 3, 10),
('Photo Cushion', 'A cushion with a personalized photo', 2600.00, 'photo-cushion.jpg', 3, 8),
('Engraved Wooden Keychain', 'A wooden keychain with custom engraving', 800.00, 'keychain.jpg', 4, 25),
('Name Bracelet', 'A bracelet with a personalized name', 1200.00, 'bracelet.jpg', 4, 15),
('Personalized Greeting Card', 'A greeting card with a custom message', 600.00, 'card.jpg', 5, 30),
('Mini Gift Box Set', 'A set of mini gift boxes', 3200.00, 'gift-box.jpg', 5, 7),
('Custom Name Pen', 'A pen personalized with a custom name', 900.00, 'custom-name-pen.jpg', 4, 10),
('Birthday Backdrop/Setup', 'Decorative birthday backdrop setup', 8500.00, 'birthday-backdrop.jpg', NULL, 8),
('Birthday Cake', 'Special birthday celebration cake', 4500.00, 'birthday-cake.jpg', NULL, 12),
('Rose Bouquet', 'Beautiful rose bouquet for special occasions', 5500.00, 'rose-bouquet.png', NULL, 15),
('Anniversary Rings', 'Decorative anniversary rings', 3500.00, 'anniversary-rings.jpg', 4, 12),
('Couple Photo Mug', 'Personalized mug featuring a couple photo', 1800.00, 'personalised-mug.jpg', 1, 15),
('Freestanding Message Plaque', 'Personalized freestanding message plaque', 3200.00, 'message-plaque.jpg', NULL, 10),
('Chocolates and Wine Gift Box', 'Special chocolates and wine gift box', 7500.00, 'chocolate-wine-gift-box.jpg', 5, 8),
('Graduation Gift Box', 'Special gift box for graduation celebrations', 4500.00, 'graduation-gift-box.jpg', 5, 10),
('Personalized Handbag', 'Handbag with personalized details', 4800.00, 'personalized-handbag.jpg', 4, 10),
('Christmas Chocolates', 'Chocolate gift selection for Christmas', 2500.00, 'christmas-chocolates.jpg', NULL, 20),
('Christmas Wine Gift Box', 'Wine gift box for Christmas', 6500.00, 'christmas-wine-gift-box.jpg', 5, 10),
('Christmas Cake', 'Special Christmas celebration cake', 5000.00, 'christmas-cake.jpg', NULL, 12),
('Christmas Family Wear Set', 'Matching family clothing set for Christmas', 9500.00, 'christmas-family-wear-set.jpg', NULL, 8);


INSERT INTO occasions (occasion_id, occasion_name)
VALUES
(1, 'Birthdays'),
(2, 'Anniversaries'),
(3, 'Graduations'),
(4, 'Mother''s Day'),
(5, 'Christmas')
ON DUPLICATE KEY UPDATE
occasion_name = VALUES(occasion_name);


INSERT INTO product_occasions (product_id, occasion_id)
VALUES
(10, 1), (11, 1), (1, 1), (7, 1), (6, 1),
(10, 2), (11, 2), (9, 2),
(4, 3), (12, 3), (11, 3), (10, 3), (2, 3),
(1, 4), (2, 4), (5, 4), (7, 4), (10, 4), (9, 4),
(11, 5);

INSERT INTO product_occasions (product_id, occasion_id)
VALUES

(10, 1), (11, 1), (1, 1), (7, 1), (6, 1),
(13, 1), (14, 1),


(10, 2), (11, 2), (9, 2),
(15, 2), (16, 2), (17, 2), (18, 2), (19, 2),


(4, 3), (12, 3), (11, 3), (10, 3), (2, 3),
(20, 3),


(1, 4), (2, 4), (5, 4), (7, 4), (10, 4), (9, 4),
(21, 4),


(11, 5),
(22, 5), (23, 5), (24, 5), (25, 5);