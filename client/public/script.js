var toid = null;
var tomail = null;
var from = null;

var tomail = null;
var messages = [];
const socket = io();
var sendBtn = document.getElementsByClassName('send-btn')[0];
var input = document.querySelector('input');
var chats = document.getElementsByClassName('chats')[0];
var left = document.getElementsByClassName('left')[0];
var right = document.getElementsByClassName('right')[0];

function logout() {
    localStorage.setItem('chatAppMessage', JSON.stringify(messages));
    const currentDate = new Date();
    const dayOfMonth = currentDate.getDate();
    const dayOfWeekIndex = currentDate.getDay();
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeek = weekdays[dayOfWeekIndex];


    const expires = `${dayOfWeek}, ${dayOfMonth} ${currentDate.toLocaleString('en-us', { month: 'short' })} ${currentDate.getFullYear()} 00:00:00 GMT`;


    document.cookie = `sessionid=; expires=${expires}; path=/;`;
    window.location.href = "/";
}


function getCookiesAndUpdateUsername() {
    var userName = document.getElementsByClassName('username')[0];
    var userMail = document.getElementsByClassName('usr-mail')[0];
    const cookies = document.cookie.split(';');
    cookies.forEach((element) => {
        let key = element.trim().split('=');
        if (key[0] === 'usermail') {
            from = decodeURIComponent(key[1]);
            userMail.innerHTML = decodeURIComponent(key[1]);
        }
        if (key[0] === 'username') {
            userName.innerHTML = decodeURIComponent(key[1]);
        }
    });


}


window.addEventListener('unload', function (event) {
    const data = {
        username: document.getElementsByClassName('username')[0].innerHTML,
        usermail: document.getElementsByClassName('usr-mail')[0].innerHTML
    };
    localStorage.setItem('chatAppMessage', JSON.stringify(messages));
    const dataString = JSON.stringify(data);
    localStorage.setItem('chatAppData', dataString);
});

window.onload = function () {

    getCookiesAndUpdateUsername();
    let messagesString = localStorage.getItem('chatAppMessage');
    messages = messagesString ? JSON.parse(messagesString) : {};
    if (performance.navigation.type === 1) {
        myFunction();

    }
};


function myFunction() {


    const retrievedDataString = localStorage.getItem('chatAppData');
    const retrievedData = JSON.parse(retrievedDataString);
    document.getElementsByClassName('username')[0].innerHTML = retrievedData.username;
    document.getElementsByClassName('usr-mail')[0].innerHTML = retrievedData.usermail;
    from = retrievedData.usermail;
    localStorage.removeItem('chatAppData');
}

function send() {
    let inputMsg = input.value;
    if (inputMsg === "") {
        alert("You cannot send empty messages");
    } else {
        // Check if messages[tomail] exists, if not, create it
        if (!messages[tomail]) {
            messages[tomail] = [];
        }

        var msg = {
            msg: inputMsg,
            class: "send"
        };
        messages[tomail].push(msg);

        let div = document.createElement('div');
        div.classList.add('send');
        let p = document.createElement('p');
        p.innerHTML = inputMsg;
        div.appendChild(p);
        chats.appendChild(div);
        var data = {
            message: msg,
            id: toid,
            from: from,
            tomail: tomail
        };
        socket.emit('chat_message', data);
        input.value = '';
        input.focus();
        chats.scrollTop = (chats.scrollHeight);
    }
}

// ... (rest of your code)

function addUser(e) {
    removeAllChildNodes(chats);

    toid = e.target.id;
    tomail = e.target.classList[1];

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
        await users.forEach(element => {
            console.log(element);
            if (usrmail != element.email) {

                if (!messages[element.email]) {
                    messages[element.email] = []
                }
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

async function getUpdate() {
    try {
        const response = await fetch('/getusers');
        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }
        const users = await response.json();
        let usrmail = document.getElementsByClassName('usr-mail')[0].innerHTML;
        for (const element of users) {
            console.log(element);
            if (usrmail !== element.email) {
                let list = document.getElementsByClassName(element.email)[0];
                if ( list.id === toid) {
                    toid = element.ioid;
                }
                list.id = element.ioid;
            }
        }
    } catch (error) {
        console.error('Error fetching user data:', error.message);
    }
}

async function getMessages() {
    const response = await fetch("/getmesseges", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username: from })
    });
    const data = await response.json();
    data.forEach(element => {
        var msg = {
            msg: element.msg,
            class: 'receive'

        }
        // console.log(messages[element.from]);
        messages[element.from].push(msg);

    });
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
    getMessages();
})

socket.on('message', (data) => {
    // console.log(data);

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
        chats.scrollTop = (chats.scrollHeight);
    }
    else {
        var newmsg = document.getElementsByClassName(data.from)[0];
        newmsg.classList.add('dot');
    }



});

socket.on('reload', () => {
    getUpdate();
})

function exit() {
    right.style.visibility = 'hidden';
    left.style.visibility = 'visible';
    document.getElementsByClassName('img-container')[0].style.visibility = 'hidden';
    tomail = null;
    toid = null;
}

function forMobie() {
    document.getElementsByClassName('img-container')[0].style.visibility = 'visible';
    right.style.visibility = 'visible';
    left.style.visibility = 'hidden';
}




sendBtn.addEventListener('click', send);
input.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        send();
    }
});
