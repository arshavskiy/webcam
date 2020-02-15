window.onload = function(){

  const socket = io();
  const msgBox = document.querySelector('input');
  const senMsg = document.querySelector('button');
  
  senMsg.addEventListener('click', e =>{
    e.preventDefault(); // prevents page reloading
    if (msgBox.value) {
      socket.emit('chat message', msgBox.value);
      msgBox.value = '';
    }
    return false;
  });
  
  socket.on('chat message', function(msg){
    $('#messages').append($('<li>').text(msg));
  });

  
};



