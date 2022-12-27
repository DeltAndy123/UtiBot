import { Listener, Events, container } from '@sapphire/framework';
import { ButtonStyle, Message } from 'discord.js';
import pollSchema from '@schemas/pollSchema';
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from '@discordjs/builders';

export class PollEmbedRemovedListener extends Listener {
  public constructor(context: Listener.Context, options: Listener.Options) {
    super(context, {
      ...options,
      event: Events.MessageUpdate,
    });
  }
  public async run(oldMessage: Message, newMessage: Message) {

    if (oldMessage.author.id !== container.client.user?.id) return;
    if (oldMessage.embeds.length != 1) return;
    if (newMessage.embeds.length != 0) return;

    const poll = await pollSchema.findOne({
      messageId: oldMessage.id,
    });

    if (!poll) return;

    // ASk the user if they want to delete the poll or restore the embed
    // If they want to delete the poll, delete it
    // If they want to restore the embed, restore it
    const embed = new EmbedBuilder()
      .setTitle('Poll Embed Removed')
      .setDescription('The poll embed was removed. Do you want to end the poll or restore the embed?\n\n**You have 60 seconds to choose before the poll will be ended.**')

    const row = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('restorePoll')
          .setLabel('Restore Embed')
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId('endPoll')
          .setLabel('End Poll')
          .setStyle(ButtonStyle.Danger)
      )

    const reply = await newMessage.reply({ embeds: [embed], components: [row] })

    const collector = reply.createMessageComponentCollector({ time: 60 * 1000 });

    collector.on('collect', async (interaction) => {
      if (interaction.message.author.id !== container.client.user?.id) return;
      if (interaction.user.id !== poll.author) {
        interaction.reply({ content: 'You are not the creator of this poll', ephemeral: true });
        return;
      }
      if (interaction.customId === 'restorePoll') {
        oldMessage.edit({ embeds: [...oldMessage.embeds] });
        reply.delete();
      }
      if (interaction.customId === 'endPoll') {
        const poll = await pollSchema.findOneAndDelete({
          messageId: oldMessage.id,
        });

        const newEmbed = new EmbedBuilder()
          .setTitle(oldMessage.embeds[0].title)
          .setDescription(oldMessage.embeds[0].description)
          .setFooter(oldMessage.embeds[0].footer)
          .setColor(oldMessage.embeds[0].color)

        if (!poll) return;
        
        const winners = Object.keys(poll.votes).filter((o: any) => poll.votes[o].length == Math.max(...poll.votes.map(o => o.length)));

        if (winners.length > 1) {
          newEmbed.addFields({ name: 'Winners', value: winners.map((winner) => poll.options[parseInt(winner)]).join(', ') });
        } else {
          newEmbed.addFields({ name: 'Winner', value: poll.options[parseInt(winners[0])] });
        }

        oldMessage.edit({ content: '**Poll ended**', embeds: [newEmbed], components: [] });

        interaction.deferUpdate();
        reply.delete();
      }
    })

    collector.on('end', async () => {
      const poll = await pollSchema.findOneAndDelete({
        messageId: oldMessage.id,
      });

      const newEmbed = new EmbedBuilder()
        .setTitle(oldMessage.embeds[0].title)
        .setDescription(oldMessage.embeds[0].description)
        .setFooter(oldMessage.embeds[0].footer)
        .setColor(oldMessage.embeds[0].color)

      if (!poll) return;
      
      const winners = Object.keys(poll.votes).filter((o: any) => poll.votes[o].length == Math.max(...poll.votes.map(o => o.length)));

      if (winners.length > 1) {
        newEmbed.addFields({ name: 'Winners', value: winners.map((winner) => poll.options[parseInt(winner)]).join(', ') });
      } else {
        newEmbed.addFields({ name: 'Winner', value: poll.options[parseInt(winners[0])] });
      }

      oldMessage.edit({ content: '**Poll ended**', embeds: [newEmbed], components: [] });

      reply.delete();
    })

  }
}