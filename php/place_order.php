<?php
// Start session if needed (e.g., to get user_id if logged in)
session_start();

// Set header to return JSON response
header('Content-Type: application/json');

// Include database connection - Adjust path if this file is not in the php folder
require_once __DIR__ . '/db_connect.php'; // Assumes db_connect.php is in the same directory

// --- Get Data from Request ---
// Get the raw POST data
$rawData = file_get_contents("php://input");
// Decode the JSON data sent from JavaScript
$orderData = json_decode($rawData, true); // true for associative array

// Basic validation: Check if data was received and decoded correctly
if ($orderData === null || !isset($orderData['billingDetails'], $orderData['items'], $orderData['total'])) {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid order data received.'
    ]);
    exit;
}

// Extract data for easier access
$billingDetails = $orderData['billingDetails'];
$items = $orderData['items'];
$summary = [
    'subtotal' => $orderData['subtotal'] ?? 0.00,
    'shipping' => $orderData['shipping'] ?? 0.00,
    'tax' => $orderData['tax'] ?? 0.00,
    'discount' => $orderData['discount'] ?? 0.00,
    'total' => $orderData['total'] ?? 0.00,
    'promoCode' => $orderData['promoCode'] ?? null,
    'paymentMethod' => $orderData['paymentMethod'] ?? null
];

// --- Database Insertion (using PDO and Transaction) ---
// Use the $pdo variable from db_connect.php
global $pdo; // Make $pdo available in this scope if it's not already global

// Start transaction
$pdo->beginTransaction();

try {
    // 1. Insert into 'orders' table
    $sqlOrder = "INSERT INTO orders (
                    user_id, customer_first_name, customer_last_name, customer_email, customer_phone,
                    shipping_address, shipping_city, shipping_state, shipping_zip, shipping_country,
                    subtotal_amount, shipping_amount, tax_amount, discount_amount, total_amount,
                    promo_code_used, payment_method, order_notes, status
                 ) VALUES (
                    :user_id, :first_name, :last_name, :email, :phone,
                    :address, :city, :state, :zip, :country,
                    :subtotal, :shipping, :tax, :discount, :total,
                    :promo_code, :payment_method, :notes, :status
                 )";

    $stmtOrder = $pdo->prepare($sqlOrder);

    // Bind parameters for the orders table
    $userId = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : null; // Get user ID from session if logged in
    $status = 'Pending'; // Initial order status

    $stmtOrder->bindParam(':user_id', $userId, PDO::PARAM_INT); // Can be null
    $stmtOrder->bindParam(':first_name', $billingDetails['firstName']);
    $stmtOrder->bindParam(':last_name', $billingDetails['lastName']);
    $stmtOrder->bindParam(':email', $billingDetails['email']);
    $stmtOrder->bindParam(':phone', $billingDetails['phone']); // Ensure 'phone' exists or handle null
    $stmtOrder->bindParam(':address', $billingDetails['address']);
    $stmtOrder->bindParam(':city', $billingDetails['city']);
    $stmtOrder->bindParam(':state', $billingDetails['state']);
    $stmtOrder->bindParam(':zip', $billingDetails['zip']);
    $stmtOrder->bindParam(':country', $billingDetails['country']);
    $stmtOrder->bindParam(':subtotal', $summary['subtotal']);
    $stmtOrder->bindParam(':shipping', $summary['shipping']);
    $stmtOrder->bindParam(':tax', $summary['tax']);
    $stmtOrder->bindParam(':discount', $summary['discount']);
    $stmtOrder->bindParam(':total', $summary['total']);
    $stmtOrder->bindParam(':promo_code', $summary['promoCode']); // Can be null
    $stmtOrder->bindParam(':payment_method', $summary['paymentMethod']); // Can be null
    $stmtOrder->bindParam(':notes', $billingDetails['orderNotes']); // Ensure 'orderNotes' exists or handle null
    $stmtOrder->bindParam(':status', $status);

    // Execute the insert query for the order
    $stmtOrder->execute();

    // Get the ID of the order just inserted
    $lastOrderId = $pdo->lastInsertId();

    // 2. Insert into 'order_items' table
    $sqlItem = "INSERT INTO order_items (order_id, product_id, product_name, quantity, price_per_unit)
                VALUES (:order_id, :product_id, :product_name, :quantity, :price)";
    $stmtItem = $pdo->prepare($sqlItem);

    foreach ($items as $item) {
        // Basic check for required item data
        if (!isset($item['id'], $item['name'], $item['quantity'], $item['price'])) {
             throw new Exception("Invalid item data detected for item: " . ($item['name'] ?? 'Unknown'));
        }

        $stmtItem->bindParam(':order_id', $lastOrderId, PDO::PARAM_INT);
        // Assuming item['id'] corresponds to your product_id. If not, adjust or set to NULL.
        $productId = is_numeric($item['id']) ? $item['id'] : null;
        $stmtItem->bindParam(':product_id', $productId, PDO::PARAM_INT); // Can be null if ID is not numeric/available
        $stmtItem->bindParam(':product_name', $item['name']);
        $stmtItem->bindParam(':quantity', $item['quantity'], PDO::PARAM_INT);
        $stmtItem->bindParam(':price', $item['price']); // Assumes price is the price per unit

        $stmtItem->execute();
    }

    // If all inserts were successful, commit the transaction
    $pdo->commit();

    // Send success response
    echo json_encode([
        'success' => true,
        'message' => 'Order placed successfully!',
        'orderId' => $lastOrderId // Optionally return the new order ID
    ]);

} catch (PDOException $e) {
    // If any database error occurred, roll back the transaction
    $pdo->rollBack();
    // Log the detailed error (important for debugging)
    error_log("PDOException in place_order.php: " . $e->getMessage());
    // Send generic error response to the client
    echo json_encode([
        'success' => false,
        'message' => 'Failed to place order due to a database error. Please try again later.'
        // 'error' => $e->getMessage() // Avoid sending detailed errors to the client in production
    ]);
} catch (Exception $e) {
    // Catch other potential errors (like invalid item data)
     $pdo->rollBack(); // Rollback if we started transaction
     error_log("Exception in place_order.php: " . $e->getMessage());
     echo json_encode([
        'success' => false,
        'message' => 'Failed to place order due to an internal error: ' . $e->getMessage()
    ]);
}

// $pdo = null; // Close connection (often handled automatically at script end)
exit; // Ensure script stops here
?>