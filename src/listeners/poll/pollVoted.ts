import { Listener, Events } from '@sapphire/framework';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Interaction, User } from 'discord.js';
import pollSchema from '@schemas/pollSchema';
import { EmbedBuilder } from '@discordjs/builders';

const removeRow = new ActionRowBuilder<ButtonBuilder>()
  .addComponents(
    new ButtonBuilder()
      .setCustomId('poll-removeVote')
      .setLabel('Remove Vote')
      .setStyle(ButtonStyle.Danger)
  )

export class PollVotedListener extends Listener {
  public constructor(context: Listener.Context, options: Listener.Options) {
    super(context, {
      ...options,
      event: Events.InteractionCreate,
    });
  }
  public async run(interaction: Interaction) {

    if (!interaction.isButton()) return;
    if (!interaction.customId.startsWith('poll')) return;

    const message = interaction.message.embeds.length ? interaction.message : (await interaction.channel?.messages.fetch(interaction.message.reference?.messageId!))!;
    const buttonId = interaction.customId.split('-')[1];
    const oldEmbed = message.embeds[0]
    if (!oldEmbed) return;
    const poll = await pollSchema.findById(oldEmbed.footer?.text?.match(/Poll ID: (.*)/)?.[1]);

    if (!poll) return;

    const author = interaction.guild?.members.cache.get(poll.author);

    if (buttonId === 'removeVote') {
      const vote = poll.votes.find((option) => option.includes(interaction.user.id));
      if (vote) {
        const index = poll.votes.indexOf(vote);
        poll.votes[index] = poll.votes[index].filter((user: String) => user !== interaction.user.id);

        const embed = new EmbedBuilder()
          .setTitle(poll.question)
          .setDescription(poll.options.map((option, index) => `${index + 1}. ${option} (${poll.votes[index].length} votes)`).join('\n'))
          .setColor(oldEmbed.color)
          .setFooter({ text: `Poll created by ${author ? author.user.tag : 'UNKNOWN'} • Poll ID: ${poll._id}` })

        message.edit({ embeds: [embed], components: message.components });

        await poll.updateOne(poll);
        if (interaction.message.id != message.id) {
          interaction.update({ content: 'Vote removed', components: [] });
        } else {
          interaction.reply({ content: 'Vote removed', ephemeral: true });
        }
        return;
      }
      if (interaction.message.id != message.id) {
        interaction.update({ content: 'You did not vote yet', components: [] });
      } else {
        interaction.reply({ content: 'You did not vote yet', ephemeral: true });
      }
      return;
    }

    if (buttonId === 'end') {
      if (interaction.user.id !== poll.author) return interaction.reply({ content: 'You are not the creator of this poll', ephemeral: true });
      const embed = new EmbedBuilder()
        .setTitle(poll.question)
        .setDescription(poll.options.map((option, index) => `${index + 1}. ${option} (${poll.votes[index].length} votes)`).join('\n'))
        .setColor(oldEmbed.color)
        .setFooter({ text: `Poll created by ${author ? author.user.tag : 'UNKNOWN'} • Poll ID: ${poll._id}` })
        
      const winners = Object.keys(poll.votes).filter((o: any) => poll.votes[o].length == Math.max(...poll.votes.map(o => o.length)));

      if (winners.length > 1) {
        embed.addFields({ name: 'Winners', value: winners.map((winner) => poll.options[parseInt(winner)]).join(', ') });
      } else {
        embed.addFields({ name: 'Winner', value: poll.options[parseInt(winners[0])] });
      }

      message.edit({ embeds: [embed], components: [] });
      interaction.message.edit({ content: '**Poll ended**', components: [] });

      interaction.deferUpdate();

      await poll.deleteOne();
      return;
    }

    if (buttonId === 'viewVotes') {
      const embed = new EmbedBuilder()
        .setTitle(poll.question)
        .setColor(oldEmbed.color)
        .setFooter({ text: `Poll created by ${author ? author.user.tag : 'UNKNOWN'} • Poll ID: ${poll._id}` })
        
      poll.votes.forEach((option, index) => {
        if (option.length > 0) {
          embed.addFields({ name: poll.options[index], value: option.map((user: String) => `<@${user}>`).join(', ') });
        }
      })

      interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    if (poll.votes[parseInt(buttonId) - 1].includes(interaction.user.id)) {
      return interaction.reply({ content: 'You already voted for this option', components: [removeRow], ephemeral: true });
    }

    const option = poll.options[parseInt(buttonId) - 1];

    if (!option) return;

    const userVote = poll.votes.find((option) => option.includes(interaction.user.id));
    var votedBefore = false;
    if (userVote) {
      votedBefore = true;
      const index = poll.votes.indexOf(userVote);
      poll.votes[index] = poll.votes[index].filter((user: String) => user !== interaction.user.id);
    }

    poll.votes[parseInt(buttonId) - 1].push(interaction.user.id);

    await poll.updateOne(poll);

    const embed = new EmbedBuilder()
      .setTitle(poll.question)
      .setDescription(poll.options.map((option, index) => `${index + 1}. ${option} (${poll.votes[index].length} votes)`).join('\n'))
      .setColor(oldEmbed.color)
      .setFooter({ text: `Poll created by ${author ? author.user.tag : 'UNKNOWN'} • Poll ID: ${poll._id}` })

    message.edit({ embeds: [embed], components: message.components });
    if (votedBefore) {
      return interaction.reply({ content: `You changed your vote to \`${poll.options[parseInt(buttonId) - 1]}\``, components: [removeRow], ephemeral: true });
    } else {
      return interaction.reply({ content: `You voted for \`${poll.options[parseInt(buttonId) - 1]}\``, components: [removeRow], ephemeral: true });
    }

  }
}