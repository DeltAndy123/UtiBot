import { Command, ChatInputCommand, CommandOptionsRunTypeEnum } from '@sapphire/framework';
import { ChannelType, DMChannel, GuildChannel, GuildMember, PermissionFlagsBits, Role, TextChannel, User } from 'discord.js';

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
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
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
            .addChannelTypes(
              ChannelType.GuildText,
              ChannelType.GuildVoice,
              ChannelType.GuildCategory,
              ChannelType.GuildAnnouncement,
              ChannelType.GuildForum,
            )
        )
    );
  }

  public chatInputRun(interaction: Command.ChatInputCommandInteraction) {

    if (!interaction.guild) return interaction.reply('This command can only be used in a guild');

    const { guild, channel } = interaction;

    const selectedChannel = interaction.options.getChannel('channel') || channel!;
    const role = interaction.options.getMentionable('role', true);
    const action = interaction.options.getString('action', true);
    
    const permissions = interaction.options.getString('permissions', true).split(' ');

    for (const permission of permissions) {
      if (permission in PermissionFlagsBits === false) {
        return interaction.reply(`Invalid permission: ${permission}`);
      }
    }

    (selectedChannel as GuildChannel).permissionOverwrites.edit(
      (role as GuildMember | Role).id, 
      permissions.reduce((acc, permission) => {
        if (action === 'true') {
          acc[permission] = true;
        } else if (action === 'false') {
          acc[permission] = false;
        } else {
          acc[permission] = null;
        }
        return acc;
      }, {} as Record<string, boolean | null>)
    );

    interaction.reply(`Permissions updated for \`${
      role instanceof Role
        ? role.name
        : role instanceof GuildMember
        ? role.user.username
        : role
    }\` in ${selectedChannel}`)

  }
}