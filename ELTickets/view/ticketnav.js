
//*************** On click EL Tasks Quick button display main panel *************/
$(document).on('click', '#openElTasks', function(e) {
    e.stopImmediatePropagation();
    // Inject created HTML content
    // Display Modal
    console.log('clicked');
    $("#eltasks").modal({backdrop: 'true'});
    $("#tasktab").click();
    //alert('test');
});

/****************** When clicking out of Modal, empty all content generated on ajax calls ***************/
    $(document).on('hide.bs.modal', 'ticketModel',function() {
        var fullName = document.getElementById('fullname_socket').value;
        // your function...
        //$("#CreateTask").reset();
        $("#Log2").empty();
        $("#ViewTasks2").empty();
        $("#Submitted2").empty();
        $("#drillInTaskView").empty();
        //set glows in mysql database to 0
        $.get(
          'ELTickets/Utility/handleGlow.php',{
          action: 'ticketRemoveGlows',
          user: fullName,
          places: "openGlow"
        });
        $("#openElTasks").removeClass('glowing glowing2 glowing3');

    });

/****************** On click task tab display active tasks ******************/
$(document).on('click', '#tasktab', function() {
    //GET USER ID
    var fullName = document.getElementById('fullname_socket').value;
    //alert(fullName);
    var user = {
        id: fullName,
        where: 'tag',
        status: 'status <> \'Complete\'',
        loadType: 'newLoad'
    };
    // AJAX GET TASKS
    $.ajax({
        type: "POST",
        data: user,
        dataType: 'text',
        url: 'http://xxx:3000/tasks',
        success: function (response) {
            // Inject created HTML content
            //alert(response);
            $("#ViewTasks2").html(response);
            //console.log(response);
            // Display Modal
        }
    })
    //Display List of Tasks and hide non task views
    $("#CreateTask").hide();
    $("#Log").hide();
    $("#Submitted").hide();
    $("#drillInTaskView").empty();
    $("#ViewTasks").show();
    //set glows in mysql database to 0
    $.get(
      'ELTickets/Utility/handleGlow.php',{
      action: 'ticketRemoveGlows',
      user: fullName,
      places: "openGlow,taskGlow,closeGlow"
    });
    $('#openElTasks').removeClass('glowing glowing2 glowing3');
    $('#closeElTasks').removeClass('glowing glowing2 glowing3');
    $('#tasktab').removeClass('glowing glowing2 glowing3');

});

/****************** On click task tab display submitted tasks ******************/
$(document).on('click', '#submittedtab', function() {
    //GET USER ID
    var fullName = document.getElementById('fullname_socket').value;
    //alert(fullName);
    var user = {
        id: fullName,
        where: 'requester',
        status: 'status <> \'Complete\'',
        loadType: 'refresh'
    };
    // AJAX GET TASKS
    $.ajax({
        type: "POST",
        data: user,
        dataType: 'text',
        url: 'http://xxx:3000/tasks',
        success: function (response) {
            // Inject created HTML content
            //alert(response);
            $("#Submitted2").html(response);
            //console.log(response);
            // Display Modal
        }
    })
    //Display List of Tasks and hide non task views
    $("#CreateTask").hide();
    $("#Log").hide();
    $("#ViewTasks").hide();
    $("#drillInTaskView").empty();
    $("#Submitted").show();

    //set glows in mysql database to 0
    $.get(
      'ELTickets/Utility/handleGlow.php',{
      action: 'ticketRemoveGlows',
      user: fullName,
      places: "openGlow,submittedGlow,closeGlow"
    });
    $('#openElTasks').removeClass('glowing glowing2 glowing3');
    $('#closeElTasks').removeClass('glowing glowing2 glowing3');
    $('#submittedtab').removeClass('glowing glowing2 glowing3');

});

/****************** On click logs tab display History tasks ******************/
$(document).on('click', '#logstab', function() {
    //GET USER ID
    var fullName = document.getElementById('fullname_socket').value;
    //alert(fullName);
    var user = {
        id: fullName,
        //where: 'tag',
        where: 'history',
        status: 'status = \'Complete\'',
        loadType: 'history'
    };
    // AJAX GET TASKS
    $.ajax({
        type: "POST",
        data: user,
        dataType: 'text',
        url: 'http://xxx:3000/tasks',
        success: function (response) {
            // Inject created HTML content
            //alert(response);
            $("#Log2").html(response);
            //console.log(response);
            // Display Modal
        }
    })
    //Display List of Tasks and hide non task views
    $("#CreateTask").hide();
    $("#ViewTasks").hide();
    $("#drillInTaskView").empty();
    $("#Submitted").hide();
    $("#Log").show();

    //set glows in mysql database to 0
    $.get(
      'ELTickets/Utility/handleGlow.php',{
      action: 'ticketRemoveGlows',
      user: fullName,
      places: "openGlow,historyGlow,closeGlow"
    });
    $('#openElTasks').removeClass('glowing glowing2 glowing3');
    $('#closeElTasks').removeClass('glowing glowing2 glowing3');
    $('#logstab').removeClass('glowing glowing2 glowing3');

});

