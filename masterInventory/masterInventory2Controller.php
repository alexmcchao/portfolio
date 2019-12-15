<?php
$myServer = "xxx";
$myUser = "xxx";
$myPass = "xxx";
$myDB = "xxx";

$connectionInfo = array("Database"=>$myDB, "UID"=>$myUser, "PWD"=>$myPass, "ReturnDatesAsStrings"=> true);
$conn = sqlsrv_connect($myServer, $connectionInfo);

//check if negative and return zero, otherwise return the orginial number
function giveZero($i){
  if($i < 0)
    return 0;
  else
    return $i;
}
/*
if($_REQUEST['action'] == 'getAllTable1'){
  $table = "";
  $sql ="SELECT *
  FROM xxx";
  $stmt = sqlsrv_query($conn, $sql);
  while($row = sqlsrv_fetch_array( $stmt, SQLSRV_FETCH_ASSOC) ) {
    $table.=
    " <tr>
      <td>".$row['ItemSKU']."</td>
      <td>".$row['newItemType']."</td>
      <td>".$row['foawmsinv']."</td>
      <td>".$row['totalinv']."</td>
      <td>".$row['foainv']."</td>
      <td>".$row['wmsinv']."</td>
      <td>".$row['cgqty']."</td>
      <td>".$row['sofsqty']."</td>
      <td>".$row['gaqty']."</td>
      <td>".$row['txqty']."</td>
      <td>".$row['njqty']."</td>
      <td>".$row['yard_qty']."</td>
      <td>".$row['owtqty']."</td>
      <td>".$row['poqty']."</td>
      <td>".$row['neweta']."</td>
      <td>".$row['Carton']."</td>
      </tr> ";
  }
  sqlsrv_free_stmt($stmt);
  echo $table;
}
*/
if($_REQUEST['action'] == 'getTable1'){
  $table = "";
  $searchSKU = strtoupper($_REQUEST['searchSKU']);
  $sql ="SET NOCOUNT ON SELECT *
  FROM xxx WHERE [newItemType] = 'Kit'";
  if($searchSKU != ''){
    $stmt = sqlsrv_query($conn, $sql);
    while($row = sqlsrv_fetch_array( $stmt, SQLSRV_FETCH_ASSOC) ) {
      if(strpos($row['ItemSKU'], $searchSKU) !== false || strpos($row['ItemSKU'], $searchSKU) === 0){
        $table.=
        " <tr>
          <td>".$row['ItemSKU']."</td>
          <td>".$row['newItemType']."</td>
          <td>".$row['foawmsinv']."</td>
          <td>".$row['totalinv']."</td>
          <td>".$row['foainv']."</td>
          <td>".$row['wmsinv']."</td>
          <td>".$row['cgqty']."</td>
          <td>".$row['sofsqty']."</td>
          <td>".$row['gaqty']."</td>
          <td>".$row['txqty']."</td>
          <td>".$row['njqty']."</td>
          <td>".$row['yard_qty']."</td>
          <td>".$row['owtqty']."</td>
          <td>".$row['poqty']."</td>
          <td>".$row['neweta']."</td>
          <td>".$row['Carton']."</td>
          </tr> ";
      }
    }
    sqlsrv_free_stmt($stmt);
    if($table == ""){
      $table.="<tr><td>no content</td></tr>";
    }
  }
  echo $table;
}

if($_REQUEST['action'] == 'getTable2'){
  $table = "";
  $searchSKU = strtoupper($_REQUEST['searchSKU']);
  $sql1 = "SELECT DISTINCT [ComponentItemCode] FROM xxx";
  $sql1.= "WHERE [SalesKitNo] LIKE '%".$searchSKU."%'";
  if($searchSKU != ''){
    $sku = array();
    $stmt1 = sqlsrv_query($conn, $sql1);
    while($row1 = sqlsrv_fetch_array( $stmt1, SQLSRV_FETCH_ASSOC) ) {
      array_push($sku,$row1['ComponentItemCode']);
    }

    sqlsrv_free_stmt($stmt1);
    $sql2 = "SET NOCOUNT ON SELECT * FROM xxx";
    $stmt2 = sqlsrv_query($conn, $sql2);
    while($row2 = sqlsrv_fetch_array( $stmt2, SQLSRV_FETCH_ASSOC) ) {
      if(!empty($sku)){
        foreach($sku as $mysku){
          if($row2['ItemSKU'] == $mysku){
            $table.=
            " <tr>
              <td>".$row2['ItemSKU']."</td>
              <td>".$row2['newItemType']."</td>
              <td>".$row2['foawmsinv']."</td>
              <td>".$row2['totalinv']."</td>
              <td>".$row2['foainv']."</td>
              <td>".$row2['wmsinv']."</td>
              <td>".$row2['cgqty']."</td>
              <td>".$row2['sofsqty']."</td>
              <td>".$row2['gaqty']."</td>
              <td>".$row2['txqty']."</td>
              <td>".$row2['njqty']."</td>
              <td>".$row2['yard_qty']."</td>
              <td>".$row2['owtqty']."</td>
              <td>".$row2['poqty']."</td>
              <td>".$row2['neweta']."</td>
              <td>".$row2['Carton']."</td>
              </tr> ";
          }
        }
      }
      else{
        if(strpos($row2['ItemSKU'], $searchSKU) !== false || strpos($row2['ItemSKU'], $searchSKU) === 0){
          $table.=
          " <tr>
            <td>".$row2['ItemSKU']."</td>
            <td>".$row2['newItemType']."</td>
            <td>".$row2['foawmsinv']."</td>
            <td>".$row2['totalinv']."</td>
            <td>".$row2['foainv']."</td>
            <td>".$row2['wmsinv']."</td>
            <td>".$row2['cgqty']."</td>
            <td>".$row2['sofsqty']."</td>
            <td>".$row2['gaqty']."</td>
            <td>".$row2['txqty']."</td>
            <td>".$row2['njqty']."</td>
            <td>".$row2['yard_qty']."</td>
            <td>".$row2['owtqty']."</td>
            <td>".$row2['poqty']."</td>
            <td>".$row2['neweta']."</td>
            <td>".$row2['Carton']."</td>
            </tr> ";
        }
      }
    }
    sqlsrv_free_stmt($stmt2);
    if($table == ""){
      $table.="<tr><td>no content</td></tr>";
    }
  }
  echo $table;
}

