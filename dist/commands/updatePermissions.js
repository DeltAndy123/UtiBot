"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePermissionsCommand = void 0;
const framework_1 = require("@sapphire/framework");
const change_permissions_1 = __importDefault(require("@util/change-permissions"));
const channel_permissions_1 = __importDefault(require("@util/channel-permissions"));
const discord_js_1 = require("discord.js");
const permissionTypes = Object.values(channel_permissions_1.default);
class UpdatePermissionsCommand extends framework_1.Command {
    constructor(context, options) {
        super(context, Object.assign(Object.assign({}, options), { requiredUserPermissions: ['ManageRoles'], requiredClientPermissions: ['ManageRoles'], runIn: framework_1.CommandOptionsRunTypeEnum.GuildText }));
    }
    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) => builder
            .setName('update-permissions')
            .setDescription('Change the permissions of a channel')
            .addMentionableOption((option) => option
            .setName('role')
            .setDescription('The role or member to change the permissions of')
            .setRequired(true))
            .addStringOption((option) => option
            .setName('action')
            .setDescription('The value to change the permissions to')
            .setRequired(true)
            .addChoices({ name: 'Enabled', value: 'true' }, { name: 'Disabled', value: 'false' }, { name: 'Default', value: 'null' }))
            .addStringOption((option) => option
            .setName('permissions')
            .setDescription('The permissions to change (separated by spaces)')
            .setRequired(true))
            .addChannelOption((option) => option
            .setName('channel')
            .setDescription('The channel to change the permissions of')
            .setRequired(false)));
    }
    chatInputRun(interaction) {
        const { guild, channel } = interaction;
        const selectedChannel = interaction.options.getChannel('channel') || channel;
        const role = interaction.options.getMentionable('role', true);
        const action = interaction.options.getString('action', true);
        const permissions = interaction.options.getString('permissions', true).split(' ');
        for (const permission of permissions) {
            if (!permissionTypes.includes(permission)) {
                return interaction.reply(`Invalid permission: ${permission}`);
            }
        }
        (0, change_permissions_1.default)(selectedChannel, role, {
            enable: action === "true" ? permissions : [],
            null: action === "null" ? permissions : [],
            disable: action === "false" ? permissions : [],
        });
        interaction.reply(`Permissions updated for \`${role instanceof discord_js_1.Role
            ? role.name
            : role instanceof discord_js_1.GuildMember
                ? role.user.username
                : role}\` in ${selectedChannel}`);
    }
}
exports.UpdatePermissionsCommand = UpdatePermissionsCommand;
