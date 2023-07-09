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
    });
    
    client.on('message', message => {
    console.log(message.body);
    
    });
    



    // e-commerce chat bot 
    client.on('message_create', (msg) => {
        
        if (msg.body === 'Hi') {
            flag = 0;
            client.sendMessage(msg.from, 'Hello, How can we help you today? \nKindly choose from the options bellow: \n1. Show categories \n2. Retrun policy \n3. Talk to an agent');
        }

        if (flag === 0 && msg.body === '1') {
            client.sendMessage(msg.from, 'here are the categories: \nChoose from the given list: \n1. Electronics \n2. Clothing \n3. Food');
            flag = 1; //Electronics
        }

        else if (flag === 0 && msg.body === '2') { //Return policy
            client.sendMessage(msg.from, 'Please return within 3 days. \nClothes are not accepted if washed. \nNo return of damaged product.');
        }

        else if (flag === 0 && msg.body === '3') { //Query
            client.sendMessage(msg.from, 'Please leave your query here. Soon one of our agents will reach you.');
        }

        else if (flag === 1 && msg.body === '1') { //Electronics
            client.sendMessage(msg.from, 'Choose from the given list: \n1. Computer \n2. Phone \n3. Kitchen gadgets');
            option = 'electronics'
        }
        

        if (flag === 1 && msg.body === '2') { //Clothing
            client.sendMessage(msg.from, 'Choose from the given list: \n1. Mens fashion \n2. Womens fashion \n3. Kids');
            option = "clothing"
        }

        if (flag === 1 && msg.body === '3') { //Food
            client.sendMessage(msg.from, 'Choose from the given list: \n1. Drinks and Beverage \n2. Frozen \n3. Fruits and Vegetables');
            option = 'food'
        }

        // else if (option === 'clothing')

        // else if (option === 'food')
        
    });

    client.on('message_options', (msg) => {
        
        if ( msg.fromMe ) {
            if (option === 'electronics' && msg.body === '1'){ //Computer
                client.sendMessage(msg.from, '**Link to Computers page**');
            }
        } 

        else if (option === 'electronics' && msg.body === '2'){ //Phone
            client.sendMessage(msg.from, '**Link to Phones page**');
        }

        else if (option === 'electronics' && msg.body === '3'){ //Kitchen
            client.sendMessage(msg.from, '**Link to Kitchen gadgets page**');
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
            console.log(JSON.stringify(response.data));
            token = response.data;
            })
            .catch((error) => {
            console.log(error);
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
            
            axios.request(config)
            .then((response) => {
                status = JSON.stringify(response.data);
                console.log(status);
            })
            .catch((error) => {
                console.log(error);
            });
            

        }

        authorize();

        if (msg.body === 'show status'){
            msg.reply(status);
        }


    });

    
    


});



  
