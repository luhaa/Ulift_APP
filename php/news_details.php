<?php
/*
请求参数 newsId
输出结果 $output{}
*/
@$newsId=$_REQUEST['newsId'] or die ('newsId required');
require('init.php');

$sql="SELECT title,pubTime,content FROM news WHERE newsId='$newsId'";
$result=mysqli_query($conn,$sql);
$output=mysqli_fetch_assoc($result);

echo json_encode($output);
?>