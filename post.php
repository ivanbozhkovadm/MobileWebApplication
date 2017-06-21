<?php
$data = $_POST['data'];

$file = fopen("data.txt","a+");
fwrite($file,"\n".$data);
fclose($file);

echo 'ready';
?>