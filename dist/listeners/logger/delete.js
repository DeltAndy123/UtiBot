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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerDeleteListener = void 0;
const framework_1 = require("@sapphire/framework");
const discord_js_1 = require("discord.js");
const loggerSettingsSchema_1 = __importDefault(require("@schemas/loggerSettingsSchema"));
class LoggerDeleteListener extends framework_1.Listener {
    constructor(context, options) {
        super(context, Object.assign(Object.assign({}, options), { event: framework_1.Events.MessageDelete }));
    }
    run(message) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            if (message.author.bot)
                return;
            if (message.channel.isDMBased())
                return;
            const data = yield loggerSettingsSchema_1.default.findOne({
                _id: message.guildId,
            });
            if (!(data === null || data === void 0 ? void 0 : data.enabled))
                return;
            if (!(data === null || data === void 0 ? void 0 : data.channel))
                return;
            const channel = message.guild.channels.cache.get(data === null || data === void 0 ? void 0 : data.channel);
            if (!channel)
                return;
            var logDelete = false;
            if (((_a = message.mentions.members) === null || _a === void 0 ? void 0 : _a.size) || ((_b = message.mentions.roles) === null || _b === void 0 ? void 0 : _b.size)) {
                if (data.events.ghostPing) {
                    const embed = new discord_js_1.EmbedBuilder()
                        .setTitle('Ghost Ping')
                        .setColor(discord_js_1.Colors.Red)
                        .setDescription(`**Message sent by ${message.author} was deleted in ${message.channel}**`)
                        .addFields({
                        name: 'Message',
                        value: message.content,
                    });
                    if ((_c = message.mentions.members) === null || _c === void 0 ? void 0 : _c.size) {
                        embed.addFields({
                            name: 'Mentioned Members',
                            value: message.mentions.members.map((member) => member.toString()).join(' '),
                        });
                    }
                    if ((_d = message.mentions.roles) === null || _d === void 0 ? void 0 : _d.size) {
                        embed.addFields({
                            name: 'Mentioned Roles',
                            value: message.mentions.roles.map((role) => role.toString()).join(' '),
                        });
                    }
                    channel.send({ embeds: [embed] });
                }
                else
                    logDelete = true;
            }
            else if (data.events.messageDelete)
                logDelete = true;
            if (logDelete) {
                const embed = new discord_js_1.EmbedBuilder()
                    .setTitle('Message Delete')
                    .setColor(discord_js_1.Colors.LightGrey)
                    .setDescription(`**Message sent by ${message.author} was deleted in ${message.channel}**`)
                    .addFields({
                    name: 'Message',
                    value: message.content,
                });
                channel.send({ embeds: [embed] });
            }
        });
    }
}
exports.LoggerDeleteListener = LoggerDeleteListener;
