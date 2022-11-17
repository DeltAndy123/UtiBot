import { Listener, Events } from '@sapphire/framework';
import { Colors, EmbedBuilder, GuildMember, GuildTextBasedChannel } from 'discord.js';
import loggerSettingsSchema from '@schemas/loggerSettingsSchema';

export class LoggerJoinListener extends Listener {
  public constructor(context: Listener.Context, options: Listener.Options) {
    super(context, {
      ...options,
      event: Events.GuildMemberAdd,
    });
  }
  public async run(member: GuildMember) {

    const data: any = await loggerSettingsSchema.findOne({
      _id: member.guild.id,
    });

    if (!data?.enabled) return;
    if (!data?.channel) return;

    const channel = member.guild.channels.cache.get(data?.channel)!;

    if (!channel) return;
    if (!data.events.memberJoin) return;

    const embed = new EmbedBuilder()
      .setTitle('Member Joined')
      .setColor(Colors.Green)
      .setDescription(`**${member.user.tag}** (<@${member.user.id}>) has joined the server`)
      .setThumbnail(member.user.displayAvatarURL())
      .setTimestamp();

    (channel as GuildTextBasedChannel).send({ embeds: [embed] });

  }
}