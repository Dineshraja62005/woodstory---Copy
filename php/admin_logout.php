<?php
    // Start the session to access session variables
    session_start();

    // Unset all session variables specifically for the admin
    // You might want to be more specific if you have both user and admin sessions
    // For now, we assume destroying the whole session is okay for admin logout.
    $_SESSION = array(); // Clear all session data

    // If it's desired to kill the session, also delete the session cookie.
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params["path"], $params["domain"],
            $params["secure"], $params["httponly"]
        );
    }

    // Finally, destroy the session.
    session_destroy();

    // --- Redirection Logic ---
    // Redirect *always* back to the admin login page after admin logout
    // Adjust the path relative to this file (php/admin_logout.php)
    // If admin.php is in the root: header("Location: ../admin.php");
    // If admin.php is in an 'admin' folder: header("Location: ../admin/admin.php");
    header("Location: ../admin/admin.php"); // Adjust path if needed!
    exit(); // Important: Stop script execution after redirect
    ?>