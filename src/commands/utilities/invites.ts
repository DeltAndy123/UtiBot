import { EmbedBuilder } from "@discordjs/builders";
import { ChatInputCommand } from "@sapphire/framework";
import { Subcommand } from "@sapphire/plugin-subcommands";
import { Colors, GuildMember, Invite, User } from "discord.js";

export class InvitesCommand extends Subcommand {
  public constructor(context: Subcommand.Context, options: Subcommand.Options) {
    super(context, {
      ...options,
      requiredUserPermissions: ["SendMessages"],
      requiredClientPermissions: ["SendMessages"],
      subcommands: [
        {
          name: "list",
          chatInputRun: "list",
        },
        {
          name: "info",
          chatInputRun: "info",
        },
      ],
    });
  }

  public override registerApplicationCommands(
    registry: ChatInputCommand.Registry
  ) {
    registry.registerChatInputCommand(
      (builder) =>
        builder
          .setName("invites")
          .setDescription("View the invites of a server and its info")
          .addSubcommand((subcmd) =>
            subcmd
              .setName("list")
              .setDescription("List all invites of a server or member")
              .addUserOption((option) =>
                option
                  .setName("member")
                  .setDescription("The member to list invites of")
              )
          )
          .addSubcommand((subcmd) =>
            subcmd
              .setName("info")
              .setDescription("Get info about an invite")
              .addStringOption((option) =>
                option
                  .setName("invite")
                  .setDescription("The invite to get info about")
                  .setRequired(true)
              )
          ),
      // { guildIds: [ 'TESTID' ] }, // Uncomment this line to register the command in a specific guild
    );
  }

  public async list(interaction: Subcommand.ChatInputInteraction) {
    
    var invites = await interaction.guild.invites.fetch();
    const member: GuildMember = interaction.options.getMember("member");

    if (member) {
      invites = invites.filter((invite: Invite) => invite.inviter && invite.inviter.id === member.user.id);
    }

    const embed = new EmbedBuilder()
      .setTitle("Invites")
      .setDescription(member ? `Invites from ${member} in this server` : "Invites in this server")
      .setColor(member ? member.displayColor || Colors.Blurple : Colors.Blurple);

    invites.forEach((invite: Invite) => {
      embed.addFields({
        name: invite.code,
        value: `Uses: ${invite.uses}\nMax uses: ${invite.maxUses}\nChannel: ${invite.channel}\nCreated: ${invite.createdTimestamp ? `<t:${Math.round(invite.createdTimestamp / 1000)}:f>` : 'N/A'}\nExpires: ${invite.expiresTimestamp ? `<t:${Math.round(invite.expiresTimestamp / 1000)}:f>` : 'N/A'}${!member ? `\nCreated by: ${invite.inviter}` : ""}`,
      });
    });

    await interaction.reply({ embeds: [embed] });

  }

  public info(interaction: Subcommand.ChatInputInteraction) {
    
    const code = interaction.options.getString("invite");
    const invite: Invite = interaction.guild.invites.cache.find((invite: Invite) => invite.code === code);

    if (!invite) {
      return interaction.reply({ content: "Invite not found", ephemeral: true });
    }

    const { inviter }: { inviter: User | null } = invite;
    const inviterMember: GuildMember = inviter ? interaction.guild.members.cache.get(inviter.id) : null;

    const embed = new EmbedBuilder()
      .setTitle("Invite Info")
      .setDescription(`Info about invite \`${invite.code}\``)
      .setColor(inviterMember.displayColor || Colors.Blurple)
      .addFields(
        {
          name: "Uses",
          value: `${invite.uses || 'N/A'}`,
          inline: true,
        },
        {
          name: "Max uses",
          value: `${invite.maxUses || 'N/A'}`,
          inline: true,
        },
        {
          name: "Channel",
          value: `${invite.channel}`,
          inline: true,
        },
        {
          name: "Created",
          value: `${invite.createdTimestamp ? `<t:${Math.round(invite.createdTimestamp / 1000)}:f>` : 'N/A'}`,
          inline: true,
        },
        {
          name: "Expires",
          value: `${invite.expiresTimestamp ? `<t:${Math.round(invite.expiresTimestamp / 1000)}:f>` : 'N/A'}`,
          inline: true,
        },
        {
          name: "Created by",
          value: `${inviterMember || inviter || 'N/A'}`,
          inline: true,
        }
      );

    interaction.reply({ embeds: [embed] });

  }
}
