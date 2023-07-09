
require('dotenv').config({ path: './.env' });
const qrcode = require('qrcode-terminal');
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


    client.on('message', message => {
        
        if (message.body === '!ping') {
        // Send a new message to the same chat
        client.sendMessage(message.from, 'pong');
        
        }

        if (message.body === '!ping reply') {
        // Send a new message as a reply to the current one
        message.reply('pong reply');
        }

    });

    client.on('message', async msg => {
        
        if (msg.body === '!chats') {
            const chats = await client.getChats();
            client.sendMessage(msg.from, `The bot has ${chats.length} chats open.`);
        }
        if (msg.body === '!info') {
            let info = client.info;
            client.sendMessage(msg.from, `
                *Connection info*
                User name: ${info.pushname}
                My number: ${info.wid.user}
                Platform: ${info.platform}
            `);
        }

    });

});