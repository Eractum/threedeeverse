<?php
include('config.php');
include('connect.php');

global $DB;
$str ='';
$reg ='/^[\w\.]+[^\.]?@[a-z0-9]+(\.[a-z0-9]+)*\.[a-z0-9]+$/';
if (preg_match($reg,$_POST['email'])) {
	$SQL ="INSERT INTO questions (name, email, info) VALUES ('".$_POST['name']."', '".$_POST['email']."', '".$_POST['comment']."')";
	mysqli_query($DB, $SQL);
	echo '<script type="text/javascript">';
	echo 'window.location.href=\''.SITE_LINK.'\';';
	echo '</script>';
}
else {
	echo '<script type="text/javascript">';
	echo ' alert("Invalid mail"); window.location.href=\''.SITE_LINK.'\';';
	echo '</script>';
}
die();
?>