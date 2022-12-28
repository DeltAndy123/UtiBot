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
  public async run(oldMessage: Message, newMessage: Message) {

    if (oldMessage.author.bot) return;
    if (oldMessage.channel.isDMBased()) return;
    if (oldMessage.content === newMessage.content) return;

    const data: any = await loggerSettingsSchema.findOne({
      _id: oldMessage.guildId,
    });

    if (!data?.enabled) return;
    if (!data?.channel) return;

    const channel = oldMessage.guild!.channels.cache.get(data?.channel)! as GuildTextBasedChannel;

    if (!channel) return;

    var logEdit = false

    var ghostPing = false

    for (const [id, member] of oldMessage.mentions.members!) {
      if (!newMessage.mentions.members!.has(id)) ghostPing = true
    }

    for (const [id, role] of oldMessage.mentions.roles!) {
      if (!newMessage.mentions.roles!.has(id)) ghostPing = true
    }
    
    if (ghostPing) {
      if (data.events.ghostPing){
        const embed = new EmbedBuilder()
          .setTitle('Ghost Ping')
          .setColor(Colors.Red)
          .setDescription(`**Message sent by ${oldMessage.author} was edited in ${oldMessage.channel}**`)
          .addFields(
            {
              name: 'Link',
              value: `[Jump to message](https://discord.com/channels/${oldMessage.guildId}/${oldMessage.channelId}/${oldMessage.id})`,
            },
            {
              name: 'Message Before',
              value: oldMessage.content,
            },
            {
              name: 'New Message',
              value: newMessage.content,
            }
          )


        if (oldMessage.mentions.members?.size) {
          embed.addFields(
            {
              name: 'Mentioned Members',
              value: oldMessage.mentions.members.map((member) => member.toString()).join(' '),
            }
          )
        }

        if (oldMessage.mentions.roles?.size) {
          embed.addFields(
            {
              name: 'Mentioned Roles',
              value: oldMessage.mentions.roles.map((role) => role.toString()).join(' '),
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
        .setDescription(`**Message sent by ${oldMessage.author} was edited in ${oldMessage.channel}**`)
        .addFields(
          {
            name: 'Link',
            value: `[Jump to message](https://canary.discord.com/channels/${oldMessage.guildId}/${oldMessage.channelId}/${oldMessage.id})`,
          },
          {
            name: 'Message Before',
            value: oldMessage.content,
          },
          {
            name: 'New Message',
            value: oldMessage.reactions.message.content,
          }
        )

      channel.send({ embeds: [embed] });
    }

  }
}