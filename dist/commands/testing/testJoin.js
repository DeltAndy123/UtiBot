"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CmdNameCommand = void 0;
const framework_1 = require("@sapphire/framework");
class CmdNameCommand extends framework_1.Command {
    constructor(context, options) {
        super(context, Object.assign(Object.assign({}, options), { preconditions: ['OwnerOnly'] }));
    }
    registerApplicationCommands(registry) {
        var _a;
        registry.registerChatInputCommand((builder) => builder
            .setName('testjoin')
            .setDescription('Test join event')
            .addUserOption((option) => option
            .setName('user')
            .setDescription('The user to test join event with')
            .setRequired(false)), { guildIds: (_a = process.env.GUILD_IDS) === null || _a === void 0 ? void 0 : _a.split(', ') });
    }
    chatInputRun(interaction) {
        var _a;
        const user = interaction.options.getUser('user') || interaction.user;
        global.client.emit(framework_1.Events.GuildMemberAdd, (_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.members.cache.get(user.id));
        interaction.reply({ content: 'Emitted member join', ephemeral: true });
    }
}
exports.CmdNameCommand = CmdNameCommand;
