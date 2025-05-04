<?php
// Start the session at the very beginning
session_start();

// --- Check if Admin is Logged In ---
// Redirect to login if not logged in
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    // Adjust the path to admin.php if it's not in the root
    header('Location: admin.php');
    exit;
}

// Include database connection - Adjust path if needed
// This file creates the $pdo variable
require_once __DIR__ . '/../php/db_connect.php'; // Assumes db_connect.php is in 'php' folder one level up

// --- Fetch Orders ---
$orders = []; // Initialize an empty array for orders
$fetch_error = ''; // Variable to store any fetching errors

try {
    // Prepare SQL query to fetch orders - Updated columns
    // Fetches all necessary columns for display and actions
    $sql = "SELECT
                order_id, user_id, order_date, status,
                customer_first_name, customer_last_name, customer_email, customer_phone,
                shipping_address, shipping_city, shipping_state, shipping_zip, shipping_country,
                subtotal_amount, shipping_amount, tax_amount, discount_amount, total_amount,
                promo_code_used, payment_method, order_notes
            FROM orders
            ORDER BY order_date DESC"; // Show newest orders first

    $stmt = $pdo->prepare($sql);
    $stmt->execute();

    // Fetch all orders as an associative array
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

} catch (PDOException $e) {
    // Log the error and set an error message for the user
    error_log("Fetch Orders PDOException: " . $e->getMessage());
    $fetch_error = "Could not retrieve orders from the database. Please check the logs or contact support.";
    // Check if the specific error is 'table not found'
    if (strpos($e->getMessage(), 'Base table or view not found') !== false || strpos($e->getMessage(), "Table 'woodstory.orders' doesn't exist") !== false) {
         $fetch_error = "Error: The 'orders' table was not found in the 'woodstory' database. Please ensure it has been created correctly.";
    }
}
// $pdo = null; // Optional: Close connection if script doesn't end here

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Orders - Woodstory Admin</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'], // Use Inter font
                    },
                }
            }
        }
    </script>
    <link rel="stylesheet" href="https://rsms.me/inter/inter.css">
    <script src="https://cdn.jsdelivr.net/npm/lucide-element@0.378.0/dist/lucide-element.min.js"></script>
    <style>
        body { font-family: 'Inter', sans-serif; }
        /* Basic table styling */
        th, td { padding: 0.75rem 1rem; text-align: left; border-bottom: 1px solid #e5e7eb; vertical-align: middle; }
        th { background-color: #f9fafb; font-weight: 600; color: #374151; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em;}
        tr:hover { background-color: #f9fafb; }
        /* Styling for status badges */
        .status-badge { padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 500; display: inline-block; line-height: 1.25; }
        .status-pending { background-color: #fef3c7; color: #92400e; } /* Yellow */
        .status-processing { background-color: #dbeafe; color: #1e40af; } /* Blue */
        .status-shipped { background-color: #e9d5ff; color: #581c87; } /* Purple */
        .status-delivered { background-color: #d1fae5; color: #065f46; } /* Green */
        .status-cancelled { background-color: #fee2e2; color: #991b1b; } /* Red */
        /* Action button styling */
        .action-btn {
            padding: 0.3rem 0.8rem;
            border-radius: 0.375rem; /* rounded-md */
            font-size: 0.8rem;
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.2s ease;
            border: 1px solid transparent;
            margin-right: 0.5rem; /* Add space between buttons */
            display: inline-flex; /* Align icon and text */
            align-items: center;
        }
        .action-btn:last-child { margin-right: 0; }
        .btn-approve { background-color: #d1fae5; color: #065f46; border-color: #a7f3d0; }
        .btn-approve:hover { background-color: #a7f3d0; }
        .btn-cancel { background-color: #fee2e2; color: #991b1b; border-color: #fecaca; }
        .btn-cancel:hover { background-color: #fecaca; }
        /* Use lucide-icon web component tag instead of <i> */
        lucide-icon { margin-right: 0.25rem; width: 0.9rem; height: 0.9rem; display: inline-block; vertical-align: text-bottom; }
        /* Style for disabled/completed actions */
        .action-btn:disabled { opacity: 0.6; cursor: not-allowed; background-color: #e5e7eb; color: #6b7280; border-color: #d1d5db; }
        /* Message area styling */
        #message-area { margin-bottom: 1rem; padding: 0.75rem 1rem; border-radius: 0.375rem; font-size: 0.875rem; display: none; }
        #message-area.success { background-color: #d1fae5; color: #065f46; border: 1px solid #a7f3d0; }
        #message-area.error { background-color: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }
        /* Spinner animation */
        .animate-spin {
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
    </style>
</head>
<body class="bg-gray-100 min-h-screen p-4 md:p-8">

    <div class="bg-white p-6 md:p-8 rounded-lg shadow-md w-full max-w-7xl mx-auto">

        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b">
             <h1 class="text-2xl font-bold text-gray-800 mb-2 md:mb-0">Manage Orders</h1>
             <div class="flex space-x-4">
                <a href="admin.php" class="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <lucide-icon name="arrow-left" class="w-4 h-4 mr-2"></lucide-icon>
                    Back to Dashboard
                </a>
                <a href="php/admin_logout.php" class="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                     <lucide-icon name="log-out" class="w-4 h-4 mr-2"></lucide-icon>
                    Logout
                </a>
             </div>
        </div>

        <div id="message-area"></div>

        <?php if (!empty($fetch_error)): ?>
            <div class="mb-4 p-4 bg-red-100 text-red-700 border border-red-300 rounded-md">
                <?php echo htmlspecialchars($fetch_error); ?>
            </div>
        <?php endif; ?>

        <div class="overflow-x-auto">
            <table class="min-w-full bg-white">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Email / Phone</th>
                        <th>Order Date</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($orders) && empty($fetch_error)): ?>
                        <tr>
                            <td colspan="7" class="text-center text-gray-500 py-6">No orders found.</td>
                        </tr>
                    <?php else: ?>
                        <?php foreach ($orders as $order): ?>
                            <tr id="order-row-<?php echo $order['order_id']; ?>">
                                <td class="text-sm font-medium text-gray-900"><?php echo htmlspecialchars($order['order_id']); ?></td>
                                <td class="text-sm text-gray-900"><?php echo htmlspecialchars($order['customer_first_name'] . ' ' . $order['customer_last_name']); ?></td>
                                <td class="text-sm text-gray-500">
                                    <?php echo htmlspecialchars($order['customer_email']); ?>
                                    <?php if (!empty($order['customer_phone'])): ?>
                                        <br/><?php echo htmlspecialchars($order['customer_phone']); ?>
                                    <?php endif; ?>
                                </td>
                                <td class="text-sm text-gray-500">
                                    <?php
                                        // Format the date nicely
                                        try {
                                            $date = new DateTime($order['order_date']);
                                            echo $date->format('M d, Y H:i A');
                                        } catch (Exception $e) {
                                            echo htmlspecialchars($order['order_date']); // Fallback
                                        }
                                    ?>
                                </td>
                                <td class="text-sm text-gray-900 font-medium">$<?php echo number_format(htmlspecialchars($order['total_amount']), 2); ?></td>
                                <td class="text-sm" id="status-<?php echo $order['order_id']; ?>">
                                    <?php
                                        $status = htmlspecialchars($order['status']);
                                        $statusLower = strtolower($status);
                                        $statusClass = 'status-pending'; // Default
                                        if ($statusLower === 'processing') $statusClass = 'status-processing';
                                        if ($statusLower === 'shipped') $statusClass = 'status-shipped';
                                        if ($statusLower === 'delivered') $statusClass = 'status-delivered';
                                        if ($statusLower === 'cancelled') $statusClass = 'status-cancelled';
                                    ?>
                                    <span class="status-badge <?php echo $statusClass; ?>">
                                        <?php echo $status; ?>
                                    </span>
                                </td>
                                <td class="text-sm" id="actions-<?php echo $order['order_id']; ?>">
                                    <?php if ($statusLower === 'pending'): // Only show actions for pending orders ?>
                                        <button class="action-btn btn-approve" data-order-id="<?php echo $order['order_id']; ?>" data-new-status="Processing">
                                            <lucide-icon name="check-circle"></lucide-icon>Approve
                                        </button>
                                        <button class="action-btn btn-cancel" data-order-id="<?php echo $order['order_id']; ?>" data-new-status="Cancelled">
                                             <lucide-icon name="x-circle"></lucide-icon>Cancel
                                        </button>
                                    <?php elseif ($statusLower === 'processing'): // Option to mark as shipped ?>
                                         <button class="action-btn btn-approve" style="background-color: #e9d5ff; color: #581c87; border-color: #d8b4fe;" data-order-id="<?php echo $order['order_id']; ?>" data-new-status="Shipped">
                                             <lucide-icon name="truck"></lucide-icon>Ship
                                        </button>
                                         <button class="action-btn btn-cancel" data-order-id="<?php echo $order['order_id']; ?>" data-new-status="Cancelled">
                                             <lucide-icon name="x-circle"></lucide-icon>Cancel
                                        </button>
                                    <?php else: // For Shipped, Delivered, Cancelled - show no actions or just 'View' ?>
                                        <span class="text-xs text-gray-400 italic">No actions</span>
                                        <?php endif; ?>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>

    </div>

    <script>
        // No need to wait for lucide object with lucide-element
        document.addEventListener('DOMContentLoaded', () => {
            const messageArea = document.getElementById('message-area');
            const tableBody = document.querySelector('tbody');

            if (tableBody) {
                tableBody.addEventListener('click', function(event) {
                    const button = event.target.closest('.action-btn');
                    if (!button) return;

                    const orderId = button.dataset.orderId;
                    const newStatus = button.dataset.newStatus;
                    const actionText = button.textContent.trim();

                    if (!confirm(`Are you sure you want to ${actionText.toLowerCase()} order #${orderId}?`)) {
                        return;
                    }

                    const data = new FormData();
                    data.append('order_id', orderId);
                    data.append('new_status', newStatus);

                    button.disabled = true;
                    const originalButtonHTML = button.innerHTML; // Store original HTML
                    // Add spinner icon using lucide-icon tag
                    button.innerHTML = '<lucide-icon name="loader-2" class="animate-spin mr-1 h-3 w-3"></lucide-icon>Processing...';

                    fetch('../php/update_order_status.php', { // ** Ensure path is correct **
                        method: 'POST',
                        body: data
                    })
                    .then(response => response.json())
                    .then(result => {
                        messageArea.textContent = result.message || 'An unknown response occurred.';
                        messageArea.className = result.success ? 'success' : 'error';
                        messageArea.style.display = 'block';
                        setTimeout(() => { messageArea.style.display = 'none'; }, 5000);

                        if (result.success && result.updated_status) {
                            // Update status badge
                            const statusCell = document.getElementById(`status-${orderId}`);
                            if (statusCell) {
                                const statusLower = result.updated_status.toLowerCase();
                                let statusClass = 'status-pending';
                                if (statusLower === 'processing') statusClass = 'status-processing';
                                if (statusLower === 'shipped') statusClass = 'status-shipped';
                                if (statusLower === 'delivered') statusClass = 'status-delivered';
                                if (statusLower === 'cancelled') statusClass = 'status-cancelled';
                                statusCell.innerHTML = `<span class="status-badge ${statusClass}">${result.updated_status}</span>`;
                            }

                            // Update action buttons
                            const actionCell = document.getElementById(`actions-${orderId}`);
                            if (actionCell) {
                                let newActionHTML = `<span class="text-xs text-gray-400 italic">No actions</span>`; // Default
                                if (result.updated_status === 'Processing') {
                                    newActionHTML = `
                                        <button class="action-btn btn-approve" style="background-color: #e9d5ff; color: #581c87; border-color: #d8b4fe;" data-order-id="${orderId}" data-new-status="Shipped">
                                            <lucide-icon name="truck"></lucide-icon>Ship
                                        </button>
                                        <button class="action-btn btn-cancel" data-order-id="${orderId}" data-new-status="Cancelled">
                                            <lucide-icon name="x-circle"></lucide-icon>Cancel
                                        </button>
                                    `;
                                } else if (result.updated_status === 'Pending') {
                                    newActionHTML = `
                                        <button class="action-btn btn-approve" data-order-id="${orderId}" data-new-status="Processing">
                                            <lucide-icon name="check-circle"></lucide-icon>Approve
                                        </button>
                                        <button class="action-btn btn-cancel" data-order-id="${orderId}" data-new-status="Cancelled">
                                            <lucide-icon name="x-circle"></lucide-icon>Cancel
                                        </button>
                                    `;
                                }
                                actionCell.innerHTML = newActionHTML;
                            }
                        } else {
                            // Re-enable button on failure reported by server
                            button.disabled = false;
                            button.innerHTML = originalButtonHTML; // Restore original HTML
                        }
                    })
                    .catch(error => {
                        console.error('Error updating order status:', error);
                        messageArea.textContent = 'An error occurred: ' + error.message;
                        messageArea.className = 'error';
                        messageArea.style.display = 'block';
                        // Re-enable button on fetch error
                        button.disabled = false;
                        button.innerHTML = originalButtonHTML; // Restore original HTML
                        setTimeout(() => { messageArea.style.display = 'none'; }, 5000);
                    });
                });
            } else {
                console.error("Table body not found for event listener setup.");
            }
        });
    </script>

</body>
</html>