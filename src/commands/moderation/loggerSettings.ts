import { Command, ChatInputCommand } from '@sapphire/framework';
import { StringSelectMenuOptionBuilder, StringSelectMenuBuilder } from '@discordjs/builders';
import { ActionRowBuilder, ChannelSelectMenuBuilder, ChannelType, PermissionFlagsBits } from 'discord.js';
import loggerSettingsSchema from '@schemas/loggerSettingsSchema';

export class LoggerSettingsCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      requiredUserPermissions: ['Administrator'],
      // requiredClientPermissions: ['SendMessages'],
    });
  }

  public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName('logger')
        .setDescription('Customize the logger')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false)
    );
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {

    const data: any = await loggerSettingsSchema.findOne({
      _id: interaction.guildId,
    });
    
    // Enable or disable logging
		const enableSelect = new StringSelectMenuBuilder()
      .setCustomId('enable')
      .setPlaceholder('Enable or disable logging')
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel('Enable')
          .setDescription('Enable logging')
          .setValue('enable')
          .setDefault(data?.enabled === true),
        new StringSelectMenuOptionBuilder()
          .setLabel('Disable')
          .setDescription('Disable logging')
          .setValue('disable')
          .setDefault(data?.enabled === false)
      )

    const selectedChannel = interaction.guild!.channels.cache.get(data?.channel);

    const channelSelect = new ChannelSelectMenuBuilder()
      .setCustomId('channel')
      .setPlaceholder(`Channel to log to${selectedChannel ? ` (current: ${selectedChannel.name})` : ''}`)
      .setChannelTypes([ChannelType.GuildText])

    const eventsSelect = new StringSelectMenuBuilder()
      .setCustomId('events')
      .setPlaceholder('Events to log')
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel('Message Delete')
          .setDescription('Log when a message is deleted')
          .setValue('message-delete')
          .setDefault(data?.events?.messageDelete || false),
        new StringSelectMenuOptionBuilder()
          .setLabel('Message Edit')
          .setDescription('Log when a message is edited')
          .setValue('message-edit')
          .setDefault(data?.events?.messageEdit || false),
        new StringSelectMenuOptionBuilder()
          .setLabel('Ghost Ping')
          .setDescription('Log when a ghost ping is detected')
          .setValue('ghost-ping')
          .setDefault(data?.events?.ghostPing || false),
        new StringSelectMenuOptionBuilder()
          .setLabel('Member Join')
          .setDescription('Log when a member joins')
          .setValue('member-join')
          .setDefault(data?.events?.memberJoin || false),
        new StringSelectMenuOptionBuilder()
          .setLabel('Member Leave')
          .setDescription('Log when a member leaves')
          .setValue('member-leave')
          .setDefault(data?.events?.memberLeave || false),
        new StringSelectMenuOptionBuilder()
          .setLabel('Imperonate Used')
          .setDescription('Log when the impersonate command is used')
          .setValue('impersonate-used')
          .setDefault(data?.events?.impersonateUsed || false)
      )
      .setMaxValues(6)
      .setMinValues(0)

    const enableRow = new ActionRowBuilder<StringSelectMenuBuilder>()
      .addComponents(enableSelect);

    const channelRow = new ActionRowBuilder<ChannelSelectMenuBuilder>()
      .addComponents(channelSelect);

    const eventsRow = new ActionRowBuilder<StringSelectMenuBuilder>()
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

  }
}