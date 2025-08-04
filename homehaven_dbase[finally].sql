-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 03, 2025 at 02:45 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `homehaven_dbase`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_logs`
--

CREATE TABLE `activity_logs` (
  `log_id` int(11) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `action` varchar(255) NOT NULL,
  `model_type` varchar(100) DEFAULT NULL,
  `model_id` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `activity_logs`
--

INSERT INTO `activity_logs` (`log_id`, `user_id`, `action`, `model_type`, `model_id`, `description`, `ip_address`, `user_agent`, `created_at`) VALUES
(1, 1, 'user_login', 'user', 1, 'Admin logged in successfully', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '2025-08-03 06:53:54'),
(2, 1, 'user_registration', 'user', 1, 'Admin account created', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '2025-08-03 06:53:54'),
(3, 2, 'user_login', 'user', 2, 'Customer logged in successfully', '192.168.1.101', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', '2025-08-03 06:53:54'),
(4, 2, 'order_placed', 'orderinfo', 4, 'Order placed: ORD-1752827251559 with 1 items, total: ₱8999.00', '192.168.1.101', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', '2025-08-03 06:53:54'),
(5, 2, 'review_submitted', 'reviews', 30, 'Review submitted for product ID 30 with rating 5', '192.168.1.101', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', '2025-08-03 06:53:54'),
(6, 3, 'user_login', 'user', 3, 'Seller logged in successfully', '192.168.1.102', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36', '2025-08-03 06:53:54'),
(7, 3, 'product_created', 'item', 21, 'Product \"3item\" added with SKU: SKUU', '192.168.1.102', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36', '2025-08-03 06:53:54'),
(8, 3, 'product_updated', 'item', 30, 'Product \"prod12\" updated with SKU: something', '192.168.1.102', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36', '2025-08-03 06:53:54'),
(9, 5, 'user_registration', 'user', 5, 'New user registered', '192.168.1.103', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15', '2025-08-03 06:53:54'),
(10, 5, 'user_login', 'user', 5, 'Customer logged in successfully', '192.168.1.103', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15', '2025-08-03 06:53:55'),
(11, 5, 'order_placed', 'orderinfo', 8, 'Order placed: ORD-1753156685350 with 1 items, total: ₱99.00', '192.168.1.103', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15', '2025-08-03 06:53:55'),
(12, 2, 'user_login', 'user', 2, 'User logged in successfully', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 OPR/120.0.0.0', '2025-08-03 08:37:19'),
(13, 2, 'user_login', 'user', 2, 'User logged in successfully', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 OPR/120.0.0.0', '2025-08-03 08:41:00'),
(14, 2, 'order_placed', 'orderinfo', 14, 'Order placed: ORD-1754214172242 with 1 items, total: ₱17998', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 OPR/120.0.0.0', '2025-08-03 09:42:52'),
(15, 1, 'user_login', 'user', 1, 'User logged in successfully', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 OPR/120.0.0.0', '2025-08-03 10:18:40'),
(16, 6, 'user_login', 'user', 6, 'Seller logged in successfully', '192.168.1.104', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '2025-08-03 02:00:00'),
(17, 7, 'user_login', 'user', 7, 'Seller logged in successfully', '192.168.1.105', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', '2025-08-03 03:00:00'),
(18, 8, 'user_login', 'user', 8, 'Seller logged in successfully', '192.168.1.106', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36', '2025-08-03 04:00:00'),
(19, 9, 'user_login', 'user', 9, 'Customer logged in successfully', '192.168.1.107', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15', '2025-08-03 05:00:00'),
(20, 10, 'user_login', 'user', 10, 'Customer logged in successfully', '192.168.1.108', 'Mozilla/5.0 (Android; Mobile; rv:68.0) Gecko/68.0 Firefox/68.0', '2025-08-03 06:00:00'),
(21, 11, 'user_login', 'user', 11, 'Customer logged in successfully', '192.168.1.109', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '2025-08-03 07:00:00'),
(22, 6, 'product_created', 'item', 32, 'Product \"Modern L-Shaped Sofa\" added with SKU: SKU-LVR-004', '192.168.1.104', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '2025-07-25 02:00:00'),
(23, 7, 'product_created', 'item', 36, 'Product \"Traditional Wooden Coffee Table\" added with SKU: SKU-LVR-005', '192.168.1.105', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', '2025-07-26 01:00:00'),
(24, 8, 'product_created', 'item', 40, 'Product \"Minimalist TV Stand\" added with SKU: SKU-LVR-006', '192.168.1.106', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36', '2025-07-27 00:00:00'),
(25, 9, 'order_placed', 'orderinfo', 15, 'Order placed: ORD-1754215000001 with 1 items, total: ₱15999.00', '192.168.1.107', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15', '2025-08-03 02:00:00'),
(26, 10, 'order_placed', 'orderinfo', 16, 'Order placed: ORD-1754215000002 with 1 items, total: ₱4500.00', '192.168.1.108', 'Mozilla/5.0 (Android; Mobile; rv:68.0) Gecko/68.0 Firefox/68.0', '2025-08-03 03:00:00'),
(27, 11, 'order_placed', 'orderinfo', 17, 'Order placed: ORD-1754215000003 with 1 items, total: ₱12000.00', '192.168.1.109', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '2025-08-03 04:00:00'),
(28, 3, 'review_submitted', 'reviews', 5, 'Review submitted for product ID 32 with rating 5', '192.168.1.107', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15', '2025-08-04 02:00:00'),
(29, 4, 'review_submitted', 'reviews', 6, 'Review submitted for product ID 36 with rating 4', '192.168.1.108', 'Mozilla/5.0 (Android; Mobile; rv:68.0) Gecko/68.0 Firefox/68.0', '2025-08-04 03:00:00'),
(30, 5, 'review_submitted', 'reviews', 7, 'Review submitted for product ID 37 with rating 5', '192.168.1.109', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '2025-08-04 04:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `admin_warnings`
--

CREATE TABLE `admin_warnings` (
  `warning_id` int(11) NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `admin_id` bigint(20) UNSIGNED NOT NULL,
  `warning_type` enum('minor','moderate','severe') NOT NULL DEFAULT 'minor',
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `is_resolved` tinyint(1) DEFAULT 0,
  `resolved_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin_warnings`
--

INSERT INTO `admin_warnings` (`warning_id`, `user_id`, `admin_id`, `warning_type`, `title`, `message`, `is_resolved`, `resolved_at`, `created_at`, `updated_at`) VALUES
(1, 13, 1, 'minor', 'Inactive Account', 'User account has been inactive for 30 days', 0, NULL, '2025-08-03 07:00:00', '2025-08-03 07:00:00'),
(2, 14, 1, 'moderate', 'Account Suspension', 'Multiple failed login attempts detected', 0, NULL, '2025-08-03 08:00:00', '2025-08-03 08:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `category_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`category_id`, `name`, `description`, `is_active`, `created_at`) VALUES
(1, 'Living Room', 'Furniture and decor for living spaces', 1, NULL),
(2, 'Bedroom', 'Bedroom furniture and accessories', 1, NULL),
(3, 'Kitchen & Dining', 'Kitchen and dining room essentials', 1, NULL),
(4, 'Bathroom', 'Bathroom fixtures and accessories', 1, NULL),
(5, 'Office', 'Home office furniture and decor', 1, NULL),
(6, 'Outdoor', 'Outdoor furniture and garden decor', 1, NULL),
(7, 'Lighting', 'Lamps, fixtures, and lighting solutions', 1, NULL),
(8, 'Storage', 'Storage solutions and organization', 1, NULL),
(9, 'Wall Art', 'Paintings, prints, and wall decorations', 1, NULL),
(10, 'Seasonal', 'Holiday and seasonal decorations', 1, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `coupons`
--

CREATE TABLE `coupons` (
  `coupon_id` int(11) NOT NULL,
  `code` varchar(50) NOT NULL,
  `type` enum('percentage','fixed_amount') NOT NULL,
  `value` decimal(10,2) NOT NULL,
  `minimum_amount` decimal(10,2) DEFAULT NULL,
  `maximum_discount` decimal(10,2) DEFAULT NULL,
  `usage_limit` int(11) DEFAULT NULL,
  `used_count` int(11) DEFAULT 0,
  `starts_at` datetime DEFAULT NULL,
  `expires_at` datetime DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `coupons`
--

INSERT INTO `coupons` (`coupon_id`, `code`, `type`, `value`, `minimum_amount`, `maximum_discount`, `usage_limit`, `used_count`, `starts_at`, `expires_at`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'WELCOME10', 'percentage', 10.00, 1000.00, 500.00, 100, 5, '2025-07-01 00:00:00', '2025-12-31 23:59:59', 1, '2025-06-30 16:00:00', '2025-08-03 11:00:00'),
(2, 'SUMMER20', 'percentage', 20.00, 2000.00, 1000.00, 50, 12, '2025-06-01 00:00:00', '2025-09-30 23:59:59', 1, '2025-05-31 16:00:00', '2025-08-03 12:00:00'),
(3, 'FREESHIP', 'fixed_amount', 500.00, 5000.00, 500.00, 200, 25, '2025-07-15 00:00:00', '2025-10-15 23:59:59', 1, '2025-07-14 16:00:00', '2025-08-03 13:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `customer`
--

CREATE TABLE `customer` (
  `customer_id` int(11) NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `fname` varchar(32) DEFAULT NULL,
  `lname` varchar(32) NOT NULL,
  `addressline` text DEFAULT NULL,
  `town` varchar(32) DEFAULT NULL,
  `zipcode` char(10) DEFAULT NULL,
  `phone` varchar(16) DEFAULT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customer`
--

INSERT INTO `customer` (`customer_id`, `user_id`, `fname`, `lname`, `addressline`, `town`, `zipcode`, `phone`, `image_path`, `created_at`) VALUES
(1, 2, 'Neo', 'Bagon', 'Taguig City', 'Town City', '3021', '09611676765', '/uploads/profile_2_1754215926590.png', '2025-07-13 01:16:36'),
(2, 5, 'mari', 'mari', '', '', '', '', '/uploads/profile_5_1753855792818.png', '2025-07-30 06:09:34'),
(3, 9, 'Carlos', 'Mendoza', '123 Rizal Street', 'Manila', '1000', '09181234567', '/uploads/profile_9_1754215926594.png', '2025-07-18 03:45:00'),
(4, 10, 'Isabella', 'Garcia', '456 Bonifacio Avenue', 'Quezon City', '1100', '09181234568', '/uploads/profile_10_1754215926595.png', '2025-07-19 08:30:00'),
(5, 11, 'Miguel', 'Torres', '789 Mabini Road', 'Makati City', '1200', '09181234569', '/uploads/profile_11_1754215926596.png', '2025-07-20 05:20:00');

-- --------------------------------------------------------

--
-- Table structure for table `email_notifications`
--

CREATE TABLE `email_notifications` (
  `notification_id` int(11) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `orderinfo_id` int(11) DEFAULT NULL,
  `email_to` varchar(255) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `type` enum('order_confirmation','order_update','registration','password_reset','other') NOT NULL,
  `status` enum('pending','sent','failed') DEFAULT 'pending',
  `sent_at` timestamp NULL DEFAULT NULL,
  `error_message` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `email_notifications`
--

INSERT INTO `email_notifications` (`notification_id`, `user_id`, `orderinfo_id`, `email_to`, `subject`, `type`, `status`, `sent_at`, `error_message`, `created_at`) VALUES
(1, 9, 15, 'carlosmendoza@gmail.com', 'Order Confirmation - ORD-1754215000001', 'order_confirmation', 'sent', '2025-08-03 02:05:00', NULL, '2025-08-03 02:00:00'),
(2, 10, 16, 'isabellagarcia@gmail.com', 'Order Confirmation - ORD-1754215000002', 'order_confirmation', 'sent', '2025-08-03 03:05:00', NULL, '2025-08-03 03:00:00'),
(3, 11, 17, 'migueltorres@gmail.com', 'Order Confirmation - ORD-1754215000003', 'order_confirmation', 'sent', '2025-08-03 04:05:00', NULL, '2025-08-03 04:00:00'),
(4, 2, 18, 'johnbagon4@gmail.com', 'Order Confirmation - ORD-1754215000004', 'order_confirmation', 'sent', '2025-08-03 05:05:00', NULL, '2025-08-03 05:00:00'),
(5, 9, 19, 'carlosmendoza@gmail.com', 'Order Cancelled - ORD-1754215000005', 'order_update', 'sent', '2025-08-03 06:05:00', NULL, '2025-08-03 06:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `item`
--

CREATE TABLE `item` (
  `item_id` int(11) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `sku` varchar(50) NOT NULL,
  `sell_price` decimal(10,2) NOT NULL,
  `image` text NOT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `seller_id` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `item`
--

INSERT INTO `item` (`item_id`, `category_id`, `name`, `description`, `sku`, `sell_price`, `image`, `status`, `created_at`, `seller_id`) VALUES
(1, 1, 'Coffee Table', 'Modern coffee table for living room', 'SKU-LVR-002', 649.99, '/jquery/img/Living Room/Coffee Table/CoffeeTable1.jpg, /jquery/img/Living Room/Coffee Table/CoffeeTable2.jpg, /jquery/img/Living Room/Coffee Table/CoffeeTable3.jpg, /jquery/img/Living Room/Coffee Table/CoffeeTable4.jpg, /jquery/img/Living Room/Coffee Table/CoffeeTable5.jpg', 'active', '2025-07-17 07:12:28', 1),
(2, 1, 'Sofa Deluxe', 'Comfortable deluxe sofa', 'SKU-LVR-003', 8999.00, '/jquery/img/Living Room/Sofa Deluxe/SofaDeluxe1.jpg, /jquery/img/Living Room/Sofa Deluxe/SofaDeluxe2.jpg, /jquery/img/Living Room/Sofa Deluxe/SofaDeluxe3.jpg, /jquery/img/Living Room/Sofa Deluxe/SofaDeluxe4.jpg, /jquery/img/Living Room/Sofa Deluxe/SofaDeluxe5.jpg', 'active', '2025-07-17 07:12:28', 1),
(3, 2, 'Nightstand', 'Wooden bedside nightstand', 'SKU-BED-001', 3500.00, '/jquery/img/Bedroom/Nightstand/Nightstand1.jpg, /jquery/img/Bedroom/Nightstand/Nightstand2.jpg, /jquery/img/Bedroom/Nightstand/Nightstand3.jpg, /jquery/img/Bedroom/Nightstand/Nightstand4.jpg, /jquery/img/Bedroom/Nightstand/Nightstand5.jpg', 'active', '2025-07-17 06:52:00', 1),
(4, 2, 'Queen Bed', 'Comfortable queen size bed', 'SKU-BED-002', 12599.99, '/jquery/img/Bedroom/Queen Bed/QueenBed1.jpg, /jquery/img/Bedroom/Queen Bed/QueenBed2.jpg, /jquery/img/Bedroom/Queen Bed/QueenBed3.jpg, /jquery/img/Bedroom/Queen Bed/QueenBed4.jpg, /jquery/img/Bedroom/Queen Bed/QueenBed5.jpg', 'active', '2025-07-17 06:52:00', 1),
(5, 3, 'Bar Stool', 'Adjustable height bar stool', 'SKU-KTD-001', 3500.00, '/jquery/img/Kitchen & Dining/Bar Stool/BarStool1.jpg, /jquery/img/Kitchen & Dining/Bar Stool/BarStool2.jpg, /jquery/img/Kitchen & Dining/Bar Stool/BarStool3.jpg, /jquery/img/Kitchen & Dining/Bar Stool/BarStool4.jpg, /jquery/img/Kitchen & Dining/Bar Stool/BarStool5.jpg', 'active', '2025-07-17 06:52:00', 1),
(6, 3, 'Dining Set', '4-piece dining table set', 'SKU-KTD-002', 10000.00, '/jquery/img/Kitchen & Dining/Dining Set/DiningSet1.jpg, /jquery/img/Kitchen & Dining/Dining Set/DiningSet2.jpg, /jquery/img/Kitchen & Dining/Dining Set/DiningSet3.jpg, /jquery/img/Kitchen & Dining/Dining Set/DiningSet4.jpg, /jquery/img/Kitchen & Dining/Dining Set/DiningSet5.jpg', 'active', '2025-07-17 06:52:00', 1),
(7, 4, 'Bath Mat', 'Soft absorbent bath mat', 'SKU-BTH-001', 1599.99, '/jquery/img/Bathroom/Bath Mat/BathMat1.jpg, /jquery/img/Bathroom/Bath Mat/BathMat2.jpg, /jquery/img/Bathroom/Bath Mat/BathMat3.jpg, /jquery/img/Bathroom/Bath Mat/BathMat4.jpg, /jquery/img/Bathroom/Bath Mat/BathMat5.jpg', 'active', '2025-07-17 06:52:00', 1),
(8, 4, 'Shower Curtain', 'Waterproof shower curtain', 'SKU-BTH-002', 999.99, '/jquery/img/Bathroom/Shower Curtains/ShowerCurtain1.jpg, /jquery/img/Bathroom/Shower Curtains/ShowerCurtain2.jpg, /jquery/img/Bathroom/Shower Curtains/ShowerCurtain3.jpg, /jquery/img/Bathroom/Shower Curtains/ShowerCurtain4.jpg, /jquery/img/Bathroom/Shower Curtains/ShowerCurtain5.jpg', 'active', '2025-07-17 06:52:00', 1),
(9, 5, 'Desk Organizer', 'Multi-compartment desk organizer', 'SKU-OFF-001', 500.00, '/jquery/img/Office/Desk Organizer/DeskOrganizer1.jpg, /jquery/img/Office/Desk Organizer/DeskOrganizer2.jpg, /jquery/img/Office/Desk Organizer/DeskOrganizer3.jpg, /jquery/img/Office/Desk Organizer/DeskOrganizer4.jpg, /jquery/img/Office/Desk Organizer/DeskOrganizer5.jpg', 'active', '2025-07-17 06:52:00', 1),
(10, 5, 'Office Chair', 'Ergonomic office chair', 'SKU-OFF-002', 2500.00, '/jquery/img/Office/Office Chair/OfficeChair1.jpg', 'active', '2025-07-17 06:52:00', 1),
(11, 6, 'Garden Lamp', 'Solar powered garden lamp', 'SKU-OTD-001', 1299.99, '/jquery/img/Outdoor/Garden Lamp/GardenLamp1.jpg', 'active', '2025-07-17 06:52:00', 1),
(12, 6, 'Patio Set', 'Outdoor patio furniture set', 'SKU-OTD-002', 499999.99, '/jquery/img/Outdoor/Patio Set/PatioSet1.jpg', 'active', '2025-07-17 06:52:00', 1),
(13, 7, 'Pendant Light', 'Modern pendant light fixture', 'SKU-LGT-001', 3000.00, '/jquery/img/Lighting/Pendant Light/PendantLight1.jpg', 'active', '2025-07-17 06:52:00', 1),
(14, 7, 'Table Lamp', 'Adjustable table lamp', 'SKU-LGT-002', 1800.00, '/jquery/img/Lighting/Table Lamp/TableLamp1.jpg', 'active', '2025-07-17 06:52:00', 1),
(15, 8, 'Bookshelf', '5-tier wooden bookshelf', 'SKU-STR-001', 6000.00, '/jquery/img/Storage/Bookshelf/Bookshelf1.jpg', 'active', '2025-07-17 06:52:00', 1),
(16, 8, 'Storage Box', 'Collapsible storage box', 'SKU-STR-002', 800.00, '/jquery/img/Storage/Storage Box/StorageBox1.jpg', 'active', '2025-07-17 06:52:00', 1),
(17, 9, 'Canvas Art', 'Abstract canvas wall art', 'SKU-WAT-001', 2500.00, '/jquery/img/Wall Art/Canvas Art/CanvasArt1.jpg', 'active', '2025-07-17 06:52:00', 1),
(18, 9, 'Wall Clock', 'Modern wall clock design', 'SKU-WAT-002', 1400.00, '/jquery/img/Wall Art/Wall Clock/WallClock1.jpg', 'active', '2025-07-17 06:52:00', 1),
(19, 10, 'Christmas Tree', 'Artificial Christmas tree', 'SKU-SEA-001', 5500.00, '/jquery/img/Seasonal/Christmas Tree/ChristmasTree1.jpg', 'active', '2025-07-17 06:52:02', 1),
(20, 10, 'Pumpkin Decor', 'Halloween pumpkin decoration', 'SKU-SEA-002', 75.00, '/jquery/img/Seasonal/Pumpkin Decor/PumpkinDecor1.jpg', 'active', '2025-07-17 06:52:02', 1),
(21, 1, '3item', 'aeggdfa', 'SKUU', 1999.00, '[\"/uploads/product_1752768165043_586474378.png\",\"/uploads/product_1752768165079_17149111.png\"]', 'inactive', '2025-07-17 07:43:43', 3),
(30, 5, 'prod12', 'sdfafafsdDSDADA', 'something', 99.00, '[\"/uploads/product_1753148454587_253385319.png\",\"/uploads/product_1753148454591_903777887.png\",\"/uploads/product_1753148454609_30116752.png\",\"/uploads/product_1753148509264_883856179.png\",\"/uploads/product_1753148509287_191198091.png\",\"/uploads/product_1753148509376_970306655.png\"]', 'active', '2025-07-22 01:40:54', 3),
(31, 10, 'test6', 'hello', 'SKUUUUasdadasda', 10000.00, '[\"/uploads/product_1754201908495_500806976.png\",\"/uploads/product_1754201945848_7980129.png\"]', 'active', '2025-08-03 06:18:28', 3),
(32, 1, 'Modern L-Shaped Sofa', 'Contemporary L-shaped sofa with premium fabric upholstery', 'SKU-LVR-004', 15999.00, '[\"/jquery/img/Living Room/Sofa Deluxe/SofaDeluxe1.jpg\",\"/jquery/img/Living Room/Sofa Deluxe/SofaDeluxe2.jpg\"]', 'active', '2025-07-25 02:00:00', 6),
(33, 2, 'King Size Bed Frame', 'Elegant king-size bed frame with upholstered headboard', 'SKU-BED-003', 18999.00, '[\"/jquery/img/Bedroom/Queen Bed/QueenBed1.jpg\",\"/jquery/img/Bedroom/Queen Bed/QueenBed2.jpg\"]', 'active', '2025-07-25 03:00:00', 6),
(34, 3, 'Kitchen Island', 'Modern kitchen island with storage and seating', 'SKU-KTD-003', 25000.00, '[\"/jquery/img/Kitchen & Dining/Dining Set/DiningSet1.jpg\",\"/jquery/img/Kitchen & Dining/Dining Set/DiningSet2.jpg\"]', 'active', '2025-07-25 04:00:00', 6),
(35, 7, 'Chandelier', 'Crystal chandelier for dining room', 'SKU-LGT-003', 8500.00, '[\"/jquery/img/Lighting/Pendant Light/PendantLight1.jpg\",\"/jquery/img/Lighting/Pendant Light/PendantLight2.jpg\"]', 'inactive', '2025-07-25 05:00:00', 6),
(36, 1, 'Traditional Wooden Coffee Table', 'Handcrafted wooden coffee table with intricate carvings', 'SKU-LVR-005', 4500.00, '[\"/jquery/img/Living Room/Coffee Table/CoffeeTable1.jpg\",\"/jquery/img/Living Room/Coffee Table/CoffeeTable2.jpg\"]', 'active', '2025-07-26 01:00:00', 7),
(37, 2, 'Twin Bunk Bed', 'Space-saving twin bunk bed for kids room', 'SKU-BED-004', 12000.00, '[\"/jquery/img/Bedroom/Queen Bed/QueenBed1.jpg\",\"/jquery/img/Bedroom/Queen Bed/QueenBed2.jpg\"]', 'active', '2025-07-26 02:00:00', 7),
(38, 8, 'Wardrobe Cabinet', 'Large wardrobe with mirror and hanging space', 'SKU-STR-003', 18000.00, '[\"/jquery/img/Storage/Bookshelf/Bookshelf1.jpg\",\"/jquery/img/Storage/Bookshelf/Bookshelf2.jpg\"]', 'active', '2025-07-26 03:00:00', 7),
(39, 9, 'Abstract Wall Art', 'Modern abstract painting for living room', 'SKU-WAT-003', 3500.00, '[\"/jquery/img/Wall Art/Canvas Art/CanvasArt1.jpg\",\"/jquery/img/Wall Art/Canvas Art/CanvasArt2.jpg\"]', 'active', '2025-07-26 04:00:00', 7),
(40, 1, 'Minimalist TV Stand', 'Sleek TV stand with cable management', 'SKU-LVR-006', 3200.00, '[\"/jquery/img/Living Room/Coffee Table/CoffeeTable1.jpg\",\"/jquery/img/Living Room/Coffee Table/CoffeeTable2.jpg\"]', 'active', '2025-07-27 00:00:00', 8),
(41, 3, 'Bar Counter Stool', 'Adjustable bar stool for kitchen counter', 'SKU-KTD-004', 2800.00, '[\"/jquery/img/Kitchen & Dining/Bar Stool/BarStool1.jpg\",\"/jquery/img/Kitchen & Dining/Bar Stool/BarStool2.jpg\"]', 'active', '2025-07-27 01:00:00', 8),
(42, 5, 'Ergonomic Gaming Chair', 'Comfortable gaming chair with lumbar support', 'SKU-OFF-003', 4500.00, '[\"/jquery/img/Office/Office Chair/OfficeChair1.jpg\",\"/jquery/img/Office/Office Chair/OfficeChair2.jpg\"]', 'active', '2025-07-27 02:00:00', 8),
(43, 6, 'Garden Bench', 'Outdoor wooden garden bench', 'SKU-OTD-003', 6500.00, '[\"/jquery/img/Outdoor/Patio Set/PatioSet1.jpg\",\"/jquery/img/Outdoor/Patio Set/PatioSet2.jpg\"]', 'active', '2025-07-27 03:00:00', 8),
(44, 10, 'Christmas Wreath', 'Decorative Christmas wreath for door', 'SKU-SEA-003', 1200.00, '[\"/jquery/img/Seasonal/Christmas Tree/ChristmasTree1.jpg\",\"/jquery/img/Seasonal/Christmas Tree/ChristmasTree2.jpg\"]', 'inactive', '2025-07-27 04:00:00', 8);

-- --------------------------------------------------------

--
-- Table structure for table `orderinfo`
--

CREATE TABLE `orderinfo` (
  `orderinfo_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `order_number` varchar(50) NOT NULL,
  `date_placed` datetime NOT NULL DEFAULT current_timestamp(),
  `status` enum('pending','processing','shipped','delivered','cancelled') NOT NULL DEFAULT 'pending',
  `payment_status` enum('pending','paid','failed') NOT NULL DEFAULT 'pending',
  `payment_method` varchar(50) DEFAULT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `shipping` decimal(10,2) DEFAULT 0.00,
  `total_amount` decimal(10,2) NOT NULL,
  `ship_fname` varchar(50) DEFAULT NULL,
  `ship_lname` varchar(50) DEFAULT NULL,
  `ship_address` text DEFAULT NULL,
  `ship_town` varchar(50) DEFAULT NULL,
  `ship_zipcode` char(10) DEFAULT NULL,
  `ship_phone` varchar(16) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `gcash_phone` varchar(32) DEFAULT NULL,
  `gcash_receipt` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orderinfo`
--

INSERT INTO `orderinfo` (`orderinfo_id`, `customer_id`, `order_number`, `date_placed`, `status`, `payment_status`, `payment_method`, `subtotal`, `shipping`, `total_amount`, `ship_fname`, `ship_lname`, `ship_address`, `ship_town`, `ship_zipcode`, `ship_phone`, `notes`, `created_at`, `gcash_phone`, `gcash_receipt`) VALUES
(4, 1, 'ORD-1752827251559', '2025-07-18 16:27:31', '', 'pending', NULL, 8999.00, 0.00, 8999.00, 'Neo', 'Neo', 'taguig city', 'Taguig', '1630', '09611676764', NULL, '2025-07-18 08:27:31', NULL, NULL),
(5, 1, 'ORD-1753144859668', '2025-07-22 08:40:59', '', 'pending', NULL, 649.99, 0.00, 649.99, 'Neo', 'Neo', 'taguig city', 'Taguig', '1630', '09611676764', NULL, '2025-07-22 00:40:59', NULL, NULL),
(6, 1, 'ORD-1753145847108', '2025-07-22 08:57:27', 'delivered', 'pending', NULL, 199.00, 0.00, 199.00, 'Neo', 'Neo', 'taguig city', 'Taguig', '1630', '09611676764', NULL, '2025-07-22 00:57:27', NULL, NULL),
(7, 1, 'ORD-1753149177654', '2025-07-22 09:52:57', '', 'pending', 'cash', 6000.00, 0.00, 6000.00, 'Neo', 'Neo', 'taguig city', 'Taguig', '1630', '09611676764', NULL, '2025-07-22 01:52:57', NULL, NULL),
(8, 1, 'ORD-1753156685350', '2025-07-22 11:58:05', 'delivered', 'paid', 'gcash', 99.00, 0.00, 99.00, 'Neo', 'Neo', 'taguig city', 'Taguig', '1630', '09611676764', NULL, '2025-07-22 03:58:05', '09611676764', '/uploads/gcash_1753156685295_147123456.png'),
(9, 1, 'ORD-1753157253566', '2025-07-22 12:07:33', 'delivered', 'paid', 'gcash', 99.00, 0.00, 99.00, 'Neo', 'Neo', 'taguig city', 'Taguig', '1630', '09611676764', NULL, '2025-07-22 04:07:33', '09611676764', '/uploads/gcash_1753157253525_668870828.png'),
(10, 1, 'ORD-1753160664963', '2025-07-22 13:04:24', '', 'paid', 'gcash', 99.00, 0.00, 99.00, 'Neo', 'Neo', 'taguig city', 'Taguig', '1630', '09611676764', NULL, '2025-07-22 05:04:24', '09611676764', '/uploads/gcash_1753160664584_641229961.png'),
(11, 1, 'ORD-1753170017114', '2025-07-22 15:40:17', '', 'paid', 'gcash', 99.00, 0.00, 99.00, 'Neo', 'Neo', 'taguig city', 'Taguig', '1630', '09611676764', NULL, '2025-07-22 07:40:17', '09611676764', '/uploads/gcash_1753170016580_57532423.png'),
(12, 1, 'ORD-1753855438652', '2025-07-30 14:03:58', '', 'pending', 'cash', 99.00, 0.00, 99.00, 'Neo', 'Neo', 'taguig city', 'Taguig', '1630', '09611676764', NULL, '2025-07-30 06:03:58', NULL, NULL),
(13, 2, 'ORD-1754200719413', '2025-08-03 13:58:39', '', 'paid', 'gcash', 499999.99, 0.00, 499999.99, 'mari', 'mari', '', '', '', '', NULL, '2025-08-03 05:58:39', '09611676764', '/uploads/gcash_1754200719289_980084768.png'),
(14, 1, 'ORD-1754214172242', '2025-08-03 17:42:52', '', 'paid', 'gcash', 17998.00, 0.00, 17998.00, 'Neo', 'Neo', 'taguig city', 'Taguig', '1630', '09611676764', NULL, '2025-08-03 09:42:52', '09283366740', '/uploads/gcash_1754214172197_501069428.png'),
(15, 3, 'ORD-1754215000001', '2025-08-03 18:00:00', 'delivered', 'paid', 'gcash', 15999.00, 0.00, 15999.00, 'Carlos', 'Mendoza', '123 Rizal Street', 'Manila', '1000', '09181234567', NULL, '2025-08-03 02:00:00', '09181234567', '/uploads/gcash_1754215000001_123456789.png'),
(16, 4, 'ORD-1754215000002', '2025-08-03 19:00:00', 'processing', 'paid', 'gcash', 4500.00, 0.00, 4500.00, 'Isabella', 'Garcia', '456 Bonifacio Avenue', 'Quezon City', '1100', '09181234568', NULL, '2025-08-03 03:00:00', '09181234568', '/uploads/gcash_1754215000002_987654321.png'),
(17, 5, 'ORD-1754215000003', '2025-08-03 20:00:00', 'pending', 'pending', 'cash', 12000.00, 0.00, 12000.00, 'Miguel', 'Torres', '789 Mabini Road', 'Makati City', '1200', '09181234569', NULL, '2025-08-03 04:00:00', NULL, NULL),
(18, 1, 'ORD-1754215000004', '2025-08-03 21:00:00', 'shipped', 'paid', 'gcash', 2800.00, 0.00, 2800.00, 'Neo', 'Bagon', 'taguig city', 'Taguig', '1630', '09611676764', NULL, '2025-08-03 05:00:00', '09611676764', '/uploads/gcash_1754215000004_456789123.png'),
(19, 3, 'ORD-1754215000005', '2025-08-03 22:00:00', 'cancelled', '', 'gcash', 8500.00, 0.00, 8500.00, 'Carlos', 'Mendoza', '123 Rizal Street', 'Manila', '1000', '09181234567', NULL, '2025-08-03 06:00:00', '09181234567', '/uploads/gcash_1754215000005_789123456.png');

-- --------------------------------------------------------

--
-- Table structure for table `orderline`
--

CREATE TABLE `orderline` (
  `orderline_id` int(11) NOT NULL,
  `orderinfo_id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `item_name` varchar(255) NOT NULL,
  `quantity` int(11) NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orderline`
--

INSERT INTO `orderline` (`orderline_id`, `orderinfo_id`, `item_id`, `item_name`, `quantity`, `unit_price`, `total_price`, `created_at`) VALUES
(4, 4, 2, 'Sofa Deluxe', 1, 8999.00, 8999.00, '2025-07-18 08:27:31'),
(5, 5, 1, 'Coffee Table', 1, 649.99, 649.99, '2025-07-22 00:40:59'),
(6, 6, 21, 'item2', 1, 199.00, 199.00, '2025-07-22 00:57:27'),
(7, 7, 15, 'Bookshelf', 1, 6000.00, 6000.00, '2025-07-22 01:52:57'),
(8, 8, 30, 'prod12', 1, 99.00, 99.00, '2025-07-22 03:58:05'),
(9, 9, 30, 'prod12', 1, 99.00, 99.00, '2025-07-22 04:07:33'),
(10, 10, 30, 'prod12', 1, 99.00, 99.00, '2025-07-22 05:04:25'),
(11, 11, 30, 'prod12', 1, 99.00, 99.00, '2025-07-22 07:40:17'),
(12, 12, 30, 'prod12', 1, 99.00, 99.00, '2025-07-30 06:03:58'),
(13, 13, 12, 'Patio Set', 1, 499999.99, 499999.99, '2025-08-03 05:58:39'),
(14, 14, 2, 'Sofa Deluxe', 2, 8999.00, 17998.00, '2025-08-03 09:42:52'),
(15, 15, 32, 'Modern L-Shaped Sofa', 1, 15999.00, 15999.00, '2025-08-03 02:00:00'),
(16, 16, 36, 'Traditional Wooden Coffee Table', 1, 4500.00, 4500.00, '2025-08-03 03:00:00'),
(17, 17, 37, 'Twin Bunk Bed', 1, 12000.00, 12000.00, '2025-08-03 04:00:00'),
(18, 18, 41, 'Bar Counter Stool', 1, 2800.00, 2800.00, '2025-08-03 05:00:00'),
(19, 19, 35, 'Chandelier', 1, 8500.00, 8500.00, '2025-08-03 06:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `review_id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `rating` int(11) NOT NULL CHECK (`rating` between 1 and 5),
  `review_text` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`review_id`, `item_id`, `customer_id`, `rating`, `review_text`, `created_at`) VALUES
(4, 30, 1, 5, 'hsdakfasfas', '2025-07-22 04:26:05'),
(5, 32, 3, 5, 'Excellent quality sofa! Very comfortable and looks great in our living room.', '2025-08-04 02:00:00'),
(6, 36, 4, 4, 'Beautiful wooden coffee table. The craftsmanship is amazing.', '2025-08-04 03:00:00'),
(7, 37, 5, 5, 'Perfect bunk bed for my kids. Sturdy and well-made.', '2025-08-04 04:00:00'),
(8, 41, 1, 4, 'Great bar stool, very comfortable for long sitting.', '2025-08-04 05:00:00'),
(9, 2, 3, 5, 'Love this sofa! Great value for money.', '2025-08-04 06:00:00'),
(10, 1, 4, 4, 'Nice coffee table, fits perfectly in our space.', '2025-08-04 07:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `role_upgrades`
--

CREATE TABLE `role_upgrades` (
  `upgrade_id` int(11) NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `from_role` enum('user','customer','seller','admin') NOT NULL,
  `to_role` enum('user','customer','seller','admin') NOT NULL,
  `upgraded_by` bigint(20) UNSIGNED DEFAULT NULL,
  `reason` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `role_upgrades`
--

INSERT INTO `role_upgrades` (`upgrade_id`, `user_id`, `from_role`, `to_role`, `upgraded_by`, `reason`, `created_at`) VALUES
(1, 12, 'user', 'customer', 1, 'User requested customer privileges', '2025-08-03 09:00:00'),
(2, 13, 'user', 'customer', 1, 'Account upgrade approved', '2025-08-03 10:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `sellers`
--

CREATE TABLE `sellers` (
  `seller_id` int(11) NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `business_name` varchar(255) NOT NULL,
  `business_description` text DEFAULT NULL,
  `business_address` text DEFAULT NULL,
  `business_phone` varchar(16) DEFAULT NULL,
  `business_email` varchar(255) DEFAULT NULL,
  `is_verified` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sellers`
--

INSERT INTO `sellers` (`seller_id`, `user_id`, `business_name`, `business_description`, `business_address`, `business_phone`, `business_email`, `is_verified`, `created_at`) VALUES
(1, 3, 'Sample Seller Store', 'We sell home goods.', '123 Main St, City', '09171234567', 'seller1@homehaven.com', 1, '2025-07-14 19:12:56'),
(2, 6, 'Santos Home Furnishings', 'Premium home furniture and decor for modern living', '456 Quezon Ave, Quezon City', '09171234568', 'mariasantos@homehaven.com', 1, '2025-07-15 02:30:00'),
(3, 7, 'Dela Cruz Furniture Co.', 'Quality wooden furniture and traditional designs', '789 Makati Ave, Makati City', '09171234569', 'juandelacruz@homehaven.com', 1, '2025-07-16 06:20:00'),
(4, 8, 'Reyes Modern Living', 'Contemporary furniture and minimalist designs', '321 Taguig Blvd, Taguig City', '09171234570', 'anareyes@homehaven.com', 1, '2025-07-17 01:15:00');

-- --------------------------------------------------------

--
-- Table structure for table `shopping_cart`
--

CREATE TABLE `shopping_cart` (
  `cart_id` int(11) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `item_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `price` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `shopping_cart`
--

INSERT INTO `shopping_cart` (`cart_id`, `user_id`, `item_id`, `quantity`, `price`, `created_at`) VALUES
(19, 9, 33, 1, 18999.00, '2025-08-03 13:00:00'),
(20, 10, 38, 1, 18000.00, '2025-08-03 14:00:00'),
(21, 11, 42, 1, 4500.00, '2025-08-03 15:00:00'),
(22, 2, 40, 1, 3200.00, '2025-08-03 16:00:00'),
(23, 9, 39, 2, 3500.00, '2025-08-03 17:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `stock`
--

CREATE TABLE `stock` (
  `item_id` int(11) NOT NULL,
  `quantity` int(11) DEFAULT 0,
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stock`
--

INSERT INTO `stock` (`item_id`, `quantity`, `updated_at`) VALUES
(1, 10, '2025-07-14 19:12:58'),
(2, 8, '2025-08-03 09:42:52'),
(3, 10, '2025-07-14 19:12:58'),
(4, 10, '2025-07-14 19:12:58'),
(5, 10, '2025-07-14 19:12:58'),
(6, 10, '2025-07-14 19:12:58'),
(7, 10, '2025-07-14 19:12:58'),
(8, 10, '2025-07-14 19:12:58'),
(9, 10, '2025-07-14 19:12:58'),
(10, 10, '2025-07-14 19:12:58'),
(11, 10, '2025-07-14 19:12:58'),
(12, 9, '2025-08-03 05:58:39'),
(13, 10, '2025-07-14 19:12:58'),
(14, 10, '2025-07-14 19:12:58'),
(30, 6, '2025-07-30 06:03:58'),
(31, 69, '2025-08-03 06:19:06'),
(32, 4, '2025-08-03 12:27:49'),
(33, 3, '2025-07-25 03:00:00'),
(34, 2, '2025-07-25 04:00:00'),
(35, 0, '2025-07-25 05:00:00'),
(36, 7, '2025-08-03 12:27:49'),
(37, 3, '2025-08-03 12:27:49'),
(38, 6, '2025-07-26 03:00:00'),
(39, 10, '2025-07-26 04:00:00'),
(40, 12, '2025-07-27 00:00:00'),
(41, 14, '2025-08-03 12:27:49'),
(42, 7, '2025-07-27 02:00:00'),
(43, 9, '2025-07-27 03:00:00'),
(44, 0, '2025-07-27 04:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','customer','seller','admin') NOT NULL DEFAULT 'user',
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `profile_image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `state` enum('active','inactive') DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `status`, `profile_image`, `created_at`, `state`) VALUES
(1, 'Admin User', 'admin@homehaven.com', '$2b$10$5b9O.g67rD4l5KO2J.OFieCzBl4MAB6mMjPVs0iYVAjtAS7w.B2y6', 'admin', 'active', NULL, NULL, 'active'),
(2, 'Neo', 'johnbagon4@gmail.com', '$2b$10$5b9O.g67rD4l5KO2J.OFieCzBl4MAB6mMjPVs0iYVAjtAS7w.B2y6', 'customer', 'active', '/uploads/profile_2_1754215926590.png', '2025-07-13 01:11:02', 'active'),
(3, 'Sample Seller', 'seller1@homehaven.com', '$2b$10$5b9O.g67rD4l5KO2J.OFieCzBl4MAB6mMjPVs0iYVAjtAS7w.B2y6', 'seller', 'inactive', '/uploads/product_1753857788844_191833542.png', '2025-07-14 19:12:56', 'active'),
(4, 'test1', 'princenatsu07@gmail.com', '$2b$10$5b9O.g67rD4l5KO2J.OFieCzBl4MAB6mMjPVs0iYVAjtAS7w.B2y6', 'user', 'active', NULL, '2025-07-14 19:49:15', 'active'),
(5, 'mari', 'neoughpch03@gmail.com', '$2b$10$5b9O.g67rD4l5KO2J.OFieCzBl4MAB6mMjPVs0iYVAjtAS7w.B2y6', 'customer', 'inactive', '/uploads/profile_5_1753855792818.png', '2025-07-30 06:08:56', 'active'),
(6, 'Maria Santos', 'mariasantos@homehaven.com', '$2b$10$5b9O.g67rD4l5KO2J.OFieCzBl4MAB6mMjPVs0iYVAjtAS7w.B2y6', 'seller', 'active', '/uploads/profile_6_1754215926591.png', '2025-07-15 02:30:00', 'active'),
(7, 'Juan Dela Cruz', 'juandelacruz@homehaven.com', '$2b$10$5b9O.g67rD4l5KO2J.OFieCzBl4MAB6mMjPVs0iYVAjtAS7w.B2y6', 'seller', 'active', '/uploads/profile_7_1754215926592.png', '2025-07-16 06:20:00', 'active'),
(8, 'Ana Reyes', 'anareyes@homehaven.com', '$2b$10$5b9O.g67rD4l5KO2J.OFieCzBl4MAB6mMjPVs0iYVAjtAS7w.B2y6', 'seller', 'active', '/uploads/profile_8_1754215926593.png', '2025-07-17 01:15:00', 'active'),
(9, 'Carlos Mendoza', 'carlosmendoza@gmail.com', '$2b$10$5b9O.g67rD4l5KO2J.OFieCzBl4MAB6mMjPVs0iYVAjtAS7w.B2y6', 'customer', 'active', '/uploads/profile_9_1754215926594.png', '2025-07-18 03:45:00', 'active'),
(10, 'Isabella Garcia', 'isabellagarcia@gmail.com', '$2b$10$5b9O.g67rD4l5KO2J.OFieCzBl4MAB6mMjPVs0iYVAjtAS7w.B2y6', 'customer', 'active', '/uploads/profile_10_1754215926595.png', '2025-07-19 08:30:00', 'active'),
(11, 'Miguel Torres', 'migueltorres@gmail.com', '$2b$10$5b9O.g67rD4l5KO2J.OFieCzBl4MAB6mMjPVs0iYVAjtAS7w.B2y6', 'customer', 'active', '/uploads/profile_11_1754215926596.png', '2025-07-20 05:20:00', 'active'),
(12, 'Sofia Rodriguez', 'sofiarodriguez@gmail.com', '$2b$10$5b9O.g67rD4l5KO2J.OFieCzBl4MAB6mMjPVs0iYVAjtAS7w.B2y6', 'user', 'active', NULL, '2025-07-21 00:10:00', 'active'),
(13, 'Diego Martinez', 'diegomartinez@gmail.com', '$2b$10$5b9O.g67rD4l5KO2J.OFieCzBl4MAB6mMjPVs0iYVAjtAS7w.B2y6', 'user', 'inactive', NULL, '2025-07-22 04:25:00', 'active'),
(14, 'Valentina Lopez', 'valentinalopez@gmail.com', '$2b$10$5b9O.g67rD4l5KO2J.OFieCzBl4MAB6mMjPVs0iYVAjtAS7w.B2y6', 'user', 'active', NULL, '2025-07-23 07:40:00', 'inactive');

-- --------------------------------------------------------

--
-- Table structure for table `wishlist`
--

CREATE TABLE `wishlist` (
  `wishlist_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `wishlist`
--

INSERT INTO `wishlist` (`wishlist_id`, `customer_id`, `item_id`, `created_at`) VALUES
(1, 1, 2, '2025-07-18 08:20:16'),
(4, 1, 30, '2025-07-30 05:51:43'),
(5, 3, 33, '2025-08-03 08:00:00'),
(6, 4, 38, '2025-08-03 09:00:00'),
(7, 5, 42, '2025-08-03 10:00:00'),
(8, 1, 40, '2025-08-03 11:00:00'),
(9, 3, 39, '2025-08-03 12:00:00');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `admin_warnings`
--
ALTER TABLE `admin_warnings`
  ADD PRIMARY KEY (`warning_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `admin_id` (`admin_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`category_id`);

--
-- Indexes for table `coupons`
--
ALTER TABLE `coupons`
  ADD PRIMARY KEY (`coupon_id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `customer`
--
ALTER TABLE `customer`
  ADD PRIMARY KEY (`customer_id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indexes for table `email_notifications`
--
ALTER TABLE `email_notifications`
  ADD PRIMARY KEY (`notification_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `orderinfo_id` (`orderinfo_id`);

--
-- Indexes for table `item`
--
ALTER TABLE `item`
  ADD PRIMARY KEY (`item_id`),
  ADD UNIQUE KEY `sku` (`sku`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `seller_id` (`seller_id`);

--
-- Indexes for table `orderinfo`
--
ALTER TABLE `orderinfo`
  ADD PRIMARY KEY (`orderinfo_id`),
  ADD UNIQUE KEY `order_number` (`order_number`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Indexes for table `orderline`
--
ALTER TABLE `orderline`
  ADD PRIMARY KEY (`orderline_id`),
  ADD KEY `orderinfo_id` (`orderinfo_id`),
  ADD KEY `item_id` (`item_id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`review_id`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `reviews_ibfk_1` (`item_id`);

--
-- Indexes for table `role_upgrades`
--
ALTER TABLE `role_upgrades`
  ADD PRIMARY KEY (`upgrade_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `upgraded_by` (`upgraded_by`);

--
-- Indexes for table `sellers`
--
ALTER TABLE `sellers`
  ADD PRIMARY KEY (`seller_id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indexes for table `shopping_cart`
--
ALTER TABLE `shopping_cart`
  ADD PRIMARY KEY (`cart_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `item_id` (`item_id`);

--
-- Indexes for table `stock`
--
ALTER TABLE `stock`
  ADD PRIMARY KEY (`item_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- Indexes for table `wishlist`
--
ALTER TABLE `wishlist`
  ADD PRIMARY KEY (`wishlist_id`),
  ADD UNIQUE KEY `unique_customer_item` (`customer_id`,`item_id`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `item_id` (`item_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `admin_warnings`
--
ALTER TABLE `admin_warnings`
  MODIFY `warning_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `coupons`
--
ALTER TABLE `coupons`
  MODIFY `coupon_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `customer`
--
ALTER TABLE `customer`
  MODIFY `customer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `email_notifications`
--
ALTER TABLE `email_notifications`
  MODIFY `notification_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `item`
--
ALTER TABLE `item`
  MODIFY `item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT for table `orderinfo`
--
ALTER TABLE `orderinfo`
  MODIFY `orderinfo_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `orderline`
--
ALTER TABLE `orderline`
  MODIFY `orderline_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `review_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `role_upgrades`
--
ALTER TABLE `role_upgrades`
  MODIFY `upgrade_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `sellers`
--
ALTER TABLE `sellers`
  MODIFY `seller_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `shopping_cart`
--
ALTER TABLE `shopping_cart`
  MODIFY `cart_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `wishlist`
--
ALTER TABLE `wishlist`
  MODIFY `wishlist_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD CONSTRAINT `activity_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `admin_warnings`
--
ALTER TABLE `admin_warnings`
  ADD CONSTRAINT `warnings_admin_fk` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `warnings_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `customer`
--
ALTER TABLE `customer`
  ADD CONSTRAINT `customer_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `email_notifications`
--
ALTER TABLE `email_notifications`
  ADD CONSTRAINT `email_order_fk` FOREIGN KEY (`orderinfo_id`) REFERENCES `orderinfo` (`orderinfo_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `email_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `item`
--
ALTER TABLE `item`
  ADD CONSTRAINT `item_category_fk` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `item_seller_fk` FOREIGN KEY (`seller_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `orderinfo`
--
ALTER TABLE `orderinfo`
  ADD CONSTRAINT `orderinfo_customer_id_fk` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`customer_id`) ON DELETE CASCADE;

--
-- Constraints for table `orderline`
--
ALTER TABLE `orderline`
  ADD CONSTRAINT `orderline_item_id_fk` FOREIGN KEY (`item_id`) REFERENCES `item` (`item_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `orderline_orderinfo_id_fk` FOREIGN KEY (`orderinfo_id`) REFERENCES `orderinfo` (`orderinfo_id`) ON DELETE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`item_id`) REFERENCES `item` (`item_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`customer_id`) ON DELETE CASCADE;

--
-- Constraints for table `role_upgrades`
--
ALTER TABLE `role_upgrades`
  ADD CONSTRAINT `role_upgrades_upgraded_by_fk` FOREIGN KEY (`upgraded_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `role_upgrades_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sellers`
--
ALTER TABLE `sellers`
  ADD CONSTRAINT `sellers_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `shopping_cart`
--
ALTER TABLE `shopping_cart`
  ADD CONSTRAINT `cart_item_fk` FOREIGN KEY (`item_id`) REFERENCES `item` (`item_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cart_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `stock`
--
ALTER TABLE `stock`
  ADD CONSTRAINT `stock_item_id_fk` FOREIGN KEY (`item_id`) REFERENCES `item` (`item_id`) ON DELETE CASCADE;

--
-- Constraints for table `wishlist`
--
ALTER TABLE `wishlist`
  ADD CONSTRAINT `wishlist_customer_fk` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`customer_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `wishlist_item_fk` FOREIGN KEY (`item_id`) REFERENCES `item` (`item_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