/**********Listen for SEARCH input that returns dynamic results******/
$(document).on('input', '.searchBar', function(event) {

   var searchOrigin = event.target.id;
   var fullName = document.getElementById('fullname_socket').value;
   var input = document.getElementById(searchOrigin).value;
   var responseId = '';
    // get search value
    if (searchOrigin == "searchValueTasks") {
        responseId = 'ViewTasks2';
        typeTask = 'tag';
        status = 'status <> \'Complete\'';
    } else if (searchOrigin == "searchValueSubmitted") {
        responseId = 'Submitted2';
        typeTask = 'requester';
        status = 'status <> \'Complete\'';
    } else if (searchOrigin == "searchValueHistory") {
        responseId = 'Log2';
        typeTask = 'history';
        status = 'status = \'Complete\''
    }

   // Create Search Object that is passed to nodejs api /tasksearch End Point for querying
   var search = {
       searchValue: input,
       taskType: typeTask,
       searcher: fullName,
       status: status
   };
   // user object to pass to nodejs api /tasks End Point if input is empty
    var user = {
        id: fullName,
        where: typeTask,
        status: status
    };
   console.log('Searching for...' + input + ' from ' + searchOrigin);
     // AJAX GET TASKS if input is not empty
     if (input) {
        searchValue(search, 'tasksearch', responseId);
         //console.log('input changed. Not Empty');
     } else {
         searchValue(user, 'tasks', responseId);
     }

});

/*********** Search Function ****************/
//Input is value of the input
//searchType: return Default no input data or return input results
function searchValue(search, searchType, responseId) {

    $.ajax({
        type: "POST",
        data: search,
        dataType: 'text',
        url: 'http://xxx:3000/' + searchType,
        success: function (response) {
            // Inject created HTML content
            //alert(response);
            $("#"+responseId).html(response);
            console.log(responseId);
            // Display Modal
        }
    })

}
/*******************************************************************/

/**************** On Click display create task tab ***************/
$(document).on('click', '#createtasktab', function() {
    // Display Create Tasks tab
    $("#ViewTasks").hide();
    $("#Log").hide();
    $("#drillInTaskView").hide();
    $("#Submitted").hide();
    $("#CreateTask").show();
    //$("Create").load();
});

/************* On Click display Log Details tab **************/
$(document).on('click', '#logstab', function() {
    // ('#click'')
    $("#ViewTasks").hide();
    $("#CreateTask").hide();
    $("#Submitted").hide();
    $("#Log").show();
});

/****************** Back button to Tasks list view *****************/
function backToTask() {
    $("#tasktab").click();
    $("#drillInTaskView").empty();
}

/************** On click task Drill into task Details/management ***************/
function drillTask(taskId, loadType) {
    // ('#click'')
    $("#ViewTasks").hide();
    $("#CreateTask").hide();
    $("#Submitted").hide();
    $("#Log").hide();
    $("#drillInTaskView").empty();
    //alert(taskId);
    //GET TASK Details for drill in View
    var task = {
        id: taskId,
        loadType: loadType,
        currentUser: $('#fullname_socket').val()
    };
    $.ajax({
        type: "POST",
        data: task,
        dataType: 'text',
        url: 'http://xxx:3000/drillTasks',
        success: function (response) {
            // Inject created HTML content
            //alert(response);
            $("#drillInTaskView").html(response);
            $("#drillInTaskView").show();
            $('#' +taskId).removeClass('glowing glowing2');
            //console.log(response);
            // Display Modal
        }
    })

}
/*
html: '<select id="mySelect">' +
      '<option value = "Samuel Chen">Samuel Chen</option>' +
      '<option value = "Chris Lee">Chris Lee</option>' +
      '<option value = "Vincent Deng">Vincent Deng</option>' +
      '<option value = "Alex Chao">Alex Chao</option>' +
      '<option value = "Zenela Zhang">Zenela Zhang</option>' +
      '</select>',*/
