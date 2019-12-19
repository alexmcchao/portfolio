const routes = require('./routes/routes');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const pool = require('./db/config');
let taskDbHandler = require('./view/taskdbhandler');
// Use Node.js body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false,
}));
app.use(express.static('taskattachments'));

var http = require('http').Server(app);
var io = require('socket.io')(http);
routes(app);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

// Insert Ticket + Socket IO Listener and Sender
app.post('/createticket', (request, response) => {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    // HANDLE JSON DATA.BODY
    var ticket = request.body;
    var tag = request.body.tag;
    pool.query('INSERT INTO tickets SET ?', ticket, (error, result) => {
        if (error) {
            console.log(error);
            response.send('Error handling request data');
        } else {
            io.sockets.emit(ticket['tag'], {message: '#' + result.insertId});
            response.send(JSON.stringify(result));
        }
    });

    console.log(ticket);
    //Update Glow
    pool.query('SELECT * FROM glow WHERE user = ?', [tag], (error, result) => {
      if(error) {
        console.log(error);
        response.send('Error handling glow');
      }
      else {
        if(result.length == 0){
          pool.query('INSERT INTO glow (user, openGlow, taskGlow, closeGlow) VALUES (?, 1, 1, 1)', [tag], (error, result) => {
            if(error) {
              console.log(error);
              response.send('Error handling request data');
            }
          });
        }
        else if(result.length > 0){
          pool.query('UPDATE glow SET openGlow = 1, taskGlow = 1, closeGlow = 1 WHERE user = ?', [tag], (error, result) => {
            if(error) {
              console.log(error);
              response.send('Error handling request data');
            }
          });
        }
      }
    });
});

// Update Ticket + Socket IO Listener and Sender to notify ticket creator that their ticket was updated
app.post('/updateticket', (request, response) => {
    console.log(request.body);
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var updatedTicketId = request.body.id;
    var requesterUpdate = request.body.requester + 'update';
    var requesterTransfer = request.body.tag + 'transfer';
    var updateValues = request.body;
    var updater = request.body.tag + 'update';

    var requesterGlow = 'submittedGlow';
    var updaterGlow = 'taskGlow';
    if(request.body.Status == 'Complete'){
      requesterGlow = 'historyGlow';
      updaterGlow = 'historyGlow';
    }
    //Update Ticket Header
    pool.query('Update tickets set ? where ID = ?', [updateValues, updatedTicketId], (error, result) => {
        if (error) {
            console.log(error);
            response.send('Error handling request data');
        } else {
            io.sockets.emit(requesterUpdate, {message: '#' + updatedTicketId, tag: request.body.tag, LastUpdatedBy: request.body.LastUpdatedBy, glow: requesterGlow});
            io.sockets.emit(updater, {message: '#' + updatedTicketId, tag: request.body.tag, LastUpdatedBy: request.body.LastUpdatedBy, glow: updaterGlow});
            response.send('ticket updated');
        }
    })
    //Update Ticket reply details
    if (request.body.response !== "") {

         var updateResponse = {
            replyToID: updatedTicketId,
            reply: request.body.response,
            replyer: request.body.LastUpdatedBy,
            datecreate: request.body.LastUpdated
         }

         pool.query('INSERT into ticketreply set ?', [updateResponse], (error, result) => {
             if (error) {
                 console.log(error);
                 response.send('Error handling request data');
             }
         })
    }
    //Update Glow
    var tab;
    var updateTo;
    //differenciate who to update
    if(request.body.LastUpdatedBy == request.body.requester){
      if(request.body.Status == 'Complete')
        tab = "historyGlow";
      else
        tab = "taskGlow";
      updateTo = request.body.tag;
    }
    else{
      if(request.body.Status == 'Complete')
        tab = "historyGlow";
      else
        tab = "submittedGlow";
      updateTo = request.body.requester;
    }

    pool.query('SELECT * FROM glow WHERE user = ?', [updateTo], (error, result) => {
      if(error) {
        console.log(error);
        response.send('Error handling glow');
      }
      else {
        if(result.length == 0){
          pool.query('INSERT INTO glow (user, openGlow, '+ tab +', closeGlow) VALUES (?, 2, 2, 2)', [updateTo], (error, result) => {
            if(error) {
              console.log(error);
              response.send('Error handling request data');
            }
          });
        }
        else if(result.length > 0){
          pool.query('UPDATE glow SET openGlow = 2, '+ tab +' = 2, closeGlow = 2 WHERE user = ?', [updateTo], (error, result) => {
            if(error) {
              console.log(error);
              response.send('Error handling request data');
            }
          });
        }
      }
    });
    /*
    if (request.body.newTaskee !=="") {
        io.sockets.emit(requesterTransfer, {message: '#' + updatedTicketId});
        console.log(requesterTransfer + '#' + updatedTicketId);
    }*/
});

