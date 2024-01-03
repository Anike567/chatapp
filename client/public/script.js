const toid = "";
const socket = io();
var sendBtn = document.getElementsByClassName("send-btn")[0];
var input = document.querySelector('input');
var chats = document.getElementsByClassName('chat-body')[0];

function send() {
    let msg = input.value;
    if (msg === "") {
        alert("You can not send empty messages");
    }
    else {
        let div = document.createElement('div');
        div.classList.add('send');
        let p = document.createElement('p');
        p.innerHTML = msg;
        div.appendChild(p);
        chats.appendChild(div);
        socket.emit('chat_message', msg, toid);
        input.value = '';
        chats.scrollTop = (chats.scrollHeight + 30);
    }
}
//beneat is socket part

async function getUsers() {
    try {
        console.log('entry');
        const response = await fetch('/getusers');
        const users = await response.json();
        console.log(users);
        users.forEach(element => {
            var container = document.getElementsByClassName('chatlist-body')[0];
            var usercontainer = document.createElement('div');
            var dpcontainer = document.createElement('div');
            var img = document.createElement('img');
            var h2 = document.createElement('h2');

            usercontainer.classList.add('chatlist-container');

            usercontainer.id = element.ioid;
            usercontainer.addEventListener('click', (e) => { 
                console.log(e.target.id);
                toid = e.target.id;
            });
            dpcontainer.classList.add('user-container');

            h2.innerHTML = element.name;
            img.src = "/image/user.jpg";
            dpcontainer.appendChild(img);
            usercontainer.appendChild(dpcontainer);
            usercontainer.appendChild(h2);
            container.appendChild(usercontainer);
            console.log(element);

        });
    }
    catch (error) {
        console.error('Error fetching users:', error);
    }
}

socket.on('connect', async () => {
    var mail = document.getElementsByClassName('usr-mail')[0].innerHTML;
    await socket.emit('update', mail);
    setTimeout(1000, getUsers());
})

socket.on('message', (msg) => {
    let div = document.createElement('div');
    div.classList.add('receive');
    let p = document.createElement('p');
    p.innerHTML = msg;
    div.appendChild(p);
    chats.appendChild(div);
});
