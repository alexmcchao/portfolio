const fs = require('fs')
function addZero(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}
function generateList(result, loadType, id) {
    //declare which loadtype and assign appropriate text
    var tabType = loadType;
    if(loadType == 'newLoad')
      tabType = 'Tasks';
    else if(loadType == 'refresh')
      tabType = 'Submitted';
    else if(loadType == 'history')
      tabType = 'History';
    var taskhtml = '<div style="font-size: 10px;color:#b0b0b0;padding-left: 5px"><p>'+ result.length +' Tasks in result</p></div>';
    taskhtml = taskhtml + "<p style='font-size: 18px;text-align: center'>" + tabType + "</p>";
    taskhtml = taskhtml + "<div style='height: 650px; overflow-y: auto; overflow-x:hidden;'>";
    //responseArray = Array.from(result);
    //responseArray.forEach(function(task){
    //    taskhtml = taskhtml + '<p>' + task['ID'] + " " + task['POnumber'] + " " + task['tag'] + " " + task['description'] + " " + task['type'] + " " + task['requester'] + '</p>';
    //});
    for (var task of result) {
        // Set default glow attribute
        var glow = '';
        if(!(task['transferRequesterClick'] && task['requester'] == id)){
          if(task['LastUpdatedBy'] != id){
            if(task['socket'] == 1) {
                glow = 'glowing';
            }else if (task['socket'] == 2) {
                glow = 'glowing2';
            }else if (task['socket'] == 3) {
                glow = 'glowing3';
            }
          }
        }
        var date = new Date(task['DateCreate']);
        taskhtml = taskhtml +
            '    <div class="row taskRows '+ glow +'" id="' + task['ID'] + '" onclick="drillTask(\'' + task['ID'] + '\', \''+loadType+'\')" style="min-height:180px;margin: 0px;font-size: 12px">\n' +
            '        <div class="col-xs-12 col-sm-12 col-md-12"  style="width:100%;height:100%">\n' +
            '            <div class="well well-sm" style="background-color: transparent; border: 0px;">\n' +
            '                <div class="row">\n' +
            '                    <h5 style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;size:12px;">' + task['subject'] + '</h5>\n' +
            '                    <div class="scroll_text">' +
            '                       <p>Description: '+task['description']+'</p>' +
            '                    </div>' +
            '                </div>\n' +
            '                <div class="row">\n' +
            '                    <!--<div class="col-sm-6 col-md-2">-->\n' +
            '                        <!--<img src="profiles/companybio/'+ task['requester'].replace(/\s/g, '') + '/' + task['requester'].replace(/\s/g, '') + '.JPG" alt="" class="img-rounded img-responsive" style="padding-top:20px" />-->\n' +
            '                    <!--</div>-->\n' +
            '                    <div class="col-sm-6 col-md-6">\n' +
            '                        <p>\n' +
            '                            <i class="glyphicon glyphicon-user"></i>Tasker: ' + task['requester'] +
            '                            <br />\n' +
            '                            <i class="glyphicon glyphicon-question-sign"></i>Type: \n' + task['type'] +
            '                            <br />\n' +
            '                            <i class="glyphicon glyphicon-shopping-cart"></i>Customer: \n' + task['subtype'] +
            '                            <br />\n' +
            '                            <i class="glyphicon glyphicon-file"></i>Tasked To: \n' + task['tag'] +
            '                            <br />\n' +
            '                            <i class="glyphicon glyphicon-knight"></i>TASK ID: \n' + task['ID'] +
            '                        </p>' +
            '                   </div>\n' +
            '                    <div class="col-sm-6 col-md-6">\n' +
            '                        <p>Status: ' + task['Status'] + '</p>' +
            '                        <p>Created: ' + date.getFullYear() + "-" + addZero(date.getMonth()) + "-" + addZero(date.getDate()) + " " + addZero(date.getHours()) + ":" + addZero(date.getMinutes()) + '</p>' +
            '                   </div>\n' +
            '                </div>\n' +
            '            </div>\n' +
            '        </div>\n' +
            '    </div>\n';
    }
    taskhtml = taskhtml + "</div>";
    //response.send(taskhtml);
    //console.log(result);
    return taskhtml;
};

