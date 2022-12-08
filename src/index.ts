import { Events, SapphireClient } from '@sapphire/framework';
import 'module-alias/register';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { GatewayIntentBits } from 'discord.js';
// import http from 'http';

dotenv.config();

mongoose.connect(process.env.MONGO_URI!)

const client = new SapphireClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMembers,
  ]
});

console.log('Logging in...');

client.login(process.env.TOKEN);

// const port = process.env.PORT || 3000;

// console.log(`Listening on port ${port}`);

// const server = http.createServer((req, res) => {
//   res.writeHead(200);
//   res.end('Hello World!');
//   // console.log("Ping Received");
// });

// server.listen(port);