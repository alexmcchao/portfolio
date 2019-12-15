<?php
$myServer = "xxx";
$myUser = "xxx";
$myPass = "xxx";
$myDB = "xxx";

//Establishes the connection
$conn = new PDO("mysql:host=$myServer;dbname=$myDB", $myUser, $myPass);

//set the PDO error mod to exception
$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

if($_REQUEST['action'] == 'getTagPeople'){
  $sql = "SELECT FullName, department FROM login ORDER BY department, FullName";
  $results = $conn->query($sql);

  $nameArray = array("Accounting" => "<optgroup label='Accounting'>",
                     "Customer Service" => "<optgroup label='Customer Service'>",
                     "Everything" => "<optgroup label='Everything'>",
                     "HR" => "<optgroup label='HR'>",
                     "IT" => "<optgroup label='IT'>",
                     "Operations" => "<optgroup label='Operations'>",
                     "Order Processing" => "<optgroup label='Order Processing'>",
                     "Purchasing" => "<optgroup label='Purchasing'>",
                     "Sales" => "<optgroup label='Sales'>"
                    );
  $keys = array_keys($nameArray);
  foreach($results as $row){
    if(in_array($row['department'], $keys))
      $nameArray[$row['department']] = $nameArray[$row['department']]."<option value='".$row['FullName']."'>".$row['FullName']."</option>";
  }
  //print_r($nameArray);

  $output = "<select class='form-control' id='tag'><option disabled selected>Please select a name</option>";
  foreach($nameArray as $key => $value){
    $output = $output.$value."</optgroup>";
  }
  $output."</select>";
  echo $output;
}

if($_REQUEST['action'] == 'getTransferPeople'){
  $sql = "SELECT FullName, department FROM login ORDER BY department, FullName";
  $results = $conn->query($sql);

  $nameArray = array("Accounting" => "<optgroup label='Accounting'>",
                     "Customer Service" => "<optgroup label='Customer Service'>",
                     "Everything" => "<optgroup label='Everything'>",
                     "HR" => "<optgroup label='HR'>",
                     "IT" => "<optgroup label='IT'>",
                     "Operations" => "<optgroup label='Operations'>",
                     "Order Processing" => "<optgroup label='Order Processing'>",
                     "Purchasing" => "<optgroup label='Purchasing'>",
                     "Sales" => "<optgroup label='Sales'>"
                    );
  $keys = array_keys($nameArray);
  foreach($results as $row){
    if(in_array($row['department'], $keys))
      $nameArray[$row['department']] = $nameArray[$row['department']]."<option value='".$row['FullName']."'>".$row['FullName']."</option>";
  }
  //print_r($nameArray);

  $output = "<select class='form-control' id='transferTag'><option disabled selected>Please select a name</option>";
  foreach($nameArray as $key => $value){
    $output = $output.$value."</optgroup>";
  }
  $output."</select>";
  echo $output;
}

$conn = null;
?>