// Update Ticket + Socket IO Listener and Sender to notify ticket creator that their ticket was updated
app.post('/transferticket', (request, response) => {
    console.log(request.body);
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var updatedTicketId = request.body.id;
    var requesterUpdate = request.body.requester + 'update';
    var transferTo = request.body.tag + 'transfer';
    var updateValues = request.body;
    var updater = request.body.tag + 'update';
    var tag = request.body.tag;

    var requesterGlow = 'submittedGlow';
    var updaterGlow = 'taskGlow';
    if(request.body.Status == 'Complete'){
      requesterGlow = 'historyGlow';
      updaterGlow = 'historyGlow';
    }
    //Update Ticket Header
    pool.query('Update tickets set ? where ID = ?', [updateValues, updatedTicketId], (error, result) => {
        if (error) {
            console.log(error);
            response.send('Error handling request data');
        } else {
            io.sockets.emit(requesterUpdate, {message: '#' + updatedTicketId, tag: request.body.tag, LastUpdatedBy: request.body.LastUpdatedBy, glow: requesterGlow});
            io.sockets.emit(transferTo, {message: '#' + updatedTicketId, tag: request.body.tag, LastUpdatedBy: request.body.LastUpdatedBy});
            response.send('ticket updated');
        }
    })
    //Update Ticket reply details
    if (request.body.response !== "") {

         var updateResponse = {
            replyToID: updatedTicketId,
            reply: request.body.response,
            replyer: request.body.LastUpdatedBy,
            datecreate: request.body.LastUpdated
         }

         pool.query('INSERT into ticketreply set ?', [updateResponse], (error, result) => {
             if (error) {
                 console.log(error);
                 response.send('Error handling request data');
             }
         })
    }

    //Update Glow
    pool.query('SELECT * FROM glow WHERE user = ?', [tag], (error, result) => {
      if(error) {
        console.log(error);
        response.send('Error handling glow');
      }
      else {
        if(result.length == 0){
          pool.query('INSERT INTO glow (user, openGlow, taskGlow, closeGlow) VALUES (?, 3, 3, 3)', [tag], (error, result) => {
            if(error) {
              console.log(error);
              response.send('Error handling request data');
            }
          });
        }
        else if(result.length > 0){
          pool.query('UPDATE glow SET openGlow = 3, taskGlow = 3, closeGlow = 3 WHERE user = ?', [tag], (error, result) => {
            if(error) {
              console.log(error);
              response.send('Error handling request data');
            }
          });
        }
      }
    });
    /*
    if (request.body.newTaskee !=="") {
        io.sockets.emit(requesterTransfer, {message: '#' + updatedTicketId});
        console.log(requesterTransfer + '#' + updatedTicketId);
    }*/
});

// Get all tasks for current user
app.post('/tasks', (request, response) => {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    // Get TASKS
    var id = request.body.id;
    console.log(id);
    var where = request.body.where;
    var status = request.body.status;
    var loadType = request.body.loadType;
    var sql;
    var param;
    if(where == 'history'){
      sql = 'SELECT * FROM tickets WHERE (tag = ? or requester = ? ) and '+status+' order by DateCreate desc';
      param = [id,id];
      console.log(sql);
    }
    else{
      sql = 'SELECT * FROM tickets WHERE '+where+' = ? and '+status+' order by DateCreate desc';
      param = id;
      console.log(sql);
    }
    pool.query(sql, param, (error, result) => {
        if (error) {
            console.log(error);
            response.send('Error handling request data');
        } else {
            console.log(result);
            var tasks = taskDbHandler.generateList(result, loadType, id);
            //io.sockets.emit('getTasks',{message: tasks});
            response.send(tasks);
        }
    });
});

// CUSTOM search input
app.post('/tasksearch', (request, response) => {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    // Get TASKS
    var searchValueRaw = request.body.searchValue;
    searchValue = '%' + searchValueRaw + '%';
    var taskType = request.body.taskType;
    var searcher = request.body.searcher;
    var status = request.body.status;

    console.log('Searching for...' + searchValue);
    var sql;
    var param;
    if(taskType == 'history'){
      sql = 'SELECT * FROM tickets WHERE (tag = ? or requester = ?) and (ID like ? or requester like ? or POnumber like ? or type like ? or Status like ? or subtype like ? or subject like ? or tag like ?) and '+status+' order by DateCreate desc';
      param = [searcher, searcher, searchValue, searchValue, searchValue, searchValue, searchValue, searchValue, searchValue, searchValue];
    }
    else {
      sql = 'SELECT * FROM tickets WHERE '+ taskType +' = ? and (ID like ? or requester like ? or POnumber like ? or type like ? or Status like ? or subtype like ? or subject like ? or tag like ?) and '+status+' order by DateCreate desc';
      param = [searcher, searchValue, searchValue, searchValue, searchValue, searchValue, searchValue, searchValue, searchValue]
    }
    if(taskType == 'tag')
      taskType = 'Tasks';
    else if(taskType =='requester')
      taskType = 'Submitted';
    else if(taskType == 'history')
      taskType = 'History'
    pool.query(sql, param, (error, result) => {
        if (error) {
            console.log(error);
            response.send('Error handling request data');
        } else {
            var tasks = taskDbHandler.generateList(result, taskType, searcher);
            //io.sockets.emit('getTasks',{message: tasks});
            response.send(tasks);
            //console.log(tasks);
        }


    });
});

