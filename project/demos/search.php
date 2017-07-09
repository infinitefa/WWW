<?php
header('Content-Type: application/json; charset=UTF-8');
/*Connet MySQL */

/*Create trainstation tabel */

/*Write your SQL code*/
$link=mysql_connect('localhost:3306','s402410094','s402410094');

	mysql_query("SET NAMES 'UTF8';");
	mysql_select_db('s402410094');

    $buffersize = (int)$_POST['buffersize'];
    $sql="select * from restaurant;";
		  
	//echo $sql;
	$tem=mysql_query($sql) or die('MySQL query error');
	$arr_1=[];
	$arr_2=[];
	$arr_3=[];
	$arr_4=[];
	while($row=mysql_fetch_array($tem))
	{
		array_push($arr_1, $row['r_id']);
		array_push($arr_2, $row['name']);
		array_push($arr_3, $row['bld']);
		array_push($arr_4, $row['URL']);
		
	}


$result=array(
	'r_id' =>$arr_1,
	'name'=>$arr_2,
	'bld'=>$arr_3,
	'URL'=>$arr_4
);
/*Write json type*/
//$result=$arr;

echo json_encode($result,384);
?>