if($_REQUEST['action'] == 'getTable3'){
  $table = "";
  $searchSKU = strtoupper($_REQUEST['searchSKU']);
  $sql1 = "SELECT DISTINCT [ComponentItemCode] FROM xxx";
  $sql1.= "WHERE [SalesKitNo] LIKE '%".$searchSKU."%'";
  $statusArray = array("D" => "D - Discountinued", "." => "D - Discountinued", ".." => "D - Discountinued", "Dis" => "D - Discontinued", "BB" => "BB - Very Good", "B" => "B - Good", "F" => "F - Monitor, no new PO yet",
                      "C" => "C - Slow", "A" => "A - Hot", "AWP" => "AWP - Ready at factory", "AA" => "AA - TOP SKU", "No record"=> "No record");
  if($searchSKU != ''){
    $stmt1 = sqlsrv_query($conn, $sql1);
    if(sqlsrv_has_rows($stmt1)){
      while($row1 = sqlsrv_fetch_array( $stmt1, SQLSRV_FETCH_ASSOC) ) {
        $sql2 = "SELECT DISTINCT [Column 0], [Column 1] FROM xxx WHERE [Column 1] = '".$row1['ComponentItemCode']."'";
        $stmt2 = sqlsrv_query($conn, $sql2);
        while($row2 = sqlsrv_fetch_array( $stmt2, SQLSRV_FETCH_ASSOC) ) {
          $sql3 = "SELECT [ItemCode],[Discontinue],[ETA],[SLength1],[SWidth1],[SHeight1],[wt],[vol] FROM xxx WHERE [ItemCode] = '".$row2['Column 0']."'";
          $stmt3 = sqlsrv_query($conn, $sql3);
          while($row3 = sqlsrv_fetch_array( $stmt3, SQLSRV_FETCH_ASSOC) ) {
            $status = $row3['Discontinue'];
            if($status == "")
              $status = "No record";
            $ETA = date("Y-m-d", strtotime($row3['ETA']));
            if($ETA == "1970-01-01")
              $ETA = "";
            $table.=
            " <tr>
              <td>".$row2['Column 1']."</td>
              <td>".$row2['Column 0']."</td>
              <td>".$statusArray[$status]."</td>
              <td>".$ETA."</td>
              <td>".substr($row3['SLength1'], 0, -4)."</td>
              <td>".substr($row3['SWidth1'], 0, -4)."</td>
              <td>".substr($row3['SHeight1'], 0, -4)."</td>
              <td>".substr($row3['wt'], 0, -4)."</td>
              <td>".substr($row3['vol'], 0, -4)."</td>
              </tr> ";
          }
          sqlsrv_free_stmt($stmt3);
        }
        sqlsrv_free_stmt($stmt2);
      }
      sqlsrv_free_stmt($stmt1);
    }
    else{
      $sql2 = "SELECT DISTINCT [Column 0], [Column 1] FROM xxx WHERE [Column 1] = '".$searchSKU."'";
      $stmt2 = sqlsrv_query($conn, $sql2);
      while($row2 = sqlsrv_fetch_array( $stmt2, SQLSRV_FETCH_ASSOC) ) {
        $sql3 = "SELECT [ItemCode],[Discontinue],[ETA],[SLength1],[SWidth1],[SHeight1],[wt],[vol] FROM xxx WHERE [ItemCode] = '".$row2['Column 0']."'";
        $stmt3 = sqlsrv_query($conn, $sql3);
        while($row3 = sqlsrv_fetch_array( $stmt3, SQLSRV_FETCH_ASSOC) ) {
          $status = $row3['Discontinue'];
          if($status == "")
            $status = "No record";
          $ETA = date("Y-m-d", strtotime($row3['ETA']));
          if($ETA == "1970-01-01")
            $ETA = "";
          $table.=
          " <tr>
            <td>".$row2['Column 1']."</td>
            <td>".$row2['Column 0']."</td>
            <td>".$statusArray[$status]."</td>
            <td>".$ETA."</td>
            <td>".substr($row3['SLength1'], 0, -4)."</td>
            <td>".substr($row3['SWidth1'], 0, -4)."</td>
            <td>".substr($row3['SHeight1'], 0, -4)."</td>
            <td>".substr($row3['wt'], 0, -4)."</td>
            <td>".substr($row3['vol'], 0, -4)."</td>
            </tr> ";
        }
        sqlsrv_free_stmt($stmt3);
      }
      sqlsrv_free_stmt($stmt2);
    }
    if($table == ""){
      $table.="<tr><td>no content</td></tr>";
    }
  }
  echo $table;
}
?>
