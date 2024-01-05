const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const { log } = require('console');


const users = [];
var name = "";
const app = express();
const server = createServer(app);
const io = new Server(server);


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


app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "../client/views/signin.html"));
});

app.get('/getusers', function (req, res) {
    User.find()
    .then((docs)=>{
        if(docs){
            res.send(docs);
        }
        else{
            res.send(null);
        }
    })
    .catch((err)=>{
        console.log(err);
    })
});

app.get("/signup",function(req,res){
    res.sendFile(path.join(__dirname, "../client/views/signup.html"));
});




//beneath is post router


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

app.post("/signin",function(req,res){
    var mail=req.body.mail;
    var password=req.body.pass;

    User.findOne({email:mail,password:password})
    .then((docs)=>{
        if(docs){
            const htmlPath = path.join(__dirname, "../client/views/main.html");
            let html = fs.readFileSync(htmlPath, 'utf8');
            html = html.replace('{{username}}', docs.name);
            html = html.replace('{{mail}}', docs.email);
            res.send(html);
        }
        else{
            res.send("Not existing user");
        }
    })
    .catch((err)=>{
        console.log(err);
    })
});

app.get("/main", function (req, res) {
    res.sendFile(path.join(__dirname, ("../client/views/main.html")));
});





// beneath is socket.io part;

io.on('connection', (socket) => {

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });

    socket.on('update', (msg) => {
        filter={email:msg};
        update={ioid:socket.id};
         User.findOneAndUpdate(filter,update,{new:true})
            .then((doc)=>{
                if(!doc){
                    console.log("User not found");
                }
            })
            .catch((err)=>{
                console.log(err);
            });
    });

    socket.on('chat_message', (data)=>{
        log(data);
        io.to(data.id).emit('message', data.message);
    })
    
});

server.listen(3000, function () {
    console.log("server is up and running on port:3000");   
});