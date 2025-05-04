<?php
// Start the session at the very beginning
session_start();

// --- Check if Admin is Logged In ---
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: admin.php');
    exit;
}

// Include database connection
require_once __DIR__ . '/../php/db_connect.php'; // Assumes db_connect.php is in 'php' folder one level up

// --- Get Customer ID from URL ---
$customerId = $_GET['customer_id'] ?? null;
$customer = null;
$orders = [];
$fetch_error = '';

if (empty($customerId) || !is_numeric($customerId)) {
    $fetch_error = "Invalid or missing customer ID.";
} else {
    global $pdo; // Make $pdo available

    try {
        // 1. Fetch Customer Details
        $sqlCustomer = "SELECT id, name, email FROM users WHERE id = :customer_id AND role != 'admin'";
        $stmtCustomer = $pdo->prepare($sqlCustomer);
        $stmtCustomer->bindParam(':customer_id', $customerId, PDO::PARAM_INT);
        $stmtCustomer->execute();
        $customer = $stmtCustomer->fetch(PDO::FETCH_ASSOC);

        if (!$customer) {
            $fetch_error = "Customer not found or is an admin.";
        } else {
            // 2. Fetch Orders for this Customer
            $sqlOrders = "SELECT order_id, order_date, total_amount, status
                          FROM orders
                          WHERE user_id = :customer_id
                          ORDER BY order_date DESC";
            $stmtOrders = $pdo->prepare($sqlOrders);
            $stmtOrders->bindParam(':customer_id', $customerId, PDO::PARAM_INT);
            $stmtOrders->execute();
            $orders = $stmtOrders->fetchAll(PDO::FETCH_ASSOC);
        }

    } catch (PDOException $e) {
        error_log("Fetch Customer/Orders PDOException: " . $e->getMessage());
        $fetch_error = "Could not retrieve data from the database. Please check the logs.";
    }
}
// $pdo = null;

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Orders for <?php echo $customer ? htmlspecialchars($customer['name']) : 'Customer'; ?> - Woodstory Admin</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
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
        /* Status badges */
        .status-badge { padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 500; display: inline-block; line-height: 1.25; }
        .status-pending { background-color: #fef3c7; color: #92400e; }
        .status-processing { background-color: #dbeafe; color: #1e40af; }
        .status-shipped { background-color: #e9d5ff; color: #581c87; }
        .status-delivered { background-color: #d1fae5; color: #065f46; }
        .status-cancelled { background-color: #fee2e2; color: #991b1b; }
        /* Action link styling */
        .action-link {
            padding: 0.3rem 0.8rem; border-radius: 0.375rem; font-size: 0.8rem; font-weight: 500; cursor: pointer;
            transition: background-color 0.2s ease; border: 1px solid transparent; margin-right: 0.5rem;
            display: inline-flex; align-items: center; text-decoration: none;
        }
        .btn-view-details { background-color: #dbeafe; color: #1e40af; border-color: #bfdbfe; }
        .btn-view-details:hover { background-color: #bfdbfe; }
        .action-link lucide-icon { margin-right: 0.25rem; width: 0.9rem; height: 0.9rem; }
    </style>
</head>
<body class="bg-gray-100 min-h-screen p-4 md:p-8">

    <div class="bg-white p-6 md:p-8 rounded-lg shadow-md w-full max-w-6xl mx-auto">

        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b">
             <div>
                 <h1 class="text-2xl font-bold text-gray-800 mb-1">
                     Orders for: <?php echo $customer ? htmlspecialchars($customer['name']) : 'Unknown Customer'; ?>
                 </h1>
                 <?php if ($customer): ?>
                 <p class="text-sm text-gray-600">
                    ID: <?php echo htmlspecialchars($customer['id']); ?> | Email: <?php echo htmlspecialchars($customer['email']); ?>
                 </p>
                 <?php endif; ?>
             </div>
             <div class="flex space-x-4 mt-4 md:mt-0">
                <a href="manage_customers.php" class="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <lucide-icon name="arrow-left" class="w-4 h-4 mr-2"></lucide-icon>
                    Back to Customers
                </a>
                <a href="php/admin_logout.php" class="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                    <lucide-icon name="log-out" class="w-4 h-4 mr-2"></lucide-icon>
                    Logout
                </a>
             </div>
        </div>

        <?php if (!empty($fetch_error)): ?>
            <div class="mb-4 p-4 bg-red-100 text-red-700 border border-red-300 rounded-md">
                <?php echo htmlspecialchars($fetch_error); ?>
            </div>
        <?php endif; ?>

        <?php if ($customer && empty($fetch_error)): // Only show table if customer found and no error ?>
            <h2 class="text-xl font-semibold text-gray-700 mb-4">Order History</h2>
            <div class="overflow-x-auto">
                <table class="min-w-full bg-white">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Order Date</th>
                            <th>Total Amount</th>
                            <th>Status</th>
                            <th>Actions</th> </tr>
                    </thead>
                    <tbody>
                        <?php if (empty($orders)): ?>
                            <tr>
                                <td colspan="5" class="text-center text-gray-500 py-6">This customer has no orders yet.</td>
                            </tr>
                        <?php else: ?>
                            <?php foreach ($orders as $order): ?>
                                <tr>
                                    <td class="text-sm font-medium text-gray-900"><?php echo htmlspecialchars($order['order_id']); ?></td>
                                    <td class="text-sm text-gray-500">
                                        <?php
                                            try {
                                                $date = new DateTime($order['order_date']);
                                                echo $date->format('M d, Y H:i A');
                                            } catch (Exception $e) {
                                                echo htmlspecialchars($order['order_date']);
                                            }
                                        ?>
                                    </td>
                                    <td class="text-sm text-gray-900 font-medium">$<?php echo number_format(htmlspecialchars($order['total_amount']), 2); ?></td>
                                    <td class="text-sm">
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
                                    <td class="text-sm text-gray-500">
                                        <a href="manage_orders.php#order-row-<?php echo $order['order_id']; ?>" class="action-link btn-view-details" title="View Full Order Details">
                                             <lucide-icon name="eye"></lucide-icon>View Details
                                        </a>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        <?php endif; ?>

    </div>

</body>
</html>