// YOUR CODE HERE:
var app = {
  noDupRooms: {},
  friends: {}
};

app.init = function() {
  app.fetch();
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
    // if (data.results[i].message !== undefined) {
      app.addRoom(room);
    // }
  }
};

app.addRoom = function(room) {
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

$('#createRoom').on('submit', function() {
  addRoom($('#roomBox').val());
});

app.fetch = function() {
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    data: {},
    contentType: 'application/json',
    success: function (data) {
      app.addRoomList(data);
      for (var i = data.results.length-1; i >=0 ; i--) {
        app.addAllMessages(data.results[i]);
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

app.addAllMessages = function(message) {
  var messageDiv = $('<div class="message"></div>');
  var usernameP = $('<p class="message username"></p>').text(message.username);
  var messageP = $('<p class="message text"></p>').text(message.text);

  var roomClass = message.roomname !== undefined ? message.roomname : message.room;
  messageDiv.append(usernameP);
  messageDiv.append(messageP);
  $('.' + roomClass).prepend(messageDiv);
};

app.displayRoom = function(room) {
  // clear the room (without losing prior messages in room)
  if ($('#chats').children()) {
    $('#chats').children().hide();
  }
  // add room selected
  $('#chats').find('.'+room).show();
};

$('#roomSelect').change(function() {
  app.displayRoom($(this).val());
});

app.addFriend = function(username) {
  app.friends[username] = username;
};

$('.username').on('click', function() {
  app.addFriend($(this).text());
})

var equalSign = window.location.search.indexOf('=');
var username = window.location.search.slice(equalSign+1);

app.handleSubmit = function() {
  app.sendMessage({
    username: username,
    text: $('#messageBox').val(),
    roomname: $('#roomSelect').text()    
  });
  $('#messageBox').val('');
};

app.init();

$('#send').on('submit', function(e) {
  e.preventDefault();
  app.handleSubmit();
});
