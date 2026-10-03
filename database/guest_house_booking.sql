CREATE DATABASE IF NOT EXISTS guest_house_booking;

USE guest_house_booking;


-- =========================================================
-- 1. USERS
-- Admin, manager, receptionist and staff accounts
-- =========================================================

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,

    role ENUM(
        'ADMIN',
        'MANAGER',
        'RECEPTIONIST',
        'STAFF'
    ) DEFAULT 'STAFF',

    status ENUM(
        'ACTIVE',
        'INACTIVE'
    ) DEFAULT 'ACTIVE',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);


-- =========================================================
-- 2. GUESTS
-- Customer/guest information
-- =========================================================

CREATE TABLE guests (
    id INT PRIMARY KEY AUTO_INCREMENT,

    name VARCHAR(150) NOT NULL,
    email VARCHAR(150),
    phone VARCHAR(30),
    address VARCHAR(255),

    id_type VARCHAR(50),
    id_number VARCHAR(100),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);


-- =========================================================
-- 3. ROOM CATEGORIES
-- Example:
-- Single Room
-- Double Room
-- Deluxe Room
-- Suite
-- =========================================================

CREATE TABLE room_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,

    name VARCHAR(100) NOT NULL,
    description TEXT,

    price_per_night DECIMAL(10,2) NOT NULL,
    max_guests INT NOT NULL,

    status ENUM(
        'ACTIVE',
        'INACTIVE'
    ) DEFAULT 'ACTIVE',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);


-- =========================================================
-- 4. ROOMS
-- Individual physical rooms
-- =========================================================

CREATE TABLE rooms (
    id INT PRIMARY KEY AUTO_INCREMENT,

    room_number VARCHAR(20) UNIQUE NOT NULL,

    category_id INT NOT NULL,

    floor INT,
    description TEXT,

    status ENUM(
        'AVAILABLE',
        'OCCUPIED',
        'MAINTENANCE',
        'INACTIVE'
    ) DEFAULT 'AVAILABLE',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (category_id)
        REFERENCES room_categories(id)
);


-- =========================================================
-- 5. AMENITIES
-- Example:
-- WiFi
-- TV
-- AC
-- Hot Water
-- Balcony
-- =========================================================

CREATE TABLE amenities (
    id INT PRIMARY KEY AUTO_INCREMENT,

    name VARCHAR(100) NOT NULL,
    description TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================================
-- 6. ROOM AMENITIES
-- Many-to-many relationship between rooms and amenities
-- =========================================================

CREATE TABLE room_amenities (
    room_id INT NOT NULL,
    amenity_id INT NOT NULL,

    PRIMARY KEY (room_id, amenity_id),

    FOREIGN KEY (room_id)
        REFERENCES rooms(id)
        ON DELETE CASCADE,

    FOREIGN KEY (amenity_id)
        REFERENCES amenities(id)
        ON DELETE CASCADE
);


-- =========================================================
-- 7. ROOM MEDIA
-- Stores image/video URLs or file paths
-- =========================================================

CREATE TABLE room_media (
    id INT PRIMARY KEY AUTO_INCREMENT,

    room_id INT NOT NULL,

    media_type ENUM(
        'IMAGE',
        'VIDEO'
    ) NOT NULL,

    media_url VARCHAR(500) NOT NULL,

    caption VARCHAR(255),

    is_primary BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (room_id)
        REFERENCES rooms(id)
        ON DELETE CASCADE
);


-- =========================================================
-- 8. BOOKINGS
-- Main booking information
-- =========================================================

CREATE TABLE bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,

    guest_id INT NOT NULL,

    booking_reference VARCHAR(50) UNIQUE NOT NULL,

    check_in DATETIME NOT NULL,
    check_out DATETIME NOT NULL,

    booking_source ENUM(
        'ONLINE',
        'OFFLINE'
    ) NOT NULL,

    status ENUM(
        'PENDING',
        'CONFIRMED',
        'CHECKED_IN',
        'CHECKED_OUT',
        'CANCELLED'
    ) DEFAULT 'PENDING',

    special_request TEXT,

    created_by INT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (guest_id)
        REFERENCES guests(id),

    FOREIGN KEY (created_by)
        REFERENCES users(id),

    CHECK (check_out > check_in)
);


-- =========================================================
-- 9. BOOKING ROOMS
-- Connects bookings with individual rooms
-- =========================================================

CREATE TABLE booking_rooms (
    id INT PRIMARY KEY AUTO_INCREMENT,

    booking_id INT NOT NULL,
    room_id INT NOT NULL,

    number_of_guests INT DEFAULT 1,

    price_per_night DECIMAL(10,2) NOT NULL,

    number_of_nights INT NOT NULL,

    subtotal DECIMAL(10,2) NOT NULL,

    FOREIGN KEY (booking_id)
        REFERENCES bookings(id)
        ON DELETE CASCADE,

    FOREIGN KEY (room_id)
        REFERENCES rooms(id),

    UNIQUE (booking_id, room_id)
);


-- =========================================================
-- 10. PAYMENTS
-- Online/offline booking payments
-- =========================================================

CREATE TABLE payments (
    id INT PRIMARY KEY AUTO_INCREMENT,

    booking_id INT NOT NULL,

    amount DECIMAL(10,2) NOT NULL,

    payment_method ENUM(
        'CASH',
        'CARD',
        'ONLINE'
    ) NOT NULL,

    payment_status ENUM(
        'PENDING',
        'PAID',
        'FAILED',
        'REFUNDED'
    ) DEFAULT 'PENDING',

    transaction_id VARCHAR(150),

    paid_at DATETIME,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (booking_id)
        REFERENCES bookings(id)
);


