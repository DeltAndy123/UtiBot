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
exports.ImpersonateCommand = void 0;
const framework_1 = require("@sapphire/framework");
const discord_js_1 = require("discord.js");
const loggerSettingsSchema_1 = __importDefault(require("@schemas/loggerSettingsSchema"));
class ImpersonateCommand extends framework_1.Command {
    constructor(context, options) {
        super(context, Object.assign(Object.assign({}, options), { requiredUserPermissions: ['ManageWebhooks'], requiredClientPermissions: ['Administrator'] }));
    }
    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) => builder
            .setName('impersonate')
            .setDescription('Send a message as another user')
            .addUserOption((option) => option
            .setName('user')
            .setDescription('The user to impersonate')
            .setRequired(true))
            .addStringOption((option) => option
            .setName('message')
            .setDescription('The message to send')
            .setRequired(true)));
    }
    chatInputRun(interaction) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { channel, guild } = interaction;
            const user = interaction.options.getUser('user', true);
            const message = interaction.options.getString('message', true);
            const webhook = yield channel.createWebhook({
                name: guild.members.cache.get(user.id).displayName,
                avatar: user.displayAvatarURL(),
            });
            const msg = yield webhook.send(message);
            yield webhook.delete();
            interaction.reply({ content: 'Message sent!', ephemeral: true });
            const data = yield loggerSettingsSchema_1.default.findOne({
                _id: interaction.guildId,
            });
            if ((data === null || data === void 0 ? void 0 : data.enabled) === true && (data === null || data === void 0 ? void 0 : data.channel) && ((_a = data === null || data === void 0 ? void 0 : data.events) === null || _a === void 0 ? void 0 : _a.impersonateUsed)) {
                const channel = guild.channels.cache.get(data.channel);
                if (channel) {
                    const embed = new discord_js_1.EmbedBuilder()
                        .setTitle('Impersonate Command')
                        .setColor(discord_js_1.Colors.Gold)
                        .setDescription(`**User <@${user.id}> was impersonated by <@${interaction.user.id}>**`)
                        .addFields([
                        { name: 'Link', value: `[Jump to message](https://discord.com/channels/${msg.guildId}/${msg.channelId}/${msg.id})` },
                        { name: 'Message', value: message }
                    ]);
                    channel.send({ embeds: [embed] });
                }
            }
        });
    }
}
exports.ImpersonateCommand = ImpersonateCommand;
