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
exports.LoggerSettingsChangeListener = void 0;
const framework_1 = require("@sapphire/framework");
const loggerSettingsSchema_1 = __importDefault(require("@schemas/loggerSettingsSchema"));
class LoggerSettingsChangeListener extends framework_1.Listener {
    constructor(context, options) {
        super(context, Object.assign(Object.assign({}, options), { event: framework_1.Events.InteractionCreate }));
    }
    run(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!interaction.isAnySelectMenu())
                return;
            const data = yield loggerSettingsSchema_1.default.findOne({
                _id: interaction.guildId,
            });
            if (interaction.isStringSelectMenu()) {
                switch (interaction.customId) {
                    case 'enable':
                        yield loggerSettingsSchema_1.default.findOneAndUpdate({
                            _id: interaction.guildId,
                        }, {
                            _id: interaction.guildId,
                            channel: data === null || data === void 0 ? void 0 : data.channel,
                            enabled: interaction.values[0] === 'enable' ? true : false,
                            events: data === null || data === void 0 ? void 0 : data.events,
                        }, {
                            upsert: true,
                        });
                        break;
                    case 'events':
                        yield loggerSettingsSchema_1.default.findOneAndUpdate({
                            _id: interaction.guildId,
                        }, {
                            _id: interaction.guildId,
                            channel: data === null || data === void 0 ? void 0 : data.channel,
                            enabled: data === null || data === void 0 ? void 0 : data.enabled,
                            events: {
                                messageDelete: interaction.values.includes('message-delete') ? true : false,
                                messageEdit: interaction.values.includes('message-edit') ? true : false,
                                ghostPing: interaction.values.includes('ghost-ping') ? true : false,
                                memberJoin: interaction.values.includes('member-join') ? true : false,
                                memberLeave: interaction.values.includes('member-leave') ? true : false,
                                impersonateUsed: interaction.values.includes('impersonate-used') ? true : false,
                            },
                        }, {
                            upsert: true,
                        });
                        break;
                }
            }
            if (interaction.isChannelSelectMenu()) {
                const channel = interaction.channels.first();
                switch (interaction.customId) {
                    case 'channel':
                        yield loggerSettingsSchema_1.default.findOneAndUpdate({
                            _id: interaction.guildId,
                        }, {
                            _id: interaction.guildId,
                            channel: channel.id,
                            enabled: data === null || data === void 0 ? void 0 : data.enabled,
                            events: data === null || data === void 0 ? void 0 : data.events,
                        }, {
                            upsert: true,
                        });
                        break;
                }
            }
            interaction.reply({ content: 'Settings updated!', ephemeral: true });
        });
    }
}
exports.LoggerSettingsChangeListener = LoggerSettingsChangeListener;
