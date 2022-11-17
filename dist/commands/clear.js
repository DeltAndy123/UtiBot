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
exports.ClearCommand = void 0;
const framework_1 = require("@sapphire/framework");
const discord_js_1 = require("discord.js");
class ClearCommand extends framework_1.Command {
    constructor(context, options) {
        super(context, Object.assign(Object.assign({}, options), { requiredUserPermissions: ['ManageMessages'], requiredClientPermissions: ['ManageMessages'] }));
    }
    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) => builder
            .setName('clear')
            .setDescription('Clears a certain chat\'s messages')
            .addStringOption((option) => option
            .setName('amount')
            .setDescription('The amount of messages to delete (1-100 or \'all\')')
            .setRequired(true))
            .addChannelOption((option) => option
            .setName('channel')
            .setDescription('The channel to delete messages from')
            .setRequired(false)
            .addChannelTypes(discord_js_1.ChannelType.GuildText))
            .addBooleanOption((option) => option
            .setName('slow')
            .setDescription('Whether to bulk delete or delete one by one')
            .setRequired(false)));
    }
    chatInputRun(interaction) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { guild, channel } = interaction;
            var slow = interaction.options.getBoolean('slow') || false;
            // Verify Clear Amount
            var clearAmount = interaction.options.getString('amount');
            var clearAmountInt = parseInt(clearAmount);
            if (isNaN(clearAmountInt) && clearAmount !== 'all') {
                interaction.reply('Invalid clear amount. You can enter a number or `all`');
                return;
            }
            if (clearAmountInt > 100 && clearAmount !== 'all') {
                interaction.reply('Invalid clear amount. Due to Discord\'s limitations, you can only enter numbers equal or less than `100`');
                return;
            }
            if (clearAmountInt < 1 && clearAmount !== 'all') {
                interaction.reply('Invalid clear amount. You cannot enter a number less than `1`');
                return;
            }
            // Verify Channel
            var channelId = ((_a = interaction.options.getChannel('channel')) === null || _a === void 0 ? void 0 : _a.id) || channel.id;
            var deleteChannel = channel;
            if (channelId !== 'current') {
                channelId = channelId.replace(/\D/g, '');
                deleteChannel = guild.channels.cache.get(channelId);
            }
            if (!deleteChannel) {
                interaction.reply('Unknown channel. You have to enter the channel ID or type in `current`');
                return;
            }
            // Delete the Messages
            if (clearAmount === 'all') {
                var channelMessages = (yield deleteChannel.messages.fetch({ limit: 100 })).size;
                yield interaction.deferReply({ ephemeral: true });
                if (slow) {
                    var msgs = yield deleteChannel.messages.fetch();
                    msgs.forEach((msg) => __awaiter(this, void 0, void 0, function* () {
                        yield msg.delete();
                        channelMessages--;
                        interaction.editReply({ content: `${channelMessages} messages left` });
                        if (channelMessages === 0)
                            interaction.editReply({ content: 'Messages deleted!' });
                    }));
                }
                else {
                    // Bulk delete 100 messages until there are no more messages or 14 day limit is reached
                    while (channelMessages > 0) {
                        if (channelMessages != 0) {
                            try {
                                yield deleteChannel.bulkDelete(100);
                                channelMessages = (channelMessages - 100) < 0 ? 0 : (channelMessages - 100);
                                interaction.editReply({ content: `${channelMessages} messages left` });
                                if (channelMessages == 0)
                                    interaction.editReply({ content: 'Messages deleted!' });
                            }
                            catch (e) {
                                if (e.message.includes('14 days')) {
                                    interaction.editReply({ content: 'Not all messages were deleted, as there is a 14 day limit. Use `/clear amount:all slow:True` to bypass this limit.' });
                                    break;
                                }
                                else {
                                    interaction.editReply({ content: 'An error occurred while deleting messages' });
                                    break;
                                }
                            }
                        }
                        else
                            break;
                    }
                }
            }
            else {
                if (!slow) {
                    deleteChannel.messages.fetch({ limit: clearAmountInt }).then((msgs) => {
                        deleteChannel.bulkDelete(msgs)
                            .then(() => {
                            if (interaction) {
                                interaction.reply({ content: 'Messages deleted!', ephemeral: true });
                            }
                            else {
                                channel.send('Messages deleted!')
                                    .then((msg) => {
                                    setTimeout(() => { msg.delete(); }, 3000);
                                });
                            }
                        })
                            .catch((e) => {
                            if (e.message.includes('14 days')) {
                                interaction.reply({ content: `Due to Discord's limitations, I can not delete any messages that are older than 2 weeks. Using \`/clear amount:all\` or \`/clear amount:<amount> slow:True\` can bypass that.`, ephemeral: true });
                            }
                        });
                    });
                }
                else {
                    var channelMessages = clearAmountInt;
                    yield interaction.deferReply({ ephemeral: true });
                    deleteChannel.messages.fetch({ limit: clearAmountInt }).then((msgs) => {
                        msgs.forEach((msg) => __awaiter(this, void 0, void 0, function* () {
                            yield msg.delete();
                            channelMessages--;
                            yield interaction.editReply({ content: `${channelMessages} messages left` });
                            if (channelMessages === 0)
                                interaction.editReply({ content: 'Messages deleted!' });
                        }));
                    });
                }
            }
        });
    }
}
exports.ClearCommand = ClearCommand;
