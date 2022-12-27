import { EmbedBuilder } from "@discordjs/builders";
import { Command, ChatInputCommand } from "@sapphire/framework";
import { Colors, GuildMember, User } from "discord.js";

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
    
    const user = interaction.options.getUser("user");
    const member = interaction.options.getMember("user");

    if (!(user instanceof User) || (!(member instanceof GuildMember) && member)) return interaction.reply("Please provide a valid user.");
    
    const embed = new EmbedBuilder()
      .setTitle(`${user.username}'s Information`)
      .setDescription(`Information about ${user.toString()}`)
      .setColor(member ? member.displayColor : Colors.Blurple)
      .setThumbnail(user.displayAvatarURL())
      .setFooter({ text: `ID: ${user.id}` })
      
    if (member && member.nickname) embed.addFields({ name: "Nickname", value: member.nickname, inline: true });

    if (member) {
      embed.addFields(
        { name: "Joined Server", value: member.joinedTimestamp ? `<t:${Math.round(member.joinedTimestamp / 1000)}:f>` : "Unknown", inline: true },
      )
    }

    embed.addFields(
      { name: "Joined Discord", value: `<t:${Math.round(user.createdTimestamp / 1000)}:f>`, inline: true },
    );

    if (member) {
      embed.addFields(
        { name: "Roles", value: member.roles.cache.filter((role) => role.id != interaction.guildId).map((role) => role.toString()).join(" ") || "None", inline: false },
      )
    }

    return interaction.reply({ embeds: [embed] });

  }
}
