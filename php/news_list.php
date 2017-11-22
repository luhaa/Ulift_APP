<?php
/*
按发布时间逆顺序返回新闻列表
请求参数 pageNum 需要显示的页号,默认为1
输出结果 {
    totalRecord:58,  //总条数
    pageSize:10,  //每页显示条数
    pageCount:6,  //总页数
    pageNum:1,  //请求的页数
    data:[{},{}....{}]  //数据
}
*/
require('init.php');
@$pageNum=$_REQUEST['pageNum'] or $pageNum=1;

$output['pageNum']=intval($pageNum);
$output['pageSize']=6;

//获取总记录数和总页数
$sql="SELECT COUNT(*) FROM news";
$result=mysqli_query($conn,$sql);
$output['totalRecord']=intval(mysqli_fetch_row($result)[0]);
$output['pageCount']=ceil($output['totalRecord']/$output['pageSize']);

//获取指页中的数据
$start=($output['pageNum']-1)*$output['pageSize'];
$count=$output['pageSize'];
$sql="SELECT * FROM news ORDER BY pubTime DESC LIMIT $start,$count";
$result=mysqli_query($conn,$sql);
$output['data']=mysqli_fetch_all($result,MYSQLI_ASSOC);

echo json_encode($output);
?>