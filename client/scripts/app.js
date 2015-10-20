// YOUR CODE HERE:
var app = {
  noDupRooms: {},
  friends: {},
  messages: []
};

app.init = function() {
  app.fetch();
};

app.sortByDate = function() {
  var recursiveBubbleSort = function(i) {
    for (i; i < app.messages.length; i++) {
      if (app.messages[i] > app.messages[i+1]) {
        var tmp = app.messages[i];
        app.messages[i] = app.messages[i+1];
        app.messages[i+1] = tmp;
        if (i !== 0) {
          recursiveBubbleSort(i-1);
        }
      }
    }
  };
  recursiveBubbleSort(0);
};

app.send = function(message) {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
};

app.addRoomList = function(data) {
  for (var i = data.results.length-1; i>=0; i--) {
    var room = data.results[i].roomname !== undefined ? data.results[i].roomname : data.results[i].room;
      app.addRoom(room);
  }
};

app.addRoom = function(room) {
  // $('#roomBox').val('');
  var room = room.replace(/[^a-z0-9]/gi, '');
  if (app.noDupRooms[room] === undefined && room !== undefined) {
    $('#roomSelect').append($('<option>', {
      value: room,
      text: room,
    }));
    app.noDupRooms[room] = room;
    var $divRoom = '<div class="' + room + '"></div>';
    $('#chats').append($divRoom);
  }
};

app.fetch = function() {
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    data: {},
    contentType: 'application/json',
    success: function (data) {
      app.addRoomList(data);
      for (var i = data.results.length-1; i >=0 ; i--) {
        app.messages.push(data.results[i]);
      }
      app.sortByDate();
      for (var i = 0; i < app.messages.length; i++) {
        var room = app.messages[i].roomname !== undefined ? app.messages[i].roomname : app.messages[i].room;
        room = room.replace(/[^a-z0-9]/gi, '');
        if (room !== '') {
          app.addMessageToRoom(app.messages[i]);
        }
      }
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to receive message');
    }
  });
};

app.clearMessages = function() {
  $('#chats').empty();
};

app.sendMessage = function(message) {
  this.send(message);
}

app.addMessageToRoom = function(message) {

  var messageDiv = $('<div class="message"></div>');
  
  var usernameP = $('<p class="message username"></p>').text(message.username);
  if (message.username in app.friends) {
    var messageDiv = $('<p class="message text"><b></b></p>').text(message.text);
  } else {
    var messageP = $('<p class="message text"></p>').text(message.text);
  }
  var timeP = $('<p class="message time"></p>').text(message.createdAt);

  var roomClass = message.roomname !== undefined ? message.roomname : message.room;
  roomClass = roomClass.replace(/[^a-z0-9]/gi, '');
  
  messageDiv.append(usernameP);
  messageDiv.append(messageP);
  messageDiv.append(timeP);
  $('.' + roomClass).append(messageDiv);
};

app.displayRoom = function(room) {
  // clear the room (without losing prior messages in room)
  if ($('#chats').children()) {
    $('#chats').children().hide();
  }
  // add room selected
  $('#chats').find('.'+room).show();
};


app.addFriend = function(username) {
  if (app.friends[username] === undefined) {
    app.friends[username] = username;
    $('#friends').append('<div>' + username + '</div>');
  }
};

var equalSign = window.location.search.indexOf('=');
var username = window.location.search.slice(equalSign+1);

app.handleSubmit = function() {
  app.sendMessage({
    username: username,
    text: $('#messageBox').val(),
    roomname: $('#roomSelect').val()    
  });
  $('#messageBox').val('');
};

app.init();

$('#send').on('submit', function(e) {
  app.handleSubmit();
  e.preventDefault();
});

$('#roomSelect').change(function() {
  app.displayRoom($(this).val());
});

$('#submitRoom').on('click', function(e) {
  console.log('hi')
  app.addRoom($('#roomBox').val());
  e.preventDefault();
});

$('#chats').on('click', '.username', function(e) {
  app.addFriend($(this).text());
});
