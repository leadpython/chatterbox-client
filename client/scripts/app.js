// YOUR CODE HERE:
var app = {
  rooms: {}
};

var User = function(username) {
  this.username = username;
  this.friends = {};
};

var equalSign = window.location.search.indexOf('=');
var username = window.location.search.slice(equalSign+1);

app.init = function() {
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

app.fetch = function() {
  $.ajax({
    url: undefined,
    type: 'GET',
    data: {},
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message received');
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

app.addMessage = function(message) {
  this.send(message);
  var $divMessage = '<div class="message"><p class="message username">' + message.username + '</p><p class="message text">' + message.text + '</p></div>';
  $('#chats').append($divMessage);
  app.rooms[$('#roomSelect').val()] = $('#chats');
};

app.addRoom = function(roomString) {
  var $roomDOMTree = $('#chats');
  app.rooms[roomString] = $roomDOMTree;
  var $room = '<option value="' + roomString + '">' + roomString + '</option>';
  $('#roomSelect').append($room);
};

$('#submitRoom').on('click', function() {
  app.addRoom($('#roomBox').val());
});

app.displayRoom = function(room) {
  // get rooms[room]
  var $selectedRoom = app.rooms[room];
  // replace existing room with that
  $('#chats').replaceWith($selectedRoom);
};

$('#roomSelect').change(function() {
  app.displayRoom($(this).val());
});

app.addFriend = function(username) {
  console.log(username);
};

$(document).ready(function() {
  $('.username').on('click', function() {
    app.addFriend($(this).text());
  });
});

app.handleSubmit = function() {
  app.addMessage({
    username: username,
    text: $('#messageBox').val(),
    roomname: $('#roomSelect').text()    
  });
};

$('#send').on('submit', function(e) {
  e.preventDefault();
  app.handleSubmit();
});
