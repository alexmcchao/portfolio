<?php
include 'functions.php';
headers("WMS and FOACA Inventory");
?>

<!DOCTYPE html>
<html lang="en">
<head>
<script type="text/javascript" src="/js/fusioncharts.js"></script>
<script type="text/javascript" src="/js/fusioncharts.theme.ocean.js"></script>
<style>
div.back{
	/*background-color: #F5FFFF;*/
	background-image: url("inventory-honeycomb4.png");
	background-repeat: no-repeat, repeat;
	background-position: center;
	background-attachment: fixed;
	background-size: 60%;
}
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
/* Gradient color1 - color2 - color1 */
hr.style-one {
    border: 0;
    height: 1px;
    background: #333;
    background-image: linear-gradient(to right, #ccc, #333, #ccc);
}
/* Glyph, by Harry Roberts */
hr.style-eight {
    overflow: visible; /* For IE */
    padding: 0;
    border: none;
    border-top: medium double #333;
    color: #333;
    text-align: center;
}
hr.style-eight:after {
    content: "§";
    display: inline-block;
    position: relative;
    top: -0.7em;
    font-size: 1.5em;
    padding: 0 0.25em;
}
p.sectionTitle{
	font-size: 24px;
	text-align: center;
	color: Black;
}

.parent{
	text-align:center;
}
.tableloading{
	position: relative;
	text-align:center;
	z-index: 2;
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
<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.10.20/css/jquery.dataTables.min.css">
<link rel='stylesheet' type='text/css' href='table_blueTable.css' media='screen' />
<link rel='stylesheet' type='text/css' href='table_greenTable.css' media='screen' />
<link rel='stylesheet' type='text/css' href='table_redTable.css' media='screen' />
<script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/1.10.20/js/jquery.dataTables.min.js"></script>
<script src='masterInventory2Utility.js?1501'></script>
<title>WMS and FOACA Inventory</title>
</head>
<body>
<div id='cover'></div>
<div class='back'>
<h1 style='text-align:center;'><img src='inventory-icon-10.jpg' style='width:5%'> WMS and FOACA Inventory</h1>
<hr class='style-eight'>
<!--****************************************************************************************************************-->
<!--Search-->
<!--****************************************************************************************************************-->

<p class="sectionTitle"><b>
	<img src='https://img.icons8.com/cute-clipart/64/000000/search.png'
	style='width:3%'>
	Search</b></p>

<div class="row">
	<div class="col-sm-3"></div>
	<div class="col-sm-4">
		<label class='required'>Search SKU</label>
		<input class="form-control" type="text" name="searchSKU" id='searchSKU' value="" required/>
	</div>
	<div class="col-sm-1">
		<label style="visibility:hidden">click</label><br>
		<button class="btn btn-warning" type="button" id="Search" name = 'Search' value="Search">
			<span class="glyphicon glyphicon-search"></span> Search</button>
	</div>
	<div class="col-sm-2">
		<label style="visibility:hidden">click2</label><br>
		<button type='submit' class="btn btn-info" id='download'>
			<span class="glyphicon glyphicon-cloud-download"></span> Download Table</button>
	</div>
	<div class="col-sm-2"></div>
</div>
<hr class='style-one'>
<!--****************************************************************************************************************-->
<!--End of Search-->
<!--****************************************************************************************************************-->

<!--****************************************************************************************************************-->
<!--Kit Table-->
<!--****************************************************************************************************************-->
<p class="sectionTitle" id='kitTitle'><b><img src='box.png' style='width:5%'> Kit Table </b></p>
<div class='tableloading' id="table1loading">
    <img src='https://thumbs.gfycat.com/ConventionalOblongFairybluebird-small.gif' style='width:5%'/>
</div>
<br>
<table id="table1" class="blueTable" style='width: 100%'>
  <thead>
  <tr>
  <th>SKU</th>
	<th>Item Type</th>
	<th>FOA + WMS Sellable Inventory</th>
  <th>Total Sellable Inventory</th>
  <th>FOA Sellable Inventory</th>
  <th>WMS Sellable Inventory</th>
  <th>CG Sellable Inventory</th>
  <th>SOFS Sellable Inventory</th>
  <th>GA Sellable Inventory</th>
  <th>TX Sellable Inventory</th>
  <th>NJ Sellable Inventory</th>
	<th>Yard Qty</th>
  <th>OnWater Qty</th>
  <th>On PO Qty</th>
  <th>ETA</th>
  <th>Cartons</th>
  </tr>
  </thead>
	<tbody id='table1Body'>
		<!--AJAX insert table 1 here-->
	</tbody>
</table>
<br>
<hr class='style-one'>
<!--****************************************************************************************************************-->
<!--Compenent Table-->
<!--****************************************************************************************************************-->
<p class="sectionTitle" id='componentTitle'><b><img src='component.png' style='width:5%'> Component Table </b></p>
<div class='tableloading' id="table2loading">
		<img src='https://thumbs.gfycat.com/ConventionalOblongFairybluebird-small.gif' style='width:5%'/>
</div>
<br>
<table id="table2" class="greenTable" style='width: 100%'>
	<thead>
  <tr>
  <th>SKU</th>
	<th>Item Type</th>
	<th>FOA + WMS Sellable Inventory</th>
  <th>Total Sellable Inventory</th>
  <th>FOA Sellable Inventory</th>
  <th>WMS Sellable Inventory</th>
  <th>CG Sellable Inventory</th>
  <th>SOFS Sellable Inventory</th>
  <th>GA Sellable Inventory</th>
  <th>TX Sellable Inventory</th>
  <th>NJ Sellable Inventory</th>
	<th>Yard Qty</th>
  <th>OnWater Qty</th>
  <th>On PO Qty</th>
  <th>ETA</th>
  <th>Cartons</th>
  </tr>
  </thead>
  <tbody id='table2Body'>
		<!--AJAX insert table 2 here-->
  </tbody>
</table>
<br>
<hr class='style-one'>
<!--****************************************************************************************************************-->
<!--FOA/WMS Table-->
<!--****************************************************************************************************************-->
<p class="sectionTitle" id='FOATitle'><b><img src='Boxes.png' style='width:3%'> FOA/WMS Table </b></p>
<div class='tableloading' id="table3loading">
		<img src='https://thumbs.gfycat.com/ConventionalOblongFairybluebird-small.gif' style='width:5%'/>
</div>
<br>
<table id="table3" class="redTable" style='width: 100%'>
  <thead>
  <tr>
  <th>ItemCode</th>
  <th>FOAItemCode</th>
  <th>ItemStatus</th>
  <th>ETA</th>
  <th>Length</th>
  <th>Width</th>
  <th>Height</th>
  <th>Weight</th>
  <th>Volume</th>
  </tr>
  </thead>
  <tbody id='table3Body'>
		<!--AJAX insert table 3 here-->
  </tbody>
</table>
<br>
<br>
</div>
</body>
<script type="text/javascript" src="https://cdn.datatables.net/1.10.19/js/jquery.dataTables.min.js"></script>
</html>
<?php
closehtml();
?>
