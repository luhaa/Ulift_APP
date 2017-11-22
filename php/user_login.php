<?php
/*实现用户登录 请求参数: phone upwd   输出结果: 成功{"code":1,"userId":"","phone":"nickname":""}
失败:{"code":400}*/

/*获取前端提交的数据库*/
/*去数据库中查询*/
/*返回响应*/
@$phone=$_REQUEST['phone'] or die('phone required');
@$upwd=$_REQUEST['upwd'] or die('upwd required');

require('init.php');

$sql="SELECT userId,phone,nickName FROM user WHERE phone='$phone' AND upwd='$upwd'";
$result=mysqli_query($conn,$sql);
if (!$result) {
 printf("Error: %s\n", mysqli_error($conn));
 exit();
}
$row=mysqli_fetch_assoc($result);

if($row){
    $output['code']=1;
    $output['userId']=intval($row['userId']);
    $output['phone']=$row['phone'];
    $output['nickName']=$row['nickName'];
}else{
    $output['code']=400;
}
echo json_encode($output);

?>