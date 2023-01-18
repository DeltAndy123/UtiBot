import { Command, ChatInputCommand, CommandOptionsRunTypeEnum } from '@sapphire/framework';
import { ChannelType, Collection, DiscordAPIError, Message, PermissionFlagsBits, TextChannel } from 'discord.js';

export class ClearCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      requiredUserPermissions: ['ManageMessages'],
      requiredClientPermissions: ['ManageMessages'],
      runIn: CommandOptionsRunTypeEnum.GuildAny,
      preconditions: ['CheckOverride'],
    });
  }

  public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName('clear')
        .setDescription('Clears a certain chat\'s messages')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addStringOption((option) =>
          option
            .setName('amount')
            .setDescription('The amount of messages to delete (1-100 or \'all\')')
            .setRequired(true)
        )
        .addChannelOption((option) =>
          option
            .setName('channel')
            .setDescription('The channel to delete messages from')
            .setRequired(false)
            .addChannelTypes(ChannelType.GuildText)
        )
        .addBooleanOption((option) =>
          option
            .setName('slow')
            .setDescription('Whether to bulk delete or delete one by one')
            .setRequired(false)
        )
    );
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {

    const { guild, channel }: any = interaction;
    var slow = interaction.options.getBoolean('slow') || false

    // Verify Clear Amount
    var clearAmount = interaction.options.getString('amount')
    var clearAmountInt = parseInt(clearAmount!)
    if (isNaN(clearAmountInt) && clearAmount !== 'all') {
      interaction.reply('Invalid clear amount. You can enter a number or `all`')
      return
    }
    if (clearAmountInt > 100 && clearAmount !== 'all') {
      interaction.reply('Invalid clear amount. Due to Discord\'s limitations, you can only enter numbers equal or less than `100`')
      return
    }
    if (clearAmountInt < 1 && clearAmount !== 'all') {
      interaction.reply('Invalid clear amount. You cannot enter a number less than `1`')
      return
    }

    // Verify Channel
    var channelId = interaction.options.getChannel('channel')?.id || channel!.id
    var deleteChannel: TextChannel = channel as TextChannel
    if (channelId !== 'current') {
      channelId = channelId!.replace(/\D/g, '')
      deleteChannel = guild!.channels.cache.get(channelId!) as TextChannel
    }
    if (!deleteChannel) {
      interaction.reply('Unknown channel. You have to enter the channel ID or type in `current`')
      return
    }

    // Delete the Messages
    if (clearAmount === 'all') {
      var channelMessages = (await deleteChannel.messages.fetch({ limit: 100 })).size
      await interaction.deferReply({ ephemeral: true })
      if (slow) {
        var msgs = await deleteChannel.messages.fetch()
        msgs.forEach(async (msg: any) => {
          await msg.delete()
          channelMessages--
          interaction.editReply({ content: `${channelMessages} messages left` })
          if (channelMessages === 0) interaction.editReply({ content: 'Messages deleted!' })
        })
      } else {
        // Bulk delete 100 messages until there are no more messages or 14 day limit is reached
        while(channelMessages > 0) {
          if (channelMessages != 0) {
            try {
              var msgs = await deleteChannel.messages.fetch({ limit: 100 })
              await deleteChannel.bulkDelete(msgs)
              channelMessages = (channelMessages - 100) < 0 ? 0 : (channelMessages - 100)
              interaction.editReply({ content: `${channelMessages} messages left` })
              if (channelMessages == 0) interaction.editReply({ content: 'Messages deleted!' })
            } catch (e: any) {
              if (e.message.includes('14 days')) {
                interaction.editReply({ content: 'Not all messages were deleted, as there is a 14 day limit. Use `/clear amount:all slow:True` to bypass this limit.' })
                break
              } else {
                interaction.editReply({ content: 'An error occurred while deleting messages' })
                break
              }
            }
          } else break
        }
      }
    } else {
      if (!slow) {
        deleteChannel.messages.fetch({ limit: clearAmountInt }).then((msgs: Collection<string, Message<true>>) => {
          deleteChannel.bulkDelete(msgs)
            .then(() => {
              if (interaction) {
                interaction.reply({ content: 'Messages deleted!', ephemeral: true })
              } else {
                channel.send('Messages deleted!')
                  .then((msg: Message) => {
                    setTimeout(() => {msg.delete()}, 3000)
                  })
              }
            })
            .catch((e: DiscordAPIError) => {
              if (e.message.includes('14 days')) {
                interaction.reply({ content: `Due to Discord's limitations, I can not delete any messages that are older than 2 weeks. Using \`/clear amount:all\` or \`/clear amount:<amount> slow:True\` can bypass that.`, ephemeral: true })
              }
            })
        })
      } else {
        var channelMessages: number = clearAmountInt
        await interaction.deferReply({ ephemeral: true })
        deleteChannel.messages.fetch({ limit: clearAmountInt }).then((msgs: any) => {
          msgs.forEach(async (msg: any) => {
            await msg.delete()
            channelMessages--
            await interaction.editReply({ content: `${channelMessages} messages left` })
            if (channelMessages === 0) interaction.editReply({ content: 'Messages deleted!' })
          })
        })
      }
    }

  }
}