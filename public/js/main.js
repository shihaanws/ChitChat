const chatform = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// GET username from url
const {username,room} = Qs.parse(location.search,{
    ignoreQueryPrefix: true
})
console.log(username,room);

const socket = io();

// JOIN CHATROOM
socket.emit('joinRoom',{username,room });

// GETTING ROOM AND USERS
socket.on('roomUsers',({room,users})=>{
    outputRoomName(room);
    outputUsers(users);
});


// MESSAGE FROM SERVER
socket.on('message',message=>{
    console.log(message);
    outputMessage(message);

// SCROLL TO THE RECENT MESSAGE
    chatMessages.scrollTop=chatMessages.scrollHeight;
});

// MESSAGE To GET SUBMITTED

chatform.addEventListener('submit',(e)=>{
    e.preventDefault();
   
// GET MESSAGE TEXT    
    const msg = e.target.elements.msg.value;

// EMITTING MESSAGE TO SERVER    
    socket.emit('chatMessage',msg);

// CLEARS THE INPUT TEXT AFTER SENDING    
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});


// OUTPUTTING TO DOM
function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML= `<p class="meta">${message.username}<span>${message.time}</span></p>
    <p class="text">
       ${message.text}
    </p>`;
    
    document.querySelector('.chat-messages').appendChild(div);
}

// ADDING ROOMNAME TO DOM
function outputRoomName(room){
    roomName.innerText = room;
}

// ADDING USERNAME TO DOM
function outputUsers(users) {
    userList.innerHTML = '';
    users.forEach(user=>{
      const li = document.createElement('li');
      li.innerText = user.username;
      userList.appendChild(li);
    });
   }