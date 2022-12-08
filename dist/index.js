"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const framework_1 = require("@sapphire/framework");
require("module-alias/register");
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const discord_js_1 = require("discord.js");
// import http from 'http';
dotenv_1.default.config();
mongoose_1.default.connect(process.env.MONGO_URI);
const client = new framework_1.SapphireClient({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.MessageContent,
        discord_js_1.GatewayIntentBits.DirectMessages,
        discord_js_1.GatewayIntentBits.GuildMembers,
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
