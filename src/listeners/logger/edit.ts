import { Listener, Events } from '@sapphire/framework';
import { Message, EmbedBuilder, Colors, GuildTextBasedChannel } from 'discord.js';
import loggerSettingsSchema from '@schemas/loggerSettingsSchema';

export class LoggerEditListener extends Listener {
  public constructor(context: Listener.Context, options: Listener.Options) {
    super(context, {
      ...options,
      event: Events.MessageUpdate,
    });
  }
  public async run(message: Message) {

    if (message.author.bot) return;
    if (message.channel.isDMBased()) return;

    const data: any = await loggerSettingsSchema.findOne({
      _id: message.guildId,
    });

    if (!data?.enabled) return;
    if (!data?.channel) return;

    const channel = message.guild!.channels.cache.get(data?.channel)! as GuildTextBasedChannel;

    if (!channel) return;

    var logEdit = false
    
    if (message.mentions.members?.size || message.mentions.roles?.size) {
      if (data.events.ghostPing){
        const embed = new EmbedBuilder()
          .setTitle('Ghost Ping')
          .setColor(Colors.Red)
          .setDescription(`**Message sent by ${message.author} was edited in ${message.channel}**`)
          .addFields(
            {
              name: 'Link',
              value: `[Jump to message](https://discord.com/channels/${message.guildId}/${message.channelId}/${message.id})`,
            },
            {
              name: 'Message Before',
              value: message.content,
            },
            {
              name: 'New Message',
              value: message.reactions.message.content, // For some reason message.reactions.message is the new message
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
      } else logEdit = true
    } else if (data.events.messageEdit) logEdit = true

    if (logEdit) {
      const embed = new EmbedBuilder()
        .setTitle('Message Edit')
        .setColor(Colors.LightGrey)
        .setDescription(`**Message sent by ${message.author} was edited in ${message.channel}**`)
        .addFields(
          {
            name: 'Link',
            value: `[Jump to message](https://canary.discord.com/channels/${message.guildId}/${message.channelId}/${message.id})`,
          },
          {
            name: 'Message Before',
            value: message.content,
          },
          {
            name: 'New Message',
            value: message.reactions.message.content,
          }
        )

      channel.send({ embeds: [embed] });
    }

  }
}