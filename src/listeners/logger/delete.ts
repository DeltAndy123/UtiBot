import { Listener, Events } from '@sapphire/framework';
import { Message, EmbedBuilder, Colors, GuildTextBasedChannel } from 'discord.js';
import loggerSettingsSchema from '@schemas/loggerSettingsSchema';
import { EmbedFieldMax } from '@util/consts';

export class LoggerDeleteListener extends Listener {
  public constructor(context: Listener.Context, options: Listener.Options) {
    super(context, {
      ...options,
      event: Events.MessageDelete,
    });
  }
  public async run(message: Message) {

    if (message.author.bot) return;
    if (message.channel.isDMBased()) return;
    if (message.content === '') return;

    const data: any = await loggerSettingsSchema.findOne({
      _id: message.guildId,
    });

    if (!data?.enabled) return;
    if (!data?.channel) return;

    const channel = message.guild!.channels.cache.get(data?.channel)! as GuildTextBasedChannel;

    if (!channel) return;

    var logDelete = false
    
    if (message.mentions.members?.size || message.mentions.roles?.size) {
      if (data.events.ghostPing) {
        var embedMsg = message.content
        if (embedMsg.length > EmbedFieldMax) embedMsg = embedMsg.slice(0, EmbedFieldMax - 3) + '...'

        const embed = new EmbedBuilder()
          .setTitle('Ghost Ping')
          .setColor(Colors.Red)
          .setDescription(`**Message sent by ${message.author} was deleted in ${message.channel}**`)
          .addFields(
            {
              name: 'Message',
              value: embedMsg,
            }
          )


        if (message.mentions.members?.size) {
          embed.addFields(
            {
              name: 'Mentioned Members',
              value: message.mentions.members.map((member) => member.toString()).join(' '),
            }
          )
        }

        if (message.mentions.roles?.size) {
          embed.addFields(
            {
              name: 'Mentioned Roles',
              value: message.mentions.roles.map((role) => role.toString()).join(' '),
            }
          )
        }

        channel.send({ embeds: [embed] });
      } else logDelete = true
    } else if (data.events.messageDelete) logDelete = true

    if (logDelete) {
      var embedMsg = message.content
      if (embedMsg.length > EmbedFieldMax) embedMsg = embedMsg.slice(0, EmbedFieldMax - 3) + '...'

      const embed = new EmbedBuilder()
        .setTitle('Message Delete')
        .setColor(Colors.LightGrey)
        .setDescription(`**Message sent by ${message.author} was deleted in ${message.channel}**`)
        .addFields(
          {
            name: 'Message',
            value: embedMsg,
          }
        )

      channel.send({ embeds: [embed] });
    }

  }
}