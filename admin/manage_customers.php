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

// --- Fetch Users (Customers) ---
$customers = []; // Initialize an empty array for customers
$fetch_error = ''; // Variable to store any fetching errors

try {
    // Prepare SQL query to fetch users who are NOT admins
    // Select relevant columns, excluding the password
    $sql = "SELECT id, name, email, role, created_at
            FROM users
            WHERE role != 'admin'  -- Exclude users with the 'admin' role
            ORDER BY created_at DESC"; // Show newest customers first

    $stmt = $pdo->prepare($sql);
    $stmt->execute();

    // Fetch all matching users as an associative array
    $customers = $stmt->fetchAll(PDO::FETCH_ASSOC);

} catch (PDOException $e) {
    // Log the error and set an error message for the user
    error_log("Fetch Customers PDOException: " . $e->getMessage());
    $fetch_error = "Could not retrieve customer list from the database. Please check the logs or contact support.";
    // Check if the specific error is 'table not found'
    if (strpos($e->getMessage(), 'Base table or view not found') !== false || strpos($e->getMessage(), "Table 'woodstory.users' doesn't exist") !== false) {
         $fetch_error = "Error: The 'users' table was not found in the 'woodstory' database. Please ensure it has been created correctly.";
    }
}
// $pdo = null; // Optional: Close connection if script doesn't end here

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Customers - Woodstory Admin</title>
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
        /* Basic table styling (similar to manage_orders) */
        th, td { padding: 0.75rem 1rem; text-align: left; border-bottom: 1px solid #e5e7eb; vertical-align: middle; }
        th { background-color: #f9fafb; font-weight: 600; color: #374151; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em;}
        tr:hover { background-color: #f9fafb; }
         /* Action button/link styling */
        .action-link, .action-btn { /* Apply to both links and buttons */
            padding: 0.3rem 0.8rem; border-radius: 0.375rem; font-size: 0.8rem; font-weight: 500; cursor: pointer;
            transition: background-color 0.2s ease; border: 1px solid transparent; margin-right: 0.5rem;
            display: inline-flex; align-items: center; text-decoration: none; /* Remove underline from links */
        }
        .action-link:last-child, .action-btn:last-child { margin-right: 0; }
        .btn-view { background-color: #dbeafe; color: #1e40af; border-color: #bfdbfe; }
        .btn-view:hover { background-color: #bfdbfe; }
        .btn-delete { background-color: #fee2e2; color: #991b1b; border-color: #fecaca; }
        .btn-delete:hover { background-color: #fecaca; }
        .action-link lucide-icon, .action-btn lucide-icon { margin-right: 0.25rem; width: 0.9rem; height: 0.9rem; }
    </style>
</head>
<body class="bg-gray-100 min-h-screen p-4 md:p-8">

    <div class="bg-white p-6 md:p-8 rounded-lg shadow-md w-full max-w-6xl mx-auto">

        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b">
             <h1 class="text-2xl font-bold text-gray-800 mb-2 md:mb-0">Manage Customers</h1>
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

        <?php if (!empty($fetch_error)): ?>
            <div class="mb-4 p-4 bg-red-100 text-red-700 border border-red-300 rounded-md">
                <?php echo htmlspecialchars($fetch_error); ?>
            </div>
        <?php endif; ?>

        <div class="overflow-x-auto">
            <table class="min-w-full bg-white">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Registered On</th>
                        <th>Actions</th> </tr>
                </thead>
                <tbody>
                    <?php if (empty($customers) && empty($fetch_error)): ?>
                        <tr>
                            <td colspan="6" class="text-center text-gray-500 py-6">No customers found.</td>
                        </tr>
                    <?php else: ?>
                        <?php foreach ($customers as $customer): ?>
                            <tr>
                                <td class="text-sm font-medium text-gray-900"><?php echo htmlspecialchars($customer['id']); ?></td>
                                <td class="text-sm text-gray-900"><?php echo htmlspecialchars($customer['name']); ?></td>
                                <td class="text-sm text-gray-500"><?php echo htmlspecialchars($customer['email']); ?></td>
                                <td class="text-sm text-gray-500"><?php echo htmlspecialchars(ucfirst($customer['role'])); // Capitalize role ?></td>
                                <td class="text-sm text-gray-500">
                                    <?php
                                        // Format the date nicely
                                        try {
                                            $date = new DateTime($customer['created_at']);
                                            // Use a simpler date format for registration date
                                            echo $date->format('M d, Y');
                                        } catch (Exception $e) {
                                            echo htmlspecialchars($customer['created_at']); // Fallback
                                        }
                                    ?>
                                </td>
                                <td class="text-sm text-gray-500">
                                    <a href="view_customer_orders.php?customer_id=<?php echo $customer['id']; ?>" class="action-link btn-view" title="View Orders for <?php echo htmlspecialchars($customer['name']); ?>">
                                        <lucide-icon name="shopping-cart"></lucide-icon>View Orders
                                    </a>
                                    <button class="action-btn btn-delete" title="Delete Customer (Not Implemented)">
                                         <lucide-icon name="trash-2"></lucide-icon>Delete
                                    </button>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>

    </div>

    <script>
        // Basic setup if needed in the future
        document.addEventListener('DOMContentLoaded', () => {
            console.log("Manage Customers page loaded.");
            // Add event listeners for action buttons here if implemented
        });
    </script>

</body>
</html>
