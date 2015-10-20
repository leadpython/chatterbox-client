// YOUR CODE HERE:
var app = {};

var User = function(username) {
  this.username = username;
  this.friends = {};
};

var equalSign = window.location.search.indexOf('=');
var username = window.location.search.slice(equalSign+1);

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

app.fetch = function() {
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    data: {},
    contentType: 'application/json',
    success: function (data) {
      console.log(data.results);
      for (var i = 0; i < data.results.length; i++) {
        var messageCheck = data.results[i].text;
        if (messageCheck.indexOf('<') === -1 && messageCheck.indexOf('>') === -1) {
          app.addMessage(data.results[i]);
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

app.addMessage = function(message) {
  this.send(message);
  var $divMessage = '<div class="message"><p class="message username">' + message.username + '</p><p class="message text">' + message.text + '</p></div>';
  $('#chats').prepend($divMessage);
};

app.displayRoom = function(room) {
  // TODO
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
  $('#messageBox').val('');
};

app.init();

$('#send').on('submit', function(e) {
  e.preventDefault();
  app.handleSubmit();
});