/************** On Transfer Task Function ***************/
function transferTask(taskId, transferer) {
  (async function getFormValues(){
    var transferTo = "";
    var lastUpdatedBy = document.getElementById('fullname_socket').value;
    var tasker = document.getElementById('tasker').value;
    var response = document.getElementById('response').value;
    const {value: taskee} = await Swal.fire({
      title: 'Select an individual to transfer task to:',
      //title: transferDropDown,
      html: transferDropDown,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        var dateTime = new Date();
        transferTo = $('#transferTag').val();
        dateTime = dateTime.getFullYear() + '-' +
          ('00' + (dateTime.getMonth()+1)).slice(-2) + '-' +
          ('00' + dateTime.getDate()).slice(-2) + ' ' +
          ('00' + dateTime.getHours()).slice(-2) + ':' +
          ('00' + dateTime.getMinutes()).slice(-2) + ':' +
          ('00' + dateTime.getSeconds()).slice(-2);
        //GET TASK Details for drill in View
        var transfer = {
          id: taskId,
          tag: transferTo,
          requester: tasker,
          LastUpdatedBy: lastUpdatedBy,
          LastUpdated: dateTime,
          response: 'Task transferred to: ' + transferTo + ' by ' + lastUpdatedBy + ": \n" + response,
          justGotTransferred: 1,
          socket: '3'
        };
        $.ajax({
          type: "POST",
          data: transfer,
          dataType: 'text',
          url: 'http://xxx:3000/transferticket',
          success: function (response) {
              // Inject created HTML content
              //alert(response);
              resolve();
              $("#tasktab").click();
              //console.log(response);
              // Display Modal
          }
        })
      }
    })
    if (taskee) {
        Swal.fire('Task Transferred to ' + transferTo)
    }
  })();
}


/************** On Transfer Task Function ***************/
/*
function transferTask(taskId, transferer) {
    (async function getFormValues() {
        const {value: taskee} = await Swal.fire({
            title: 'Select an individual to transfer task to:',
            input: 'select',
            inputOptions: {
                'Kevin Chen': 'Kevin Chen',
                'Samuel Chen': 'Samuel Chen',
                'Chris Lee': 'Chris Lee',
                'Vincent Deng': 'Vincent Deng',
                'Alex Chao': 'Alex Chao',
                'Zenela Zhang': 'Zenela Zhang'
            },
            inputPlaceholder: 'Select a Person',
            showCancelButton: true,
            inputValidator: (value) => {
                return new Promise((resolve) => {
                    var dateTime = new Date();
                    dateTime = dateTime.getFullYear() + '-' +
                        ('00' + (dateTime.getMonth()+1)).slice(-2) + '-' +
                        ('00' + dateTime.getDate()).slice(-2) + ' ' +
                        ('00' + dateTime.getHours()).slice(-2) + ':' +
                        ('00' + dateTime.getMinutes()).slice(-2) + ':' +
                        ('00' + dateTime.getSeconds()).slice(-2);
                    //GET TASK Details for drill in View
                    var transfer = {
                        id: taskId,
                        tag: value,
                        LastUpdatedBy: transferer,
                        LastUpdated: dateTime,
                        response: 'Task transferred to: ' + value + ' by ' + transferer,
                        socket: '3'
                    };

                    $.ajax({
                        type: "POST",
                        data: transfer,
                        dataType: 'text',
                        url: 'http://xxx:3000/updateticket',
                        success: function (response) {
                            // Inject created HTML content
                            //alert(response);
                            resolve();
                            $("#tasktab").click();
                            //console.log(response);
                            // Display Modal
                        }
                    })
                })
            }
        })

        if (taskee) {
            Swal.fire('Task Transferred to ' + taskee)
        }
    })();

}
*/
/**************Populate the tag dropdown*************/
function populateTagDropdown(){
  $.ajax({
    data: {action: 'getTagPeople'},
    url: '/ELTickets/Utility/utilityFunctions.php',
    success: function (response) {
      $('#helpers').html(response);
    }
  })
}

