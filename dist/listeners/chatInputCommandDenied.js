"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatInputCommandDeniedListener = void 0;
const framework_1 = require("@sapphire/framework");
class ChatInputCommandDeniedListener extends framework_1.Listener {
    constructor(context, options) {
        super(context, Object.assign(Object.assign({}, options), { once: true, event: framework_1.Events.ChatInputCommandDenied }));
    }
    run(error, { interaction }) {
        return interaction.reply({ content: error.message, ephemeral: true });
    }
}
exports.ChatInputCommandDeniedListener = ChatInputCommandDeniedListener;
