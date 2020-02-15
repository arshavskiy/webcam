  const ws = new WebSocket('ws://localhost:8080');

  const msgBoard = document.querySelector("ul#messages");
  const msgBox = document.querySelector('input');
  const senMsg = document.querySelector('button#msgAction');
  // Connection opened
  ws.addEventListener('open', function (event) {
    // ws.send('Hello Server!');
    senMsg.addEventListener('click', e => {
      e.preventDefault(); // prevents page reloading
      if (msgBox.value) {
        ws.send(msgBox.value);
        msgBox.value = '';
      }
      return false;
    });
  });

  // Listen for messages
  ws.addEventListener('message', function (event) {
    console.log('Message from server ', event.data);
    $('#messages').append($('<li>').text(event.data));
    msgBoard.scrollTop = msgBoard.scrollHeight;
  });