// Return Drill in Tasks Detail view + Socket IO Listener and Sender
app.post('/drillTasks', (request, response) => {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    // Get TASKS from task id number
    var id = request.body.id;
    // Get loadType: flag which indicates what type of drill action this is, REFRESH or LOAD NEW DRILL VIEW
    var loadType = request.body.loadType;
    // Get current user $name
    var currentUser = request.body.currentUser;
    pool.query('SELECT * FROM tickets WHERE ID = ?', id, (error, result) => {
        if (error) throw error;
        // Get TASK comments from task id number
        var comments = '';
        pool.query('SELECT * FROM ticketreply WHERE replytoID = ? order by datecreate desc', id, (error, results) => {
            if (error) {
                console.log(error);
                response.send('Error handling request data');
            } else {
                comments = results;
                console.log(results);
                var taskView = taskDbHandler.generateTaskView(result, comments);
                response.send(taskView);
            }
        });


    });
    //UPDATE socket field to 0 to remove glow effect on task id
    var updateSocket = {
        socket: '0'
    }
    var updateTransferRequesterClick = {
      transferRequesterClick: '1'
    }
    pool.query('SELECT * FROM tickets WHERE ID = ?', id, (error, result) => {
        if (error) throw error;
        var lastUpdatedBy = result[0]['LastUpdatedBy'];
        var justGotTransferred = result[0]['justGotTransferred'];
        var tag = result[0]['tag'];
        var requester =  result[0]['requester'];
        // IF drill type flag is refresh do not set glow update flag to 0
        console.log("current user: "+ currentUser);
        console.log("last updated by: " + lastUpdatedBy);
        if (loadType !== "Refresh" && currentUser !== lastUpdatedBy) {
          if((justGotTransferred && tag == currentUser) || !justGotTransferred){
            pool.query('UPDATE tickets set ? WHERE ID = ?', [updateSocket, id], (error, result) => {
                if (error) {
                    console.log(error);
                    response.send('Error handling request data');
                } else {
                    console.log('Socket glow removed');
                }
            });
          }
          else if(justGotTransferred && requester == currentUser){
            pool.query('UPDATE tickets set ? WHERE ID = ?', [updateTransferRequesterClick, id], (error, result) => {
                if (error) {
                    console.log(error);
                    response.send('Error handling request data');
                } else {
                    console.log('Requester clicked on transfer');
                }
            });
          }
        }
    });
});

// Uploading Attachment files to server for individual tasks
app.post('/uploadattachment', (request, response) => {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    // Get TASKS
    var filesArray = request.files;
    async.each(filesArray,function(file,eachcallback){
        //move uploaded files into task folder. Create new folder if not exist for the task

    },function(err){
        if(err){
            console.log("error ocurred in each",err);
        }
        else{
            console.log("finished prcessing");
            res.send({
                "code":"200",
                "success":"files uploaded successfully"
            })
            cmd.run('rm -rf ./fileupload/*');
        }
    });
    console.log('Searching for...' + searchValue);

});

//Process Request for loading attachments
app.post('/getattachments', (request, response) => {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var taskId = request.body.id;
    console.log(taskId);
    var attachments = taskDbHandler.generateAttachments(taskId);
    response.send(attachments);
    console.log(attachments);

    // Get all attachment files in taskId directory


});

//Process Request for new survey assignment
app.post('/sendSurvey', (request, response) => {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  var recipient = request.body.user + "surveyAssigned";
  var user = request.body.user;
  io.sockets.emit(recipient, {message: "to " + request.body.user});
  response.send("survey assigned");
  pool.query('SELECT * FROM glow WHERE user = ?', [user], (error, result) => {
    if(error) {
      console.log(error);
      response.send('Error handling glow');
    }
    else {
      if(result.length == 0){
        pool.query('INSERT INTO glow (user, surveyGlow) VALUES (?, 1)', [user], (error, result) => {
          if(error) {
            console.log(error);
            response.send('Error handling request data');
          }
        });
      }
      else if(result.length > 0){
        pool.query('UPDATE glow SET surveyGlow = 1 WHERE user = ?', [user], (error, result) => {
          if(error) {
            console.log(error);
            response.send('Error handling request data');
          }
        });
      }
    }
  });
});

http.listen(3000, function() {
    console.log('listening on *:3000');
});
