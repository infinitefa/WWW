<?php
header('Content-Type: application/json; charset=UTF-8');
/*Connet MySQL */
/*Create trainstation tabel */
/*Write your SQL code*/
$link=mysql_connect('localhost:3306','s402410094','s402410094');

	mysql_query("SET NAMES 'UTF8';");
	mysql_select_db('s402410094');

    $r_id = (int)$_POST['r_id'];
	$comment=$_POST['comment'];
	$name=$_POST['name'];
	
		$sql="select count(*) as coun from r_coment;";
	//echo $sql;
	$coun=mysql_query($sql) or die('MySQL coun query error');
	$cou=mysql_fetch_array($coun);

		$tem=$cou['coun'];
	
	$commentid=$tem+1;
	
	
	$sql="insert into r_coment values(".$r_id.",'".$comment."',".$commentid.",'".$name."');";
	mysql_query($sql)or die('MySQL co query error');
    $sql="select * from r_coment where r_id=".$r_id.";";
		  
	//echo $sql;
	$tem=mysql_query($sql) or die('MySQL query error');
	$arr_co=[];
	$arr_user=[];
	while($row=mysql_fetch_array($tem))
	{
		array_push($arr_co, $row['comment']);
		array_push($arr_user, $row['username']);
	}



$result=array(
	'comment' =>$arr_co,
	'username'=>$arr_user
);
/*Write json type*/

//$result=$arr;


echo json_encode($result,384);
?>