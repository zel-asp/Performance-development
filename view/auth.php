<?php
// Legacy Auth View - Redirects to standalone login.php
?>
<script>
    if (localStorage.getItem('oxford_session_auth') !== 'true') {
        window.location.replace('login.php');
    }
</script>
