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
exports.LoggerJoinListener = void 0;
const framework_1 = require("@sapphire/framework");
const discord_js_1 = require("discord.js");
const loggerSettingsSchema_1 = __importDefault(require("@schemas/loggerSettingsSchema"));
class LoggerJoinListener extends framework_1.Listener {
    constructor(context, options) {
        super(context, Object.assign(Object.assign({}, options), { event: framework_1.Events.GuildMemberAdd }));
    }
    run(member) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield loggerSettingsSchema_1.default.findOne({
                _id: member.guild.id,
            });
            if (!(data === null || data === void 0 ? void 0 : data.enabled))
                return;
            if (!(data === null || data === void 0 ? void 0 : data.channel))
                return;
            const channel = member.guild.channels.cache.get(data === null || data === void 0 ? void 0 : data.channel);
            if (!channel)
                return;
            if (!data.events.memberJoin)
                return;
            const embed = new discord_js_1.EmbedBuilder()
                .setTitle('Member Joined')
                .setColor(discord_js_1.Colors.Green)
                .setDescription(`**${member.user.tag}** (<@${member.user.id}>) has joined the server`)
                .setThumbnail(member.user.displayAvatarURL())
                .setTimestamp();
            channel.send({ embeds: [embed] });
        });
    }
}
exports.LoggerJoinListener = LoggerJoinListener;
