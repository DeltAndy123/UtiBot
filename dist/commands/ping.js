"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PingCommand = void 0;
const framework_1 = require("@sapphire/framework");
class PingCommand extends framework_1.Command {
    constructor(context, options) {
        super(context, Object.assign({}, options));
    }
    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) => builder
            .setName('ping')
            .setDescription('A ping command to test the discord bot'));
    }
    chatInputRun(interaction) {
        // Respond with the latency of the bot
        return interaction.reply(`Pong! (${this.container.client.ws.ping}ms)`);
    }
}
exports.PingCommand = PingCommand;
