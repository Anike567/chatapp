
var toid=null;
var from = document.getElementsByClassName('usr-mail')[0].innerHTML;
var tomail=null;
var messages = [];
const socket = io();
var sendBtn = document.getElementsByClassName('send-btn')[0];
var input = document.querySelector('input');
var chats = document.getElementsByClassName('chats')[0];
var left = document.getElementsByClassName('left')[0];
var right = document.getElementsByClassName('right')[0];



function send(e) {
    let inputMsg = input.value;
    if (msg === "") {
        alert("You can not send empty messages");
    }
    else {

        var msg = {
            msg: inputMsg,
            class: "send"

        }
        messages[tomail].push(msg);

        let div = document.createElement('div');
        div.classList.add('send');
        let p = document.createElement('p');
        p.innerHTML = inputMsg;
        div.appendChild(p);
        chats.appendChild(div);
        var data = {
            message: msg,
            id: ioid,
            from: from
        }
        socket.emit('chat_message', data);
        input.value = '';
        chats.scrollTop = (chats.scrollHeight);
    }
}

function addUser(e) {
    removeAllChildNodes(chats);

    ioid = e.target.id;
    tomail = e.target.classList[1];
    e.target.classList.remove('dot');
    messages[e.target.classList[1]].forEach((element) => {
        let div = document.createElement('div');
        div.classList.add(element.class);
        let p = document.createElement('p');
        p.innerHTML = element.msg;
        div.appendChild(p);
        chats.appendChild(div);
    });
    let width = window.innerWidth;
    if (width <= 450) {
        forMobie();
    }

}

async function getUsers() {
    var container = document.getElementsByClassName('chatlist-body')[0];
    removeAllChildNodes(container);

    try {
        const response = await fetch('/getusers');
        const users = await response.json();
        let usrmail = document.getElementsByClassName('usr-mail')[0].innerHTML;
        users.forEach(element => {
            if (usrmail != element.email) {
                messages[element.email] = [];

                var usercontainer = document.createElement('div');
                var dpcontainer = document.createElement('div');
                var img = document.createElement('img');
                var h2 = document.createElement('h2');

                usercontainer.classList.add('chatlist-container');
                usercontainer.classList.add(element.email);
                usercontainer.id = element.ioid;
                usercontainer.addEventListener('click', addUser);

                dpcontainer.classList.add('user-container');

                h2.innerHTML = element.name;
                img.src = "/image/user.jpg";
                dpcontainer.appendChild(img);
                usercontainer.appendChild(dpcontainer);
                usercontainer.appendChild(h2);
                container.appendChild(usercontainer);
            }
        });
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

//beneath is socket part


socket.on('connect', async () => {
    var mail = document.getElementsByClassName('usr-mail')[0].innerHTML;
    await socket.emit('update', mail);
    getUsers();
})

socket.on('message', (data) => {
    console.log(data);
    var msg = {
        msg: data.message.msg,
        class: 'receive'

    }
    messages[data.from].push(msg);
    if (tomail === data.from) {
        let div = document.createElement('div');
        div.classList.add('receive');
        let p = document.createElement('p');
        p.innerHTML = data.message.msg;
        div.appendChild(p);
        chats.appendChild(div);
    }
    else{
        var newmsg=document.getElementsByClassName(data.from)[0];
        newmsg.classList.add('dot');
    }



});

socket.on('reload', () => {
    getUsers();
})

function exit() {
    right.style.visibility = 'hidden';
    left.style.visibility = 'visible';
    document.getElementsByClassName('img-container')[0].style.visibility = 'hidden';
    tomail=null;
    toid=null;
}

function forMobie() {
    document.getElementsByClassName('img-container')[0].style.visibility = 'visible';
    right.style.visibility = 'visible';
    left.style.visibility = 'hidden';
}




sendBtn.addEventListener('click', send);