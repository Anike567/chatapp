var toid;
const socket = io();
var sendBtn = document.getElementsByClassName("send-btn")[0];
var input = document.querySelector('input');
var chats = document.getElementsByClassName('chats')[0];
var left = document.getElementsByClassName('left')[0];
var right = document.getElementsByClassName('right')[0];




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
        var data={
            message:msg,
            id:ioid
        }
        console.log(data);
        socket.emit('chat_message', data);
        input.value = '';
        chats.scrollTop = (chats.scrollHeight);
    }
}

function addUser(e){
    console.log(e.target.id);
    ioid=e.target.id;    
    let width=window.innerWidth;
    if(width<=450){
        forMobie();
    }

}

async function getUsers() {
    var container = document.getElementsByClassName('chatlist-body')[0];
    removeAllChildNodes(container);

    try {
        console.log('entry');
        const response = await fetch('/getusers');
        const users = await response.json();
        console.log(users);
        users.forEach(element => {
            var usercontainer = document.createElement('div');
            var dpcontainer = document.createElement('div');
            var img = document.createElement('img');
            var h2 = document.createElement('h2');

            usercontainer.classList.add('chatlist-container');

            usercontainer.id = element.ioid;
            usercontainer.addEventListener('click', addUser);

            dpcontainer.classList.add('user-container');

            h2.innerHTML = element.name;
            img.src = "/image/user.jpg";
            dpcontainer.appendChild(img);
            usercontainer.appendChild(dpcontainer);
            usercontainer.appendChild(h2);
            container.appendChild(usercontainer);
            console.log(element);
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
    setTimeout(()=>getUsers(),1000);
})

socket.on('message', (msg) => {
    console.log(msg);
    let div = document.createElement('div');
    div.classList.add('receive');
    let p = document.createElement('p');
    p.innerHTML = msg;
    div.appendChild(p);
    chats.appendChild(div);
});

socket.on('reload',()=>{
    getUsers();
})

function exit(){
    right.style.visibility= 'hidden';
    left.style.visibility='visible';
    document.getElementsByClassName('img-container')[0].style.visibility='hidden';
}

function forMobie(){
    console.log("its work");
    document.getElementsByClassName('img-container')[0].style.visibility='visible';
    right.style.visibility= 'visible';
    left.style.visibility='hidden';
}


