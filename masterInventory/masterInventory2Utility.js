function populateTable1(searchSKU){
  $('#table1').fadeOut(500);
  setTimeout(function(){
    $('#table1loading').fadeIn();
    $.ajax({
      data: {action: 'getTable1', searchSKU: searchSKU},
      url: 'masterInventory2Controller.php',
      success: function (response) {
        $('#table1loading').fadeOut();
        $('#table1Body').html(response);
        setTimeout(function(){
          $('#table1').fadeIn("slow");
        }, 700);
      }
    });
  }, 500);
}
function populateTable2(searchSKU){
  $('#table2').fadeOut(500);
  setTimeout(function(){
    $('#table2loading').fadeIn();
    $.ajax({
      data: {action: 'getTable2', searchSKU: searchSKU},
      url: 'masterInventory2Controller.php',
      success: function (response) {
        $('#table2loading').fadeOut();
        $('#table2Body').html(response);
        setTimeout(function(){
          $('#table2').fadeIn("slow");
        }, 700);
      }
    });
  }, 500);
}
function populateTable3(searchSKU){
  $('#table3').fadeOut(500);
  setTimeout(function(){
    $('#table3loading').fadeIn();
    $.ajax({
      data: {action: 'getTable3', searchSKU: searchSKU},
      url: 'masterInventory2Controller.php',
      success: function (response) {
        $('#table3loading').fadeOut();
        $('#table3Body').html(response);
        setTimeout(function(){
          $('#table3').fadeIn("slow");
        }, 700);
      }
    });
  }, 500);
}
function generateTable1(){

  $("#table1").dataTable({
    "processing": true,
    "serverSide": true,
    "ajax":{
      url: "masterInventory2_server_processing.php"
    },
    "initComplete":function(settings, json) {
      $('#cover').hide();
    }
  });
}
$(function(){
  //"SELECT [ItemSKU],[mininv],[inv],[foainv],[wmsinv],[yard_qty],[owtqty],[poqty],[bookqty],[mineta],[itemtype],[gaqty],[cgqty],[sofsqty],[njqty],[txqty] FROM [ITWeb].[dbo].[View_ALL_INV]"
  $('#table1loading').hide();
  $('#table2loading').hide();
  $('#table3loading').hide();
  $('#cover').hide();
  //generateTable1()
  $('#searchSKU').keypress(function(e){
    var key = e.which;
    if(key == 13){
      $('#Search').click();
      return false;
    }
  });

  $('#Search').click(function(){
    var searchSKU = $('#searchSKU').val();
    if (searchSKU == ""){
      alert("Search SKU is empty!");
    }
    else{
      populateTable1(searchSKU);
      populateTable2(searchSKU);
      populateTable3(searchSKU);
    }
  });
  $('#download').click(function(){
    $('#cover').show();
    window.open('exportFor_masterInventory2.php');
    $('#cover').hide();
  });
});