-- =========================================================
-- 11. FOOD CATEGORIES
-- Example:
-- Breakfast
-- Lunch
-- Dinner
-- Drinks
-- Snacks
-- =========================================================

CREATE TABLE food_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,

    name VARCHAR(100) NOT NULL,

    status ENUM(
        'ACTIVE',
        'INACTIVE'
    ) DEFAULT 'ACTIVE',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================================
-- 12. FOOD ITEMS
-- =========================================================

CREATE TABLE food_items (
    id INT PRIMARY KEY AUTO_INCREMENT,

    category_id INT NOT NULL,

    name VARCHAR(150) NOT NULL,

    description TEXT,

    price DECIMAL(10,2) NOT NULL,

    image_url VARCHAR(500),

    status ENUM(
        'AVAILABLE',
        'UNAVAILABLE'
    ) DEFAULT 'AVAILABLE',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (category_id)
        REFERENCES food_categories(id)
);


-- =========================================================
-- 13. FOOD ORDERS
-- Customer food order
-- =========================================================

CREATE TABLE food_orders (
    id INT PRIMARY KEY AUTO_INCREMENT,

    booking_id INT,

    guest_id INT NOT NULL,

    room_id INT,

    order_type ENUM(
        'ROOM',
        'RESTAURANT'
    ) NOT NULL,

    status ENUM(
        'PENDING',
        'CONFIRMED',
        'PREPARING',
        'READY',
        'DELIVERED',
        'CANCELLED'
    ) DEFAULT 'PENDING',

    total_amount DECIMAL(10,2) DEFAULT 0,

    special_instruction TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (booking_id)
        REFERENCES bookings(id),

    FOREIGN KEY (guest_id)
        REFERENCES guests(id),

    FOREIGN KEY (room_id)
        REFERENCES rooms(id)
);


-- =========================================================
-- 14. FOOD ORDER ITEMS
-- Individual food items inside an order
-- =========================================================

CREATE TABLE food_order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,

    order_id INT NOT NULL,

    food_item_id INT NOT NULL,

    quantity INT NOT NULL,

    unit_price DECIMAL(10,2) NOT NULL,

    subtotal DECIMAL(10,2) NOT NULL,

    FOREIGN KEY (order_id)
        REFERENCES food_orders(id)
        ON DELETE CASCADE,

    FOREIGN KEY (food_item_id)
        REFERENCES food_items(id)
);


-- =========================================================
-- 15. EXPENSES
-- Additional expenses charged to a guest
-- =========================================================

CREATE TABLE expenses (
    id INT PRIMARY KEY AUTO_INCREMENT,

    booking_id INT NOT NULL,

    expense_type ENUM(
        'ROOM',
        'FOOD',
        'SERVICE',
        'OTHER'
    ) NOT NULL,

    description VARCHAR(255),

    amount DECIMAL(10,2) NOT NULL,

    reference_id INT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (booking_id)
        REFERENCES bookings(id)
);


-- =========================================================
-- 16. INVOICES
-- Final bill generated during checkout
-- =========================================================

CREATE TABLE invoices (
    id INT PRIMARY KEY AUTO_INCREMENT,

    booking_id INT NOT NULL UNIQUE,

    invoice_number VARCHAR(50) UNIQUE NOT NULL,

    subtotal DECIMAL(10,2) NOT NULL,

    tax DECIMAL(10,2) DEFAULT 0,

    discount DECIMAL(10,2) DEFAULT 0,

    total_amount DECIMAL(10,2) NOT NULL,

    paid_amount DECIMAL(10,2) DEFAULT 0,

    due_amount DECIMAL(10,2) DEFAULT 0,

    status ENUM(
        'UNPAID',
        'PARTIAL',
        'PAID'
    ) DEFAULT 'UNPAID',

    issued_at DATETIME,

    FOREIGN KEY (booking_id)
        REFERENCES bookings(id)
);


-- =========================================================
-- 17. WEBSITE SETTINGS
-- Dynamic global website settings
-- =========================================================

CREATE TABLE website_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,

    setting_key VARCHAR(100) UNIQUE NOT NULL,

    setting_value TEXT,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);


-- =========================================================
-- 18. WEBSITE PAGES
-- Dynamic pages such as:
-- About
-- Contact
-- Services
-- Gallery
-- =========================================================

CREATE TABLE website_pages (
    id INT PRIMARY KEY AUTO_INCREMENT,

    title VARCHAR(200) NOT NULL,

    slug VARCHAR(200) UNIQUE NOT NULL,

    content TEXT,

    status ENUM(
        'PUBLISHED',
        'DRAFT'
    ) DEFAULT 'DRAFT',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);


-- =========================================================
-- 19. WEBSITE SECTIONS
-- Dynamic sections inside website pages
-- =========================================================

CREATE TABLE website_sections (
    id INT PRIMARY KEY AUTO_INCREMENT,

    page_id INT NOT NULL,

    section_type VARCHAR(50),

    title VARCHAR(255),

    content TEXT,

    image_url VARCHAR(500),

    display_order INT DEFAULT 0,

    status ENUM(
        'ACTIVE',
        'INACTIVE'
    ) DEFAULT 'ACTIVE',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (page_id)
        REFERENCES website_pages(id)
        ON DELETE CASCADE
);