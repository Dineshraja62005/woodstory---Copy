<?php
// Start the session at the very beginning
session_start();

// Include database connection - Adjust path if needed
// This file creates the $pdo variable
require_once __DIR__ . '/../php/db_connect.php'; // Assumes db_connect.php is in 'php' folder one level up

// --- Login Processing ---
$login_error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['login'])) {
    $username = trim($_POST['username']);
    $password = $_POST['password']; // Get the plain text password

    if (empty($username) || empty($password)) {
        $login_error = 'Username and password are required.';
    } else {
        // Use the $pdo variable directly from db_connect.php
        try {
            $sql = "SELECT id, username, password_hash FROM admins WHERE username = :username LIMIT 1"; // Use named placeholder
            $stmt = $pdo->prepare($sql);

            // Bind the parameter
            $stmt->bindParam(':username', $username, PDO::PARAM_STR);

            // Execute the statement
            $stmt->execute();

            // Fetch the admin record (if found)
            // Use fetch() because we expect at most one row
            $admin = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($admin) {
                // User found, verify the password
                if (password_verify($password, $admin['password_hash'])) {
                    // Login successful
                    session_regenerate_id(true); // Prevent session fixation
                    $_SESSION['admin_logged_in'] = true;
                    $_SESSION['admin_id'] = $admin['id'];
                    $_SESSION['admin_username'] = $admin['username'];
                    // Redirect to the same page to clear POST data and show dashboard
                    header('Location: admin.php'); // Adjust if admin.php is not in root
                    exit;
                } else {
                    // Invalid password
                    $login_error = 'Invalid username or password.';
                }
            } else {
                // User not found
                $login_error = 'Invalid username or password.';
            }
             // PDO statements don't need explicit closing like mysqli $stmt->close()

        } catch (PDOException $e) {
            // Log error ideally instead of showing details to user
            error_log("Admin login PDOException: " . $e->getMessage());
            $login_error = 'An internal error occurred during login. Please try again.';
        }
         // PDO connection doesn't need explicit closing here as it's often managed by script end
         // $pdo = null; // Optional: explicitly close connection if needed earlier
    }
}

// --- Check if Admin is Logged In ---
$is_admin_logged_in = isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true;

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Woodstory Admin</title>
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
    <script src="https://unpkg.com/lucide-react@latest/dist/umd/lucide.js"></script>
    <style>
        body { font-family: 'Inter', sans-serif; }
    </style>
</head>
<body class="bg-gray-100 min-h-screen flex items-center justify-center p-4">

    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">

        <?php if ($is_admin_logged_in): ?>
            <div class="flex justify-between items-center mb-6 pb-4 border-b">
                 <h1 class="text-2xl font-bold text-gray-800">Woodstory Admin Panel</h1>
                 <div>
                    <span class="text-gray-600 mr-4">Welcome, <?php echo htmlspecialchars($_SESSION['admin_username']); ?>!</span>
                    <a href="../php/admin_logout.php" class="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                        <i data-lucide="log-out" class="w-4 h-4 mr-2"></i>
                        Logout
                    </a>
                 </div>
            </div>

            <h2 class="text-xl font-semibold text-gray-700 mb-4">Management Options</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a href="manage_orders.php" class="block p-6 bg-green-50 hover:bg-green-100 rounded-lg shadow-sm text-center transition duration-150 ease-in-out">
                    <i data-lucide="shopping-cart" class="h-10 w-10 mx-auto text-green-600 mb-2"></i>
                    <span class="font-medium text-green-800">Manage Orders</span>
                </a>
                <a href="manage_customers.php" class="block p-6 bg-yellow-50 hover:bg-yellow-100 rounded-lg shadow-sm text-center transition duration-150 ease-in-out">
                     <i data-lucide="users" class="h-10 w-10 mx-auto text-yellow-600 mb-2"></i>
                    <span class="font-medium text-yellow-800">Manage Customers</span>
                </a>
            </div>
             <div class="mt-8 text-center border-t pt-4">
                <a href="../home.html" class="text-sm text-indigo-600 hover:underline">← Back to Main Site</a>
            </div>

        <?php else: ?>
            <h2 class="text-2xl font-bold mb-6 text-center text-gray-700">Admin Login</h2>

            <?php
            // Display login error message if exists
            if (!empty($login_error)) {
                echo '<div class="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-md text-sm">' . htmlspecialchars($login_error) . '</div>';
            }
            ?>

            <form action="admin.php" method="POST" class="max-w-sm mx-auto"> <input type="hidden" name="login" value="1">
                <div class="mb-4">
                    <label for="username" class="block text-sm font-medium text-gray-600 mb-1">Username</label>
                    <input type="text" id="username" name="username" required
                           class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                           placeholder="Enter your username">
                </div>
                <div class="mb-6">
                    <label for="password" class="block text-sm font-medium text-gray-600 mb-1">Password</label>
                    <input type="password" id="password" name="password" required
                           class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                           placeholder="Enter your password">
                </div>
                <div>
                    <button type="submit"
                            class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 ease-in-out">
                        Login
                    </button>
                </div>
            </form>
             <div class="mt-6 text-center">
                 <a href="../home.html" class="text-sm text-indigo-600 hover:underline">← Back to Main Site</a>
            </div>

        <?php endif; ?>

    </div>

    <script>
      lucide.createIcons();
    </script>
</body>
</html>
