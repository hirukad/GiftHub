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


-- Sample categories
INSERT INTO categories (name, description) VALUES
('Birthday Gifts', 'Special gifts for birthdays'),
('Anniversary Gifts', 'Gifts for anniversaries and couples'),
('Personalized Gifts', 'Custom-made gifts for loved ones');

-- Sample products
INSERT INTO products
(name, description, price, image, category_id, stock)
VALUES
('Personalized Mug', 'A custom mug for someone special', 1500.00, 'mug.jpg', 3, 20),
('Birthday Gift Box', 'A beautiful birthday gift box', 2500.00, 'giftbox.jpg', 1, 15),
('Anniversary Photo Frame', 'A special photo frame for couples', 1800.00, 'frame.jpg', 2, 10),
('Personalized Keychain', 'A customized keychain gift', 800.00, 'keychain.jpg', 3, 30),
('Birthday Teddy Bear', 'A soft teddy bear for birthdays', 2200.00, 'teddy.jpg', 1, 12);
