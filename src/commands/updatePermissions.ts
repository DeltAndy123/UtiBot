import { Command, ChatInputCommand, CommandOptionsRunTypeEnum } from '@sapphire/framework';
import changePermissions from '@util/change-permissions';
import channelPermissions from '@util/channel-permissions';
import { GuildMember, Role, TextChannel, User } from 'discord.js';
const permissionTypes = Object.values(channelPermissions);

export class UpdatePermissionsCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      requiredUserPermissions: ['ManageRoles'],
      requiredClientPermissions: ['ManageRoles'],
      runIn: CommandOptionsRunTypeEnum.GuildText,
    });
  }

  public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName('update-permissions')
        .setDescription('Change the permissions of a channel')
        .addMentionableOption((option) =>
          option
            .setName('role')
            .setDescription('The role or member to change the permissions of')
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName('action')
            .setDescription('The value to change the permissions to')
            .setRequired(true)
            .addChoices(
              { name: 'Enabled', value: 'true' },
              { name: 'Disabled', value: 'false' },
              { name: 'Default', value: 'null' }
            )
        )
        .addStringOption((option) =>
          option
            .setName('permissions')
            .setDescription('The permissions to change (separated by spaces)')
            .setRequired(true)
        )
        .addChannelOption((option) =>
          option
            .setName('channel')
            .setDescription('The channel to change the permissions of')
            .setRequired(false)
        )
    );
  }

  public chatInputRun(interaction: Command.ChatInputCommandInteraction) {

    const { guild, channel } = interaction;

    const selectedChannel = interaction.options.getChannel('channel') || channel!;
    const role = interaction.options.getMentionable('role', true);
    const action = interaction.options.getString('action', true);
    
    const permissions = interaction.options.getString('permissions', true).split(' ');

    for (const permission of permissions) {
      if (!permissionTypes.includes(permission)) {
        return interaction.reply(`Invalid permission: ${permission}`);
      }
    }

    changePermissions(selectedChannel as TextChannel, role as Role | User, {
      enable: action === "true" ? permissions : [],
      null: action === "null" ? permissions : [],
      disable: action === "false" ? permissions : [],
    });

    interaction.reply(`Permissions updated for \`${
      role instanceof Role
        ? role.name
        : role instanceof GuildMember
        ? role.user.username
        : role
    }\` in ${selectedChannel}`)

  }
}