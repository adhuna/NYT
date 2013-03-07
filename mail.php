<?php

$name = $_POST['name'];
$email = $_POST['email'];
$link = $_POST['link'];

mail($email, $name, $link);

?>