import { Command, ChatInputCommand, CommandOptionsRunTypeEnum } from '@sapphire/framework';
import { Channel, ChannelType, Colors, DMChannel, EmbedBuilder, Guild, PermissionFlagsBits, TextChannel, Webhook } from 'discord.js';
import loggerSettingsSchema from '@schemas/loggerSettingsSchema';

export class ImpersonateCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      requiredUserPermissions: ['ManageWebhooks'],
      requiredClientPermissions: ['ManageWebhooks'],
      runIn: CommandOptionsRunTypeEnum.GuildAny,
      preconditions: ['CheckOverride'],
    });
  }

  public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName('impersonate')
        .setDescription('Send a message as another user')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageWebhooks)
        .addUserOption((option) =>
          option
            .setName('user')
            .setDescription('The user to impersonate')
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName('message')
            .setDescription('The message to send')
            .setRequired(true)
        )
    );
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {

    var { channel, guild }: {
      channel: Channel | null,
      guild: Guild | null
    } = interaction;
    if (!channel) return;
    if (channel.type == ChannelType.DM
      || channel.type == ChannelType.GuildVoice
      || channel.type == ChannelType.GuildStageVoice) return;
    if (channel.isThread()) {
      if (!channel.parent) return;
      channel = channel.parent;
    }
    if (!guild) return;

    const user = interaction.options.getUser('user', true);
    const message = interaction.options.getString('message', true);

    const webhook: Webhook = await channel.createWebhook({
      name: guild.members.cache.get(user.id)!.displayName,
      avatar: user.displayAvatarURL(),
    });

    const msg = await webhook.send(message);

    await webhook.delete();

    interaction.reply({ content: 'Message sent!', ephemeral: true });

    const data = await loggerSettingsSchema.findOne({
      _id: interaction.guildId,
    });

    if (data?.enabled === true && data?.channel && data?.events?.impersonateUsed) {
      const channel = guild.channels.cache.get(data.channel) as TextChannel;
      if (channel) {
        const embed = new EmbedBuilder()
          .setTitle('Impersonate Command')
          .setColor(Colors.Gold)
          .setDescription(`**User <@${user.id}> was impersonated by <@${interaction.user.id}>**`)
          .addFields([
            { name: 'Link', value: `[Jump to message](https://discord.com/channels/${msg.guildId}/${msg.channelId}/${msg.id})` },
            { name: 'Message', value: message }
          ])

        channel.send({ embeds: [embed] });

      }
    }

  }
}