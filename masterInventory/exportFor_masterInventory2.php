<?php
/* This file handles the export part of masterInventory2.php
*/

//get report from directory
exec("python3 masterInventory2_loadexcel.py", $output, $return_var);
//while($return_var != 0){};
$filename = "/var/www/html/MasterInventory.xlsx";

if(file_exists($filename)){

	header('Content-disposition: attachment; filename="MasterInventory.xlsx"');
	header('Content-type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
	header('Content-Length: ' . filesize($filename));
	header('Content-Transfer-Encoding: binary');
	header('Cache-Control: must-revalidate');
	header('Pragma: public');
	ob_clean();
	flush();
	readfile($filename);

}
?>
