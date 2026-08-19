CREATE DATABASE plater_db;


CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';


SELECT * FROM users;






CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(150) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES customers(id),
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


INSERT INTO customers (name, email)
VALUES
('Ali', 'ali@gmail.com'),
('Ahmed', 'ahmed@gmail.com'),
('Usman', 'usman@gmail.com'),
('Hamza', 'hamza@gmail.com'),
('Bilal', 'bilal@gmail.com');

INSERT INTO customers (name, email)
VALUES
('Hassan', 'hassan@gmail.com'),
('Umar', 'umar@gmail.com'),
('Saad', 'saad@gmail.com'),
('Zain', 'zain@gmail.com'),
('Huzaifa', 'huzaifa@gmail.com'),
('Abdullah', 'abdullah@gmail.com'),
('Talha', 'talha@gmail.com'),
('Ahsan', 'ahsan@gmail.com'),
('Danish', 'danish@gmail.com'),
('Shahzaib', 'shahzaib@gmail.com');


SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'orders'
ORDER BY ordinal_position;

SELECT id, * 
FROM customers
ORDER BY id;


INSERT INTO orders (customer_id, status)
VALUES

-- 6 New Orders
(1, 'new'),
(2, 'new'),
(3, 'new'),
(4, 'new'),
(5, 'new'),
(8, 'new'),

-- 9 Pending Orders
(9, 'pending'),
(10, 'pending'),
(11, 'pending'),
(12, 'pending'),
(13, 'pending'),
(14, 'pending'),
(15, 'pending'),
(16, 'pending'),
(17, 'pending'),

-- 6 Completed Orders
(1, 'completed'),
(2, 'completed'),
(3, 'completed'),
(4, 'completed'),
(5, 'completed'),
(8, 'completed');

SELECT status, COUNT(*)
FROM orders
GROUP BY status
ORDER BY status;

SELECT COUNT(*) AS total_orders
FROM orders;


SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'orders'
ORDER BY ordinal_position;

SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'customers'
ORDER BY ordinal_position;

ALTER TABLE customers
ADD COLUMN phone VARCHAR(20);

ALTER TABLE orders
ADD COLUMN items INTEGER DEFAULT 1,
ADD COLUMN amount NUMERIC(10,2) DEFAULT 0;

SELECT * FROM customers;

UPDATE customers
SET phone = '+923173008513'
WHERE id = 13;

SELECT id, name, email, phone
FROM customers
WHERE id = 13;


SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'orders'
ORDER BY ordinal_position;


INSERT INTO orders
(customer_id, status, created_at, items, amount)
VALUES
(13, 'completed', '2023-12-08 10:00:00', 2, 2500.00),
(13, 'in process', '2023-12-08 11:00:00', 2, 3200.00),
(13, 'cancelled', '2023-12-08 12:00:00', 2, 1800.00),
(13, 'completed', '2023-12-08 13:00:00', 2, 2500.00),
(13, 'completed', '2023-12-08 14:00:00', 2, 2900.00),
(13, 'in process', '2024-04-30 10:00:00', 2, 3500.00),
(13, 'completed', '2023-11-05 11:00:00', 2, 2100.00),


SELECT
    o.id,
    c.name AS customer,
    c.phone,
    o.items,
    o.amount,
    o.status,
    o.created_at
FROM orders o
JOIN customers c
    ON o.customer_id = c.id
ORDER BY o.id;
(13, 'in process', '2024-07-22 12:00:00', 2, 4000.00),
(13, 'cancelled', '2023-01-18 13:00:00', 2, 1500.00);


UPDATE orders
SET amount = CASE id
    WHEN 22 THEN 1800.00
    WHEN 23 THEN 2200.00
    WHEN 24 THEN 1500.00
    WHEN 25 THEN 3000.00
    WHEN 26 THEN 2700.00
    WHEN 27 THEN 3500.00
    WHEN 28 THEN 2100.00
    WHEN 29 THEN 4000.00
    WHEN 30 THEN 1900.00
    WHEN 31 THEN 2500.00
    WHEN 32 THEN 3200.00
    WHEN 33 THEN 2800.00
    WHEN 34 THEN 2300.00
    WHEN 35 THEN 3100.00
    WHEN 36 THEN 2000.00
    WHEN 37 THEN 2900.00
    WHEN 38 THEN 3500.00
    WHEN 39 THEN 1800.00
    WHEN 40 THEN 2600.00
    WHEN 41 THEN 3000.00
    WHEN 42 THEN 2400.00
    ELSE amount
END;


select*from orders;

UPDATE customers
SET phone = '+923173008513'
WHERE phone IS NULL;



CREATE TABLE menu_items (
    id SERIAL PRIMARY KEY,
    item_name VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    price NUMERIC(10,2) NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'in_stock',
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO menu_items
(item_name, category, price, status, image)
VALUES
('Burger', 'Burgers', 120, 'in_stock', '/burger.png'),
('Burger', 'Burgers', 120, 'out_of_stock', '/burger.png'),
('Burger', 'Burgers', 120, 'in_stock', '/burger.png'),
('Burger', 'Burgers', 120, 'in_stock', '/burger.png'),
('Burger', 'Burgers', 120, 'in_stock', '/burger.png'),
('Burger', 'Burgers', 120, 'out_of_stock', '/burger.png'),
('Burger', 'Burgers', 120, 'in_stock', '/burger.png'),
('Burger', 'Burgers', 120, 'out_of_stock', '/burger.png'),
('Burger', 'Burgers', 120, 'in_stock', '/burger.png');


SELECT * FROM menu_items ORDER BY id DESC;



INSERT INTO menu_items
(item_name, category, price, status, image)
VALUES
('Burger', 'P', 450, 'in_stock', '/burger.png');



INSERT INTO categories
(category_name, description, item_count, status)
VALUES
('Wraps', 'Delicious fresh wraps with different fillings...', 4, 'active'),
('Fries', 'Crispy golden fries served with tasty sauces...', 5, 'active'),
('Ice Cream', 'Creamy and delicious ice cream desserts...', 3, 'inactive');


SELECT * FROM customers;


ALTER TABLE users
ADD COLUMN IF NOT EXISTS phone VARCHAR(30),
ADD COLUMN IF NOT EXISTS location VARCHAR(255);

SELECT id, name, email, role, phone, location, created_at
FROM users;



ALTER TABLE users
ADD COLUMN two_factor_enabled BOOLEAN DEFAULT false,
ADD COLUMN last_login TIMESTAMP;

CREATE TABLE login_activity (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(100),
    user_agent TEXT
);