import { EmbedBuilder } from "@discordjs/builders";
import { Command, ChatInputCommand } from "@sapphire/framework";
import { Colors, GuildMember } from "discord.js";

export class UserCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      requiredClientPermissions: ["ManageGuild"],
    });
  }

  public override registerApplicationCommands(
    registry: ChatInputCommand.Registry
  ) {
    registry.registerChatInputCommand(
      (builder) =>
        builder
          .setName("user")
          .setDescription("View a user's information")
          .addUserOption((option) =>
            option
              .setName("user")
              .setDescription("The user to view information of")
              .setRequired(true)
          ),
    );
  }

  public chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    
    const member = interaction.options.getMember("user");

    if (!(member instanceof GuildMember) || !member.joinedTimestamp) return interaction.reply("Please provide a valid user.");
    
    const embed = new EmbedBuilder()
      .setTitle(`${member.user.username}'s Information`)
      .setDescription(`Information about ${member.user.toString()}`)
      .setColor(member.displayColor || Colors.Blurple)
      .setThumbnail(member.user.displayAvatarURL())
      .setFooter({ text: `ID: ${member.id}` })
      
    if (member.nickname) embed.addFields({ name: "Nickname", value: member.nickname || "None", inline: true });

    embed.addFields(
      { name: "Joined Server", value: `<t:${Math.round(member.joinedTimestamp / 1000)}:f>` || "Unknown", inline: true },
      { name: "Joined Discord", value: `<t:${Math.round(member.user.createdTimestamp / 1000)}:f>`, inline: true },
      { name: "Roles", value: member.roles.cache.filter((role) => role.id != interaction.guildId).map((role) => role.toString()).join(" ") || "None", inline: false },
    );

    return interaction.reply({ embeds: [embed] });

  }
}
