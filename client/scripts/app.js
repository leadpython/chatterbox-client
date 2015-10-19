// YOUR CODE HERE:
var app = {};

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
};

// $(document).ready(function() {
  $('#message').on('click', function() {
    app.addMessage({
      username: username,
      text: $('#message').text(),
      roomname: $('#roomSelect').text()
    }
    );
  });
// })

app.addRoom = function(roomString) {
  var $room = '<option value="' + roomString + '">' + roomString + '</option>';
  $('#roomSelect').append($room);
};

app.addFriend = function(username) {
  console.log(username);
};

$(document).ready(function() {
  $('.username').on('click', function() {
    app.addFriend($(this).text());
  });
});

// app.addMessage({
//   username: 'shawndrost',
//   text: 'trololo',
//   roomname: '4chan'
// });
