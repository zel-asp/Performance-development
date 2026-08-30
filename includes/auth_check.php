<?php
// includes/auth_check.php

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

/**
 * Server-side role guard helper function.
 * Ensures the user has an active session and is authorized for the given roles.
 *
 * @param string|array $allowedRoles
 */
function requireRole($allowedRoles = [])
{
    if (empty($_SESSION['user_id']) || empty($_SESSION['role'])) {
        header('Location: /login.php');
        exit;
    }

    if (!is_array($allowedRoles)) {
        $allowedRoles = [$allowedRoles];
    }

    if (!empty($allowedRoles) && !in_array($_SESSION['role'], $allowedRoles, true)) {
        http_response_code(403);
        echo "<!DOCTYPE html><html><head><title>403 Forbidden</title></head><body style='font-family:sans-serif;padding:40px;text-align:center;'>";
        echo "<h1>403 Forbidden</h1><p>You do not have permission to access this page.</p>";
        echo "<a href='/login.php' style='color:#E11D48;text-decoration:none;font-weight:bold;'>Return to Login</a>";
        echo "</body></html>";
        exit;
    }
}
