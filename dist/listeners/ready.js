"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadyListener = void 0;
const framework_1 = require("@sapphire/framework");
const discord_js_1 = require("discord.js");
class ReadyListener extends framework_1.Listener {
    constructor(context, options) {
        super(context, Object.assign(Object.assign({}, options), { once: true, event: framework_1.Events.ClientReady }));
    }
    run(client) {
        const { username, id, discriminator } = client.user;
        this.container.logger.info(`Successfully logged in as ${username}#${discriminator} (${id})`);
        global.inviteJoins = {};
        client.guilds.cache.forEach((guild) => __awaiter(this, void 0, void 0, function* () {
            if (!guild.members.cache.get(client.user.id).permissions.has(discord_js_1.PermissionFlagsBits.ManageGuild))
                return;
            const guildInvites = yield guild.invites.fetch();
            guildInvites.forEach((invite) => {
                global.inviteJoins[invite.code] = invite.uses || 0;
            });
        }));
    }
}
exports.ReadyListener = ReadyListener;
