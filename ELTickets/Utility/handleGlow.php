<?php
$servername = "xxx";
$username = "xxx";
$password = "xxx";
$dbname = "xxx";
header('Content-Type: application/json');
// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

//set survey glow to 1
if($_REQUEST['action'] == 'surveyNeedsGlow'){
  $sql = "SELECT * FROM glow WHERE user = '".$_REQUEST['user']."'";
  $results = mysqli_query($conn, $sql);
  if($results){
    if(mysqli_num_rows($results) == 0){
      $sql2 = "INSERT INTO glow (user, surveyGlow) VALUES ('".$_REQUEST['user']."', 1)";
      mysqli_query($conn, $sql2);
    }
    else{
      $sql2 = "UPDATE glow SET surveyGlow = 1 WHERE user = '".$_REQUEST['user']."'";
      mysqli_query($conn, $sql2);
    }
  }
}

//check if survey button needs to glow
else if ($_REQUEST['action'] == 'checkSurvey'){
  $sql = "SELECT surveyGlow FROM glow WHERE user = '".$_REQUEST['user']."'";
  $results = mysqli_query($conn, $sql);
  if($results){
    if(mysqli_num_rows($results) == 0){
      echo 'false';
    }
    else{
      foreach($results as $row)
        if($row['surveyGlow'] == 1){
          echo 'true';
          break;
        }
      //echo 'false';
    }
  }
}
else if($_REQUEST['action'] == 'ticketNewGlow'){
  $sql = "SELECT * FROM glow WHERE user = '".$_REQUEST['user']."'";
  $results = mysqli_query($conn, $sql);
  if($results){
    if(mysqli_num_rows($results) == 0){
      $sql2 = "INSERT INTO glow (user, openGlow, taskGlow, closeGlow) VALUES ('".$_REQUEST['user']."', 1, 1, 1)";
      mysqli_query($conn, $sql2);
    }
    else{
      $sql2 = "UPDATE glow SET openGlow = 1, taskGlow = 1, closeGlow = 1 WHERE user = '".$_REQUEST['user']."'";
      mysqli_query($conn, $sql2);
    }
  }
}
else if($_REQUEST['action'] == 'ticketUpdateGlow'){
  $sql = "SELECT * FROM glow WHERE user = '".$_REQUEST['user']."'";
  $results = mysqli_query($conn, $sql);
  if($results){
    if(mysqli_num_rows($results) == 0){
      $sql2 = "INSERT INTO glow (user, openGlow, ".$_REQUEST['tab'].", closeGlow) VALUES ('".$_REQUEST['user']."', 2, 2, 2)";
      mysqli_query($conn, $sql2);
    }
    else{
      $sql2 = "UPDATE glow SET openGlow = 2, ".$_REQUEST['tab']." = 2, closeGlow = 2 WHERE user = '".$_REQUEST['user']."'";
      mysqli_query($conn, $sql2);
    }
  }
}
else if($_REQUEST['action'] == 'ticketTransferGlow'){
  $sql = "SELECT * FROM glow WHERE user = '".$_REQUEST['user']."'";
  $results = mysqli_query($conn, $sql);
  if($results){
    if(mysqli_num_rows($results) == 0){
      $sql2 = "INSERT INTO glow (user, openGlow, taskGlow, closeGlow) VALUES ('".$_REQUEST['user']."', 3, 3, 3)";
      mysqli_query($conn, $sql2);
    }
    else{
      $sql2 = "UPDATE glow SET openGlow = 3, taskGlow = 3, closeGlow = 3 WHERE user = '".$_REQUEST['user']."'";
      mysqli_query($conn, $sql2);
    }
  }
}
else if($_REQUEST['action'] == 'ticketRemoveGlows'){
  $sql = "SELECT * FROM glow WHERE user = '".$_REQUEST['user']."'";
  //$sql = "SELECT * FROM glow WHERE user = 'Zenela Zhang'";
  $results = mysqli_query($conn, $sql);
  if($results){
    if(mysqli_num_rows($results) != 0){
      $body = "";
      $places = explode(",", $_REQUEST['places']);
      foreach($places as $row){
        $body.= $row;
        $body.= " = 0, ";
      }
      $body = substr($body, 0, -2);
      //$sql2 = "UPDATE glow SET ticketNewGlow = 0, taskUpdateGlow = 0, ticketTrandferGlow = 0 WHERE user = '".$_REQUEST['user']."'";
      $sql2 = "UPDATE glow SET ".$body." WHERE user = '".$_REQUEST['user']."'";
      mysqli_query($conn, $sql2);
    }
  }
}
else if($_REQUEST['action'] = 'checkTicket'){
  $sql = "SELECT * FROM glow WHERE user = '".$_REQUEST['user']."'";
  //$sql = "SELECT * FROM glow WHERE user = 'Zenela Zhang'";
  $results = mysqli_query($conn, $sql);
  $response = array('openGlow' => 0, 'taskGlow' => 0, 'submittedGlow' => 0, 'closeGlow' => 0, 'historyGlow' => 0);
  if($results){
    if(mysqli_num_rows($results) == 0){
      echo json_encode($response);
    }
    else{
      foreach($results as $row){
        $response['openGlow'] = $row['openGlow'];
        $response['taskGlow'] = $row['taskGlow'];
        $response['submittedGlow'] = $row['submittedGlow'];
        $response['closeGlow'] = $row['closeGlow'];
        $response['historyGlow'] = $row['historyGlow'];
      }
      echo json_encode($response);
    }
  }
}
?>
