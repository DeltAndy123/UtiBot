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
    
    const invites = await member.guild.invites.fetch();
    const invite = invites.find((i) => global.inviteJoins[i.code] < i.uses!);
    
    if (invite) global.inviteJoins[invite!.code] = invite!.uses!;
    
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
      .addFields(
        { name: 'Invite Used', value: invite ? `${invite.code} (${invite.uses} uses)` : 'Unknown' },
        { name: 'Inviter', value: invite?.inviter ? `${invite.inviter.tag} (<@${invite.inviter.id}>)` : 'Unknown' }
      )
      .setThumbnail(member.user.displayAvatarURL())
      .setTimestamp();

    (channel as GuildTextBasedChannel).send({ embeds: [embed] });

  }
}