/**************Populate the transfer dropdown*************/
function populateTransferDropdown(){
  $.ajax({
    data: {action: 'getTransferPeople'},
    url: '/ELTickets/Utility/utilityFunctions.php',
    success: function (response) {
      transferDropDown = response;
    }
  });
}
/**************Function handler for Updating TASKS*************/
var transferDropDown; // will be used in transfer button
$(function () {
    populateTagDropdown();
    populateTransferDropdown();
    var update = false;
    $(document).on('input change', '#updateTaskForm :input', function(){
        update = true;
        //alert('Input Value Changed');
    });
    // Ajax Call sending updates to Node service to consume

    // function for updating task
    $(document).on('click', '#updateTask', function(e) {
        e.stopImmediatePropagation();
        var id = document.getElementById('taskId').value;
        var status = document.getElementById('status').value;
        var description = document.getElementById('description').value;
        var response = document.getElementById('response').value;
        var tasker = document.getElementById('tasker').value;
        var tag = document.getElementById('ticketTag').value;
        var lastUpdatedBy = document.getElementById('fullname_socket').value;
        //alert("tasker: " + tasker + "; last updated by: " + lastUpdatedBy + "; tag: " + tag);
        var dateTime = new Date();
        dateTime = dateTime.getFullYear() + '-' +
            ('00' + (dateTime.getMonth()+1)).slice(-2) + '-' +
            ('00' + dateTime.getDate()).slice(-2) + ' ' +
            ('00' + dateTime.getHours()).slice(-2) + ':' +
            ('00' + dateTime.getMinutes()).slice(-2) + ':' +
            ('00' + dateTime.getSeconds()).slice(-2);
        var ticketUpdates = {
            id: id,
            Status: status,
            description: description,
            response: response,
            requester: tasker,
            tag: tag,
            LastUpdatedBy: lastUpdatedBy,
            LastUpdated: dateTime,
            justGotTransferred: 0,
            transferRequesterClick: 0,
            socket: '2',
        }
        //console.log(ticketUpdates);
        if (update) {
            // SEND AJAX POST with ticket update Details TO NODE SERVER
            $.ajax({
                type: "POST",
                data: ticketUpdates,
                dataType: 'text',
                url: 'http://xxx:3000/updateticket',
                success: function (response) {
                    // Replace drill in task view with updated View
                    drillTask(id, 'Refresh');
                    //RESET UPDATE FLAG
                    update = false;
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    alert(errorThrown);
                }
            })

        } else {
            console.log('still false');
        }
    });

})

/*********************** Create new Tasks on Click **************************/
$(document).on('click', '#submitTask', function(e) {
    e.stopImmediatePropagation();
    var tasker = document.getElementById('fullname_socket').value;
    var category = document.getElementById('category').value;
    var customer = document.getElementById('customer').value;
    var desc = document.getElementById('comment').value;
    var tag = document.getElementById('tag').value;
    var subject = document.getElementById('subject').value;
    var lastUpdatedBy = tasker;
    var dateCreate = new Date();
    var status = 'New';
    dateCreate = dateCreate.getFullYear() + '-' +
        ('00' + (dateCreate.getMonth()+1)).slice(-2) + '-' +
        ('00' + dateCreate.getDate()).slice(-2) + ' ' +
        ('00' + dateCreate.getHours()).slice(-2) + ':' +
        ('00' + dateCreate.getMinutes()).slice(-2) + ':' +
        ('00' + dateCreate.getSeconds()).slice(-2);
    var ticket = {
        type: category,
        description: desc,
        requester: tasker,
        LastUpdatedBy: lastUpdatedBy,
        subtype: customer,
        subject: subject,
        tag: tag,
        DateCreate: dateCreate,
        Status: status,
        socket: '1',
        response: ''
    };
    //AJAX Send Task Creation request to NODEjs server
    $.ajax({
        type: "POST",
        data: ticket,
        dataType: 'json',
        url: 'http://xxx:3000/createticket',
        success: function (response) {
            // Inject created HTML content
            //alert(response.insertId);
            $("#ticketresponse").html('<p>Ticket# ' + response.insertId + ' Has been Created for your Request</p>');
            // Display Modal
        }
    })
});
/*********************** Open Attachments Panel on Click **********************************/
$(document).on('click', '#attachmentsButton', function() {
        $(this).addClass('selected');
        $('.pop').slideFadeToggle();

    //Make call to nodejs server to retrieve attachments
    var id = document.getElementById('taskId').value;
    //AJAX send request for attachments to NODEjs server
    $.ajax({
        type: "POST",
        data: {id:id},
        dataType: 'text',
        url: 'http://xxx:3000/getattachments',
        success: function (response) {
            $("#taskattachments").html(response);// Inject created HTML content
            console.log(response);
            //alert(response);
            // Display Modal
        }
    })
    //alert('test');
});

/*********************** On Click Upload File Button **********************************/
$(document).on('click', '#uploadFile', function() {
   // Get file from file input
    var file = $('#importFile').get(0).files;
    $.ajax({
        type: "POST",
        data: {id:id},
        dataType: 'text',
        url: 'http://xxx:3000/uploadattachments',
        success: function (response) {
            $("#taskattachments").html(response);// Inject created HTML content
            console.log(response);
            //alert(response);
            // Display Modal
        }
    })
});

$(document).on('click', '.close', function() {
    $('#attachmentsButton').removeClass('selected');
    $('.pop').slideFadeToggle();
    return false;
});



$.fn.slideFadeToggle = function(easing, callback) {
    return this.animate({ opacity: 'toggle', height: 'toggle' }, 'fast', easing, callback);
};

/************************* on mouse hover on Subject and display a message box *********************/
/*
$(document).on('mouseover', 'h5', function(e) {
    console.log($(e.target).html());
    $(e.target).closet('marquee').css({display: 'block'});
    $(e.target).css({display: 'none'});
});*/
/*********************** Upload file attachments to NodeJS server **************************/
