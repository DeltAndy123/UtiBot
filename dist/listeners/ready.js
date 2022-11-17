"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadyListener = void 0;
const framework_1 = require("@sapphire/framework");
class ReadyListener extends framework_1.Listener {
    constructor(context, options) {
        super(context, Object.assign(Object.assign({}, options), { once: true, event: framework_1.Events.ClientReady }));
    }
    run(client) {
        const { username, id, discriminator } = client.user;
        this.container.logger.info(`Successfully logged in as ${username}#${discriminator} (${id})`);
    }
}
exports.ReadyListener = ReadyListener;
