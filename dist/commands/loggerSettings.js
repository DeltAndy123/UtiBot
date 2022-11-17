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
exports.LoggerSettingsCommand = void 0;
const framework_1 = require("@sapphire/framework");
const builders_1 = require("@discordjs/builders");
const discord_js_1 = require("discord.js");
const loggerSettingsSchema_1 = __importDefault(require("@schemas/loggerSettingsSchema"));
class LoggerSettingsCommand extends framework_1.Command {
    constructor(context, options) {
        super(context, Object.assign(Object.assign({}, options), { requiredUserPermissions: ['Administrator'] }));
    }
    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) => builder
            .setName('logger')
            .setDescription('Customize the logger')
            .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.Administrator)
            .setDMPermission(false));
    }
    chatInputRun(interaction) {
        var _a, _b, _c, _d, _e, _f;
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield loggerSettingsSchema_1.default.findOne({
                _id: interaction.guildId,
            });
            // Enable or disable logging
            const enableSelect = new builders_1.StringSelectMenuBuilder()
                .setCustomId('enable')
                .setPlaceholder('Enable or disable logging')
                .addOptions(new builders_1.StringSelectMenuOptionBuilder()
                .setLabel('Enable')
                .setDescription('Enable logging')
                .setValue('enable')
                .setDefault((data === null || data === void 0 ? void 0 : data.enabled) === true), new builders_1.StringSelectMenuOptionBuilder()
                .setLabel('Disable')
                .setDescription('Disable logging')
                .setValue('disable')
                .setDefault((data === null || data === void 0 ? void 0 : data.enabled) === false));
            const selectedChannel = interaction.guild.channels.cache.get(data === null || data === void 0 ? void 0 : data.channel);
            const channelSelect = new discord_js_1.ChannelSelectMenuBuilder()
                .setCustomId('channel')
                .setPlaceholder(`Channel to log to${selectedChannel ? ` (current: ${selectedChannel.name})` : ''}`)
                .setChannelTypes([discord_js_1.ChannelType.GuildText]);
            const eventsSelect = new builders_1.StringSelectMenuBuilder()
                .setCustomId('events')
                .setPlaceholder('Events to log')
                .addOptions(new builders_1.StringSelectMenuOptionBuilder()
                .setLabel('Message Delete')
                .setDescription('Log when a message is deleted')
                .setValue('message-delete')
                .setDefault(((_a = data === null || data === void 0 ? void 0 : data.events) === null || _a === void 0 ? void 0 : _a.messageDelete) || false), new builders_1.StringSelectMenuOptionBuilder()
                .setLabel('Message Edit')
                .setDescription('Log when a message is edited')
                .setValue('message-edit')
                .setDefault(((_b = data === null || data === void 0 ? void 0 : data.events) === null || _b === void 0 ? void 0 : _b.messageEdit) || false), new builders_1.StringSelectMenuOptionBuilder()
                .setLabel('Ghost Ping')
                .setDescription('Log when a ghost ping is detected')
                .setValue('ghost-ping')
                .setDefault(((_c = data === null || data === void 0 ? void 0 : data.events) === null || _c === void 0 ? void 0 : _c.ghostPing) || false), new builders_1.StringSelectMenuOptionBuilder()
                .setLabel('Member Join')
                .setDescription('Log when a member joins')
                .setValue('member-join')
                .setDefault(((_d = data === null || data === void 0 ? void 0 : data.events) === null || _d === void 0 ? void 0 : _d.memberJoin) || false), new builders_1.StringSelectMenuOptionBuilder()
                .setLabel('Member Leave')
                .setDescription('Log when a member leaves')
                .setValue('member-leave')
                .setDefault(((_e = data === null || data === void 0 ? void 0 : data.events) === null || _e === void 0 ? void 0 : _e.memberLeave) || false), new builders_1.StringSelectMenuOptionBuilder()
                .setLabel('Imperonate Used')
                .setDescription('Log when the impersonate command is used')
                .setValue('impersonate-used')
                .setDefault(((_f = data === null || data === void 0 ? void 0 : data.events) === null || _f === void 0 ? void 0 : _f.impersonateUsed) || false))
                .setMaxValues(6)
                .setMinValues(0);
            const enableRow = new discord_js_1.ActionRowBuilder()
                .addComponents(enableSelect);
            const channelRow = new discord_js_1.ActionRowBuilder()
                .addComponents(channelSelect);
            const eventsRow = new discord_js_1.ActionRowBuilder()
                .addComponents(eventsSelect);
            interaction.reply({
                content: 'Settings for the logger',
                components: [
                    enableRow,
                    channelRow,
                    eventsRow
                ],
                ephemeral: true
            });
        });
    }
}
exports.LoggerSettingsCommand = LoggerSettingsCommand;
