<?php
//this handles the export example button below the import button
$filename = "boxDimensionDesc.xlsx";

if(file_exists($filename)){
  header('Content-disposition: attachment; filename='.$filename);
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
