const LinkList = require('./linklist');
const User_list = require('./onlineusermessage');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const { createServer } = require('node:http');
const { Server } = require('socket.io');

var signinname, signinmail;
const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(cookieParser());

const connectedUser = [];
const userList = new User_list();


mongoose.connect('mongodb+srv://admin-aniket:Test123@cluster0.bikic.mongodb.net/userDB').catch(err => console.log(err));
const userSchema = new mongoose.Schema({
    ioid: String,
    name: String,
    email: String,
    password: String,
    mobNo: String
});

const User = mongoose.model('User', userSchema);


app.use(express.static(path.join(__dirname, "../client/public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "../client/views/signin.html"));
});

app.get('/getusers', function (req, res) {
    User.find()
        .then((docs) => {
            if (docs) {
                res.send(docs);
            }
            else {
                res.send(null);
            }
        })
        .catch((err) => {
            console.log(err);
        })
});

app.get("/signup", function (req, res) {
    res.sendFile(path.join(__dirname, "../client/views/signup.html"));
});







//beneath is post router
app.post("/verify", function (req, res) {
    let mail = req.body.email;
    User.find({ email: mail })
        .then((docs) => {
            if (docs.length > 0) {
                data = { msg: "existing user" }
                res.send(data);
            }
            else {
                data = { msg: "ready to signup" }
                res.send(data);
            }
        })
        .catch((err) => {
            data = { msg: "internal server error" }
            res.status(500).send(data);
        })
});

app.post("/signup", function (req, res) {

    const user = new User({
        ioid: "istoupdate",
        name: req.body.name,
        email: req.body.mail,
        password: req.body.pass,
        mobNo: req.body.contactno

    });
    user.save()
        .then(savedUser => {
            name = req.body.name;

            const htmlPath = path.join(__dirname, "../client/views/main.html");
            let html = fs.readFileSync(htmlPath, 'utf8');
            html = html.replace('{{username}}', savedUser.name);
            html = html.replace('{{mail}}', savedUser.email);
            res.send(html);
        })
        .catch(err => {
            console.error('Error saving user:', err);
            res.status(500).send('Error saving user');
        });
});

app.post("/verifysignin", function (req, res) {
    var mail = req.body.email;
    var password = req.body.pass;


    User.findOne({ email: mail, password: password })
        .then((user) => {
            if (user) {
                var data = {
                    msg: "true",
                }
                res.cookie('sessionid', user._id.toString());
                res.cookie('usermail', user.email);
                res.cookie('username', user.name);
                res.send(data)
            } else {
                var data = { msg: "false" };
                res.send(data);
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({ msg: "error" }); // Sending an error status
        });
});



app.post("/signin", function (req, res) {
    const { usermail, sessionid } = req.cookies;

    if (!usermail || !sessionid) {
        return res.redirect("/");
    }
    else{
        res.redirect("/main");
    }
});

app.get("/main", function (req, res) {
    const { usermail, sessionid } = req.cookies;

    if (!usermail || !sessionid) {
        return res.redirect("/");
    }
    else{
        res.sendFile(path.join(__dirname, ("../client/views/main.html")));
    }
});



// api for sending msg when the user is offline

app.post("/getmesseges", function (req, res) {
    let username = req.body.username;
    let temp = userList.findAndDelete(username);
    if (temp !== null) {
        let data = express.json
        res.send(temp.msg);
    }
    else {
        res.send([]);
    }
});





// beneath is socket.io part;


io.on('connection', async (socket) => {

    console.log(socket.id);
    connectedUser.push(socket.id);

    socket.on('update', async (msg) => {
        filter = { email: msg };
        update = { ioid: socket.id };
        await User.findOneAndUpdate(filter, update, { new: true })
            .then((doc) => {
                if (!doc) {
                    console.log("User not found");
                }
            })
            .catch((err) => {
                console.log(err);
            })
            .then(() => {
                socket.broadcast.emit('reload');
            });
    });
    

    socket.on('chat_message', (data) => {
        let index=connectedUser.indexOf(data.id);
        if (index !== -1) {
            io.to(data.id).emit('message', data);
        }
        else {
            console.log("Not existing user msg is saved in database");
            let temp = userList.find(data.tomail);
            if (temp) {
                temp.msg.push({ from: data.from, msg: data.message.msg });
            }
            else {
                let temp = userList.insert(data.tomail);
                temp.msg.push({ from: data.from, msg: data.message.msg });
            }
        }


    });



    socket.on('disconnect', async () => {
        let index = connectedUser.indexOf(socket.id);
        if (index !== -1) {
            connectedUser.splice(index, 1); 
        }
        else{
            console.log("user not find");
        }
    });
    

});

server.listen(3000, function () {
    console.log("server is up and running on port:3000");
});