<?php
// Replace 'your_chosen_password' with the actual password you want to use
$plainPassword = 'admin123';

// Hash the password using PHP's recommended algorithm
$hashedPassword = password_hash($plainPassword, PASSWORD_DEFAULT);

// Output the hash - Copy this entire output string!
echo "Password: " . $plainPassword . "<br>";
echo "Hashed Password (copy this): " . htmlspecialchars($hashedPassword);

?>