import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from "@discordjs/builders";
import { Command, ChatInputCommand } from "@sapphire/framework";
import { ButtonInteraction, ButtonStyle, ComponentType, PermissionFlagsBits } from "discord.js";
import pollSchema from "@schemas/pollSchema";

export class CmdNameCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      requiredUserPermissions: ["ManageGuild"],
      requiredClientPermissions: ["SendMessages"],
    });
  }

  public override registerApplicationCommands(
    registry: ChatInputCommand.Registry
  ) {
    registry.registerChatInputCommand(
      (builder) =>
        builder
          .setName("poll")
          .setDescription("Create a poll that users can vote on")
          .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
          .addStringOption((option) =>
            option
              .setName("question")
              .setDescription("The question to ask")
              .setRequired(true)
          )
          .addStringOption((option) =>
            option
              .setName("option1")
              .setDescription("The first option")
              .setRequired(true)
          )
          .addStringOption((option) =>
            option
              .setName("option2")
              .setDescription("The second option")
              .setRequired(true)
          )
          .addStringOption((option) =>
            option
              .setName("option3")
              .setDescription("The third option")
              .setRequired(false)
          )
          .addStringOption((option) =>
            option
              .setName("option4")
              .setDescription("The fourth option")
              .setRequired(false)
          )
          .addStringOption((option) =>
            option
              .setName("option5")
              .setDescription("The fifth option")
              .setRequired(false)
          )
          .addStringOption((option) =>
            option
              .setName("option6")
              .setDescription("The sixth option")
              .setRequired(false)
          )
          .addStringOption((option) =>
            option
              .setName("option7")
              .setDescription("The seventh option")
              .setRequired(false)
          )
          .addStringOption((option) =>
            option
              .setName("option8")
              .setDescription("The eighth option")
              .setRequired(false)
          )
          .addStringOption((option) =>
            option
              .setName("option9")
              .setDescription("The ninth option")
              .setRequired(false)
          )
          .addStringOption((option) =>
            option
              .setName("option10")
              .setDescription("The tenth option")
              .setRequired(false)
          ),
    );
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const question: string = interaction.options.getString("question")!;
    const option1: string = interaction.options.getString("option1")!;
    const option2: string = interaction.options.getString("option2")!;
    const option3: string | null = interaction.options.getString("option3");
    const option4: string | null = interaction.options.getString("option4");
    const option5: string | null = interaction.options.getString("option5");
    const option6: string | null = interaction.options.getString("option6");
    const option7: string | null = interaction.options.getString("option7");
    const option8: string | null = interaction.options.getString("option8");
    const option9: string | null = interaction.options.getString("option9");
    const option10: string | null = interaction.options.getString("option10");

    const options = [option1, option2, option3, option4, option5, option6, option7, option8, option9, option10]
      .filter((option) => option);

    const embed = new EmbedBuilder()
      .setTitle(question)
      .setDescription(options.map((option, index) => `${index + 1}. ${option} (0 votes)`).join("\n"))
      .setColor(Math.floor(Math.random() * 0xffffff))
      .setFooter({ text: `Poll created by ${interaction.user.tag} • Poll ID: ${interaction.id}` });

    var components = [];

    components.push(
      new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
          options.slice(0,5).filter((option) => option).map((option, index) => new ButtonBuilder()
            .setCustomId(`poll-${index + 1}`)
            .setLabel(option!)
            .setStyle(ButtonStyle.Primary)
          )
        )
    );

    if (options.length > 5) {
      components.push(
        new ActionRowBuilder<ButtonBuilder>()
          .addComponents(
            options.slice(5,10).filter((option) => option).map((option, index) => new ButtonBuilder()
              .setCustomId(`poll-${index + 6}`)
              .setLabel(option!)
              .setStyle(ButtonStyle.Primary)
            )
          )
      );
    }

    components.push(
      new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('poll-viewVotes')
            .setLabel('View Votes')
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId('poll-removeVote')
            .setLabel('Remove Vote')
            .setStyle(ButtonStyle.Danger),
          new ButtonBuilder()
            .setCustomId('poll-end')
            .setLabel('End Poll')
            .setStyle(ButtonStyle.Secondary)
        )
    );

    interaction.reply({ embeds: [embed], components });
    const reply = await interaction.fetchReply();

    await pollSchema.create({
      _id: interaction.id,
      question,
      options,
      votes: options.map(() => []),
      author: interaction.user.id,
      messageId: reply.id,
      channelId: interaction.channelId,
      guildId: interaction.guildId,
    });

  }
}
