<?php
header('Content-Type:application/json;charset=UTF-8');
$conn=mysqli_connect('127.0.0.1','root','aishangyxl','ulift');
$sql='SET NAMES UTF8';
mysqli_query($conn,$sql);
$output=[];
?>