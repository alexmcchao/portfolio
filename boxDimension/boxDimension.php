<?php
include 'functions.php';
headers('Box Dimension');

?>

<!DOCTYPE html>
<html lang="en">
<head>
<!--<script type="text/javascript" src="/js/fusioncharts.js"></script>-->
<!--<script type="text/javascript" src="/js/fusioncharts.theme.ocean.js"></script>-->
<style>
label.required:after{
	color: red;
	content:" *";
}
select.required:after{
	color: red;
	content:" *";
}
input:required:focus{
	border: 1px solid red;
	outline:none;
}
input:required:hover{
	opacity:1;
}
hr{
	border-color: grey;
}
p.sectionTitle{
	font-size: 24px;
}
div.center{
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}
/* Gradient color1 - color2 - color1 */
hr.style-one {
    border: 0;
    height: 1px;
    background: #333;
    background-image: linear-gradient(to right, #ccc, #333, #ccc);
}
#cover {
	position: fixed;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: url("http://www.aveva.com/Images/ajax-loader.gif") no-repeat scroll center center #D3D3D3;
	z-index: 2;
	cursor: pointer;
	opacity: 0.5;
}
</style>
<meta charset="UTF-8">
<link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css" rel="stylesheet"/>
<!--<script type="text/javascript" src="/path/to/jquery.tablesorter.js"></script>-->
<!--<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>-->
<script src='boxDimensionUtility.js'></script>
<title>BF and Target Item Import</title>
</head>
<body>
<div id="cover"></div>
<div class='center'>
  <h1><img src='box.png' style='width: 5%;'> Box Dimension <img src='box.png' style='width: 5%;'></h1><br>
	<!--****************************************************************************************************************-->
	<!--download format-->
	<!--****************************************************************************************************************-->
	<p class="sectionTitle"><b>Get an import format</b></p>
	<form action='boxDimensionExample.php' method='post'>
		<div class='row'>
      <div class="col-sm-5"></div>
			<div class="col-sm-2">
				<button type='submit' class="btn btn-info btn-lg btn-block" id='getFormat' name='getFormat' value='Get Import Format'><i class="glyphicon glyphicon-cloud-download"></i> Get Import Format</button>
			</div>
      <div class="col-sm-5"></div>
		</div>
	</form>
	<br>
	<hr class='style-one'>
	<!--****************************************************************************************************************-->
	<!--Import-->
	<!--****************************************************************************************************************-->
	<p class="sectionTitle"><b>Select an xlsx file to this page</b></p>
	<form name='fileform' enctype='multipart/form-data' action='boxDimension.php' method='post'>
	<div class='row'>
    <div class="col-sm-5"></div>
		<div class="col-sm-2">
			<label class='required'>Select a file to import:</label>
			<input class = "custom-file-input" size='5000' type='file' name="filepath" id="filepath" required>
		</div>
    <div class="col-sm-5"></div>
	</div><br>
	<div class='row'>
    <div class="col-sm-5"></div>
		<div class="col-sm-2">
			<button type='submit' class="btn btn-primary btn-lg btn-block" id='import' name='submit' value='Import'><i class="glyphicon glyphicon-cloud-upload"></i> Import</button>
		</div>
    <div class="col-sm-5"></div>
	</div>
	</form><br>
	<hr class='style-one'>
  <!--****************************************************************************************************************-->
	<!--Export-->
	<!--****************************************************************************************************************-->
  <p class="sectionTitle"><b>Click to export the excel with box dimension</b></p>
  <form name = "Export" target="_blank" action = "exportFor_boxDimension.php" method = "post">
    <div class='row'>
      <div class="col-sm-4"></div>
  		<div class="col-sm-4">
  			<button class="btn btn-success btn-lg btn-block" type="submit" id='ExportButton' name="ExportButton" value="ExportButton"><span class="glyphicon glyphicon-cloud-download"></span> Export Box Dimension</button>
  		</div>
		</div>
	</form><br>
	<form name = "Export2" target="_blank" action = "exportFor_boxDimensionDesc.php" method = "post">
		<div class='row'>
			<div class="col-sm-4"></div>
			<div class="col-sm-4">
				<button class="btn btn-success btn-lg btn-block" type="submit" id='ExportButton2' name="ExportButton2" value="ExportButton2"><span class="glyphicon glyphicon-cloud-download"></span> Export Box Dimension Desc</button>
			</div>
		</div>
	</form><br>
</div>
</body>
</html>
<?php

/**
* check if a file type is Invalid.
* alert user with a message if the file type is not valid.
* @param $fileType  The file extension of the imported file.
* @param $allowed   An array of types allowed.
* @return bool, true if type is invalid, false otherwise.
**/
function checkFileType($fileType, $allowed){
	if(!in_array($fileType, $allowed)){
		giveMessage('Unsuccessful upload! Invalid file type. This page only accept .xlsx file.');
		return true;
	}
	else{
		return false;
	}
}

/**
* pop alert with message.
* @param $m  message
* @return void
**/
function giveMessage($m){
	echo "<script language='javascript'>";
	echo "	alert('".$m."');";
	echo "</script>";
}
if (isset($_POST['submit'])) {
	//Check file type
  $allowed = array('xlsx');
	$filename = $_FILES['filepath']['name'];
	$fileType = pathinfo($filename,PATHINFO_EXTENSION);
	$invalidFileType = checkFileType($fileType, $allowed);

	if(!$invalidFileType){
    //create file and copy the content of the uploaded file to this new file.
		$target_file = "boxDimension_Imported.xlsx";
    move_uploaded_file($_FILES["filepath"]["tmp_name"], $target_file);
  }
  $command = "python3.7 boxDimension.py ".$target_file;
	$result = exec($command,$out,$ret);
	$command2 = "python3.7 boxDimensionDesc.py ".$target_file;
	$result2 = exec($command,$out,$ret);
	giveMessage("Imported successfully!");
}
closehtml();
?>
