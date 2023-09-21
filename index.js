require('dotenv').config({ path: './.env' });
const qrcode = require('qrcode-terminal');
// const qrcode = require('qrcode');
const axios = require('axios');
const { Client, RemoteAuth, MessageMedia } = require('whatsapp-web.js');
const { MongoStore } = require('wwebjs-mongo'); // Require database
const mongoose = require('mongoose');

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
    
    // client.on('qr', async qr => {
    //     try {
    //       const qrCodeDataUrl = await qrcode.toDataURL(qr);

    //       // Save the QR code image as a file
    //       const filePath = 'qrcode.png'; // Specify the file path
    //       await qrcode.toFile(filePath, qr, { type: 'png' });

    //       console.log('QR code image saved as qrcode.png'); // Log a message

    //       // You can now open 'qrcode.png' using an external image viewer
    //     } catch (error) {
    //       console.error('Error generating QR code:', error);
    //     }
    //   });

      client.on('ready', () => {
        console.log('server is ready!');
    });
    
    // client.on('message', message => {
    // console.log(message.body);
    
    // });
    

    // e-commerce chat bot 

    // variable for hierarchy
    let level = 0;
    let option;
    let message;

    client.on('message_create', (msg) => {

        if (msg.body === 'Back'){
            level--;
            client.sendMessage(msg.from, message);
        }

        if (msg.body === 'Hi' || msg.body === 'Main menu') {
            level = 0;
            message = 'Hello, How can we help you today? \nKindly choose from the options bellow: \n1. Show categories \n2. Retrun policy \n3. Talk to an agent';
            client.sendMessage(msg.from, message);
        }

        if (level === 0 && msg.body === '1') { 
            message = 'here are the categories: \nChoose from the given list: \n1. Electronics \n2. Clothing';
            client.sendMessage(msg.from, message);
            level = 1; //Electronics
        }


        else if (level === 1 && msg.body === '1') { //Electronics
            message = 'Choose from the given list: \n1. Computer \n2. Phone \n3. Home aplliances';
            client.sendMessage(msg.from, message);
            level = 2;
            option = 'electronics';
        }

        else if (option == 'electronics' && level === 2 && msg.body === '1'){ //Computer 
            
            client.sendMessage(msg.from, 'https://robishop.com.bd/laptops-computers.html');
            level++;
        }
        

        else if (option == 'electronics' && level === 2 && msg.body === '2'){ //Phone
            client.sendMessage(msg.from, 'https://robishop.com.bd/mobile-phones/smartphones.html');
            level++;
        }

        else if (option == 'electronics' && level === 2 && msg.body === '3'){ //home appl
            client.sendMessage(msg.from, 'https://robishop.com.bd/electronics.html');
            level++;
        }

        else if (level === 0 && msg.body === '2') { //Return policy
            client.sendMessage(msg.from, 'Please return within 3 days. \nClothes are not accepted if washed. \nNo return of damaged product.');
        }

        else if (level === 0 && msg.body === '3') { //Query
            client.sendMessage(msg.from, 'Please leave your query here. Soon one of our agents will reach you.');
        }
        

        else if (level === 1 && msg.body === '2') { //Clothing
            message = 'Choose from the given list: \n1. Mens fashion \n2. Womens fashion \n3. Kids';
            client.sendMessage(msg.from, message);
            option = 'clothing';
            level = 2;
        }

        else if (option == 'clothing' && level === 2 && msg.body === '1'){ //Men 
            client.sendMessage(msg.from, 'Link to Mens Fashion');
            level++;
        }
        

        else if (option === 'clothing' && level === 2 && msg.body === '2'){ //Women
            client.sendMessage(msg.from, 'Link to Women Fashion');
            level++;
        }

        else if (option === 'clothing' && level === 2 && msg.body === '3'){ //Kids
            client.sendMessage(msg.from, 'Link to Kids Fashion');
            level++;
        }
        
    });



    // Robi shop chat bot
    let userName;
    let password;
    let credentials;
    let token;
    let status;
    let data;
    let orderID;

    client.on('message', async (msg) => {
        if (msg.body.startsWith("username ")){
        userName = msg.body.slice(9);
        msg.reply(userName);
        }

        if (msg.body.startsWith("password ")){
        password = msg.body.slice(9);
        msg.reply(password);
        }

        credentials = JSON.stringify({
        "username": userName,
        "password": password
        });

        if (msg.body === 'show info'){
        msg.reply(credentials);
        }

        const login = async(loginData) => {
        
            let loginConfig = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://cdn.robishop.com.bd/rest/V1/integration/admin/token',
            headers: { 
                'Content-Type': 'application/json'
                },
            data : loginData
            };
            
            await axios.request(loginConfig)
            .then((response) => {
            //console.log(JSON.stringify(response.data));
            token = response.data;
            })
            .catch((error) => {
            // console.log(error);
            });
    
            return token;
        }

        if (msg.body.startsWith("orderID ")) {
                      
            orderID = msg.body.slice(8);
    
            data = JSON.stringify({
            "orderIds": [orderID]
            });

            msg.reply(orderID);
        }

        const authorize = async() => {

            let accessToken = await login(credentials);            
            
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://cdn.robishop.com.bd/rest/V1/orders/status',
                headers: { 
                'Authorization': `Bearer ${accessToken}`, 
                'Content-Type': 'application/json'
                },
                data : data
            };
            
            await axios.request(config)
            .then((response) => {
                status = JSON.stringify(response.data);
                //console.log(status);
            })
            .catch((error) => {
                // console.log(error);
            });
            

        }

        authorize();

        if (msg.body === 'show status'){
            msg.reply(status);
        }

    });
});