function generateTaskView(result, comments) {

    var taskHtml = '<div class="row" style="height:830px;margin: 0px;font-size: 15px">\n' +
    '        <span onclick="backToTask()" class="glyphicon glyphicon-arrow-left" style="font-size: 20px;padding-left: 15px;padding-bottom: 15px"></span>' +
    '       <div class="messagepop pop">\n' +
    '           <form  id="new_message" action="/messages">\n' +
    '               <p><label for="email">Attachments</label></p>\n' +
    '               <p id="taskattachments"></p>\n' +
    '               <p><input type="file" id="importFile"></p>\n' +
    '               <p><button type="button" id="uploadFile">Upload</button></p>\n' +
    '               <p><a class="close">Cancel</a></p>\n' +
    '           </form>' +
    '       </div>' +
    '                   <!--<button style="float:right;margin-right: 25px"id="attachmentsButton" class="btn btn-default" type="button">Attachments</button>-->' +
    '        <div class="col-xs-12 col-sm-12 col-md-12"  style="width:100%;height:100%;margin-top: 15px">\n' +
    '                <div class="row">\n' +
    '                    <div class="col-sm-6 col-md-2">\n' +
    '                        <img src="profiles/companybio/'+ result[0]['requester'].replace(/\s/g, '') + '/'+ result[0]['requester'].replace(/\s/g, '') + '.JPG" alt="" class="img-rounded img-responsive" style="max-width:60px;height:80px" />\n' +
    '                    </div>\n' +
    '                    <div class="col-sm-6 col-md-8" style="width:80%;margin-left:10px">\n' +
    '                        <h4 style="margin: 0px;white-space:nowrap;width: 300px;overflow:hidden;text-overflow:ellipsis;">Subject: ' + result[0]['subject'] + '</h4>\n' +
    '                        <p>\n' +
    '                            <i class="glyphicon glyphicon-user"></i>Tasker: ' + result[0]['requester'] +
    '                            <br>' +
    '                            <i class="glyphicon glyphicon-question-sign"></i>Type: \n' + result[0]['type'] +
    '                            <br>' +
    '                            <i class="glyphicon glyphicon-shopping-cart"></i>Customer: \n' + result[0]['subtype'] +
    '                            <br>' +
    '                            <i class="glyphicon glyphicon-file"></i>Tasked To: \n' + result[0]['tag'] +
    '                            <br>' +
    '                            <i class="glyphicon glyphicon-knight"></i>TASK ID: \n' + result[0]['ID'] +
    '                        </p>' +
    '                   </div>\n'+
    '                </div><form id="updateTaskForm">\n' +
    '                <input type="hidden" id="ticketTag" value="' + result[0]['tag'] + '">\n ' +
    '                <div style="padding-left: 15px;padding-top: 15px">' +
    '                   <label>Tags: ' + result[0]['POnumber'] + '</label><br>' + '' +
    '                   <label>Status:</label><br>' +
    '                   <input id="taskId" type="hidden" value="' + result[0]['ID'] + '"><input id="tasker" type="hidden" value="' + result[0]['requester'] + '">' +
    '                   <select id="status" class="form-control" style="width:33%">\n' +
    '                            <option selected disabled>' + result[0]['Status'] + '</option>\n' +
    '                            <option value="Complete">Complete</option>\n' +
    '                            <option value="In Progress">In Progress</option>\n' +
    '                            <option value="Cancel">Cancel</option>\n' +
    '                   </select>' +
    '                   <label>Subject:</label>' +
    '                   <input id="taskSubject" class="form-control" style="resize:none;width:90%" placeholder="'+result[0]['subject']+'" readonly>' +
    '                   <label>Description:</label>' +
    '                   <textarea rows="7" id="description" class="form-control" style="resize:none;width:90%" readonly>' + result[0]['description'] + '</textarea>' +
    '                   <label>Response:</label>' +
    '                   <textarea rows="6" id="response" class="form-control" style="resize:none;width:90%"></textarea><br>' +
    '                   <button id="updateTask" class="btn btn-success btn-default" type="button">Update</button>' +
    '                   <button id="'+ result[0]['ID'] +'" onclick="transferTask(this.id, \''+result[0]['tag']+'\')" class="btn btn-warning btn-default" type="button">Transfer</button>' +
    '               </div></form>' +
    '               <div class="row" style="padding-left: 15px;padding-top: 15px"><div style="\n' +
        '    border: 0.1px #eaeaea solid;\n' +
        '    width: 385px;\n' +
        '    height: 150px;\n' +
        '    padding: 10px;\n' +
        '    overflow: auto;\n' +
        '">';

    for (var comment of comments) {
        taskHtml = taskHtml + '<p style="color:#9f79b7;font-size: 12px">' + comment['datecreate'].toLocaleString() + '-' + comment['replyer'] + '</p>' +
            '<p style="font-size: 12px">' + comment['reply'] + '</p>';
    }

   taskHtml = taskHtml + '</div></div>' +
    '        </div>\n' +
    '    </div>\n';

    return taskHtml;
}

/***** Generate HTML for Attachments associated to taskId *****/
function generateAttachments (taskId) {
    // Declare path directory of taskId folder
    var dir = 'taskattachments/' + taskId;
    //Check if directory exists if not create new directory
    /**
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
     **/
    var attachmentsHtml = '';
    // Get all content from directory
    //listing all files using forEach
    try {
        fs.readdirSync(dir).forEach(file => {
            // Do whatever you want to do with the file
            attachmentsHtml = attachmentsHtml + '<a target="_blank" href="http://192.168.168.39:3000/' + taskId + '/' + file + '" download>' + file + '</a><br>';
            console.log(file);
        });
    } catch (e) {
        console.log(e);
    }
    return attachmentsHtml;
    //console.log(attachmentsHtml);
}

// Export the tasklist
module.exports.generateList = generateList;
module.exports.generateTaskView = generateTaskView;
module.exports.generateAttachments = generateAttachments;
