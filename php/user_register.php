<?php
/*注册新用户
请求参数 phone upwd nickName(可选)   输出结果{"code":1,"userId":4,"phone":"","nickName":""}或{"code":500}
*/
@$phone=$_REQUEST['phone'] or die('phone required');
@$upwd=$_REQUEST['upwd'] or die('upwd required');
@$nickName=$_REQUEST['nickName'] or $nickName="";

require('init.php');
$sql="INSERT INTO user (userId,phone,upwd,nickName) VALUES(null,'$phone','$upwd','$nickName')";
$result=mysqli_query($conn,$sql);

if($result){
$output['code']=1;
$output['phone']=$phone;
$output['userId']=intval(mysqli_insert_id($conn));
$output['nickName']=$nickName;
}else{
$output['code']=500;
}
echo json_encode($output);
?>