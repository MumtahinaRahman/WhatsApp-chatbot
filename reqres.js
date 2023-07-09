require('dotenv').config({ path: './.env' });
const qrcode = require('qrcode-terminal');
const axios = require('axios');
const { Client, RemoteAuth, MessageMedia } = require('whatsapp-web.js');
const { MongoStore } = require('wwebjs-mongo'); // Require database
const mongoose = require('mongoose');


// variables for hierarchy
let flag = 0;
let option;

// Load the session data
mongoose.connect(process.env.MONGODB_URI).then(() => {
    const store = new MongoStore({ mongoose: mongoose });
    const client = new Client({
        authStrategy: new RemoteAuth({
            store: store,
            backupSyncIntervalMs: 300000
        })
    });

    client.initialize();

    client.on('qr', qr => {
        qrcode.generate(qr, {small: true});
    });
    
    
    client.on('ready', () => {
    console.log('Client is ready!');
    // console.log('Chat ID:', message.chatId._serialized);
    });
    
    client.on('message', message => {
    console.log(message.body);
    
    });


 

    // show built in user
    client.on('message', async (msg) => {
        if (msg.body === 'Single user') {
            try {
            const response = await axios.get('https://reqres.in/api/users/2');
            const data = response.data.data;
            // Process the response data as per your requirement
            const userName = data.first_name
            msg.reply(`Signle user: ${userName}`);
            } catch (error) {
            console.error('Error making API request:', error);
            }
        }
    });


    client.on('message', async (msg) => {
    if (msg.body === 'User first names') {
    try {
    const response = await axios.get('https://reqres.in/api/users?page=2');
    const data = response.data.data;
    // Process the response data as per your requirement
    const userNames = data.map((user) => user.first_name).join(', ');
    msg.reply(`Users: ${userNames}`);
    } catch (error) {
    console.error('Error making API request:', error);
    }
    }
    });



    client.on('message', async (msg) => {
    if (msg.body === 'Show resources') {
    try {
    const response = await axios.get('https://reqres.in/api/unknown');
    const data = response.data.data;
    // Process the response data as per your requirement
    const resources = data.map((e) => e.name).join(', ');
    msg.reply(`resources: ${resources}`);
    } catch (error) {
    console.error('Error making API request:', error);
    }
    }
    });


    // create a user
    client.on('message', async (msg) => {
    if (msg.body === 'create user') {
    try {
    const payload = {
    name: 'Mumtahina Rahman',
    job: 'student'
    };
    const response = await axios.post('https://reqres.in/api/users', payload);
    const createdUser = response.data;
    // Process the createdUser response as per your requirement
    msg.reply(`User created: ${JSON.stringify(createdUser)}`);
    console.log(response);
    } catch (error) {
    console.error('Error making API request:', error);
    }
    }
    });



    // update a user
    client.on('message', async (msg) => {
    if (msg.body === '!update') {
    try {
    const payload = {
    name: 'Mumtahina Rahman',
    job: 'Software Developer'
    };
    const response = await axios.put('https://reqres.in/api/users/325', payload);
    const updatedUser = response.data;
    // Process the updatedUser response as per your requirement
    msg.reply(`User updated: ${JSON.stringify(updatedUser)}`);
    console.log(response);
    } catch (error) {
    console.error('Error making API request:', error);
    }
    }
    });


    // register a user
    client.on('message', async (msg) => {
    if (msg.body === 'register user') {
    try {
    const payload = {
    email: 'eve.holt@reqres.in',
    password: 'pistol'
    };
    const response = await axios.post('https://reqres.in/api/register', payload);
    const registeredUser = response.data;
    // Process the createdUser response as per your requirement
    msg.reply(`User registered: ${JSON.stringify(registeredUser)}`);
    console.log(response);
    } catch (error) {
    console.error('Error making API request:', error);
    }
    }
    });


    //   login a user
    client.on('message', async (msg) => {
    if (msg.body === 'login user') {
    try {
    const payload = {
    email: 'eve.holt@reqres.in',
    password: 'cityslicka'
    };
    const response = await axios.post('https://reqres.in/api/login', payload);
    const loggedUser = response.data;
    // Process the createdUser response as per your requirement
    msg.reply(`User logged in: ${JSON.stringify(loggedUser)}`);
    console.log(response);
    } catch (error) {
    console.error('Error making API request:', error);
    }
    }
    })
});
