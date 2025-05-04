<?php
// Start session (needed for admin auth check)
session_start();

// Set header to return JSON response
header('Content-Type: application/json');

// --- Basic Admin Authentication Check ---
// Ensure only logged-in admins can perform this action
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    echo json_encode([
        'success' => false,
        'message' => 'Unauthorized: Admin access required.'
    ]);
    exit;
}

// Include database connection - Adjust path if needed
require_once __DIR__ . '/db_connect.php'; // Assumes db_connect.php is in the same directory

// --- Get Data from POST Request ---
$orderId = $_POST['order_id'] ?? null;
$newStatus = $_POST['new_status'] ?? null;

// --- Validate Input ---
if (empty($orderId) || !is_numeric($orderId) || empty($newStatus)) {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid input: Missing order ID or new status.'
    ]);
    exit;
}

// Optional: Validate the new status against allowed values
$allowedStatuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled', 'Pending']; // Add all valid statuses
if (!in_array($newStatus, $allowedStatuses)) {
     echo json_encode([
        'success' => false,
        'message' => 'Invalid status value provided.'
    ]);
    exit;
}


// --- Database Update ---
// Use the $pdo variable from db_connect.php
global $pdo;

try {
    // Prepare the UPDATE statement
    $sql = "UPDATE orders SET status = :new_status WHERE order_id = :order_id";
    $stmt = $pdo->prepare($sql);

    // Bind parameters
    $stmt->bindParam(':new_status', $newStatus, PDO::PARAM_STR);
    $stmt->bindParam(':order_id', $orderId, PDO::PARAM_INT);

    // Execute the update
    $success = $stmt->execute();

    if ($success && $stmt->rowCount() > 0) {
        // Update was successful and at least one row was affected
        echo json_encode([
            'success' => true,
            'message' => "Order #{$orderId} status updated to '{$newStatus}'.",
            'updated_status' => $newStatus // Send back the status for JS update
        ]);
    } elseif ($success && $stmt->rowCount() === 0) {
         // Query ran fine, but no rows were updated (maybe order ID didn't exist or status was already set)
         echo json_encode([
            'success' => false, // Indicate no change occurred
            'message' => "Order #{$orderId} not found or status already set to '{$newStatus}'."
        ]);
    }
    else {
        // Execution failed
        throw new PDOException("Failed to execute update statement.");
    }

} catch (PDOException $e) {
    // Log the detailed error
    error_log("PDOException in update_order_status.php: " . $e->getMessage());
    // Send generic error response
    echo json_encode([
        'success' => false,
        'message' => 'Database error occurred while updating order status.'
        // 'error' => $e->getMessage() // Avoid in production
    ]);
}

// $pdo = null; // Close connection
exit;
?>