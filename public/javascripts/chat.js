  // const ws = new WebSocket('ws://192.168.1.20:8080');

  const msgBoard = document.querySelector("ul#messages");
  const msgBox = document.querySelector('input');
  const messagesAction = document.querySelector('button#messagesAction');
  const messagesInput = document.querySelector('input#messagesInput');

  messagesAction.addEventListener('click', e => {
    e.preventDefault(); // prevents page reloading
    if (messagesInput.value) {
      fetch('//localhost:4400/message', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
          'Content-Type': 'application/json'
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *client
        body: JSON.stringify({
          message: messagesInput.value
        }) // body data type must match "Content-Type" header
      }).then(
        success => {
          if (success.status == 200) {
          
            var li = document.createElement("li");
            li.appendChild(document.createTextNode(messagesInput.value));
            msgBoard.appendChild(li);
            msgBoard.scrollTop = msgBoard.scrollHeight;
            
            messagesInput.value = '';

            
          }

        } // Handle the success response object
      ).catch(
        error => console.log(error) // Handle the error response object
      );


    }
    return false;
  });



  // // Connection opened
  // ws.addEventListener('open', function (event) {
  //   ws.send('Hello Server from clinet!', event);
  //   senMsg.addEventListener('click', e => {
  //     e.preventDefault(); // prevents page reloading
  //     if (msgBox.value) {
  //       ws.send(msgBox.value);
  //       msgBox.value = '';
  //     }
  //     return false;
  //   });
  // });

  // // Listen for messages
  // ws.addEventListener('message', function (event) {
  //   console.log('Message from server ', event.data);
  //   $('#messages').append($('<li>').text(event.data));
  //   msgBoard.scrollTop = window.scrollHeight;
  // });