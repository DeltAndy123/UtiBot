import { EmbedBuilder } from "@discordjs/builders";
import { ChatInputCommand, CommandOptionsRunTypeEnum } from "@sapphire/framework";
import { Subcommand } from "@sapphire/plugin-subcommands";
import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, Collection, Colors, GuildMember, InteractionCollector, Invite, Message, PermissionFlagsBits, User } from "discord.js";

export class InvitesCommand extends Subcommand {
  public constructor(context: Subcommand.Context, options: Subcommand.Options) {
    super(context, {
      ...options,
      requiredUserPermissions: ["CreateInstantInvite"],
      requiredClientPermissions: ["ManageGuild"],
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
      runIn: CommandOptionsRunTypeEnum.GuildAny,
      preconditions: ['CheckOverride', 'GuildOnly']
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
          .setDefaultMemberPermissions(PermissionFlagsBits.CreateInstantInvite)
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
    );
  }

  public async list(interaction: Subcommand.ChatInputCommandInteraction) {
    if (!interaction.inCachedGuild()) return interaction.reply('Invalid guild')
    var invites: Collection<string, Invite> = await interaction.guild!.invites.fetch();
    const member = interaction.options.getMember("member");
    var currentPage = 1;
    const perPage = 5;
    if (member) {
      invites = invites.filter((invite: Invite) => invite.inviter && invite.inviter.id === member.user.id);
    }

    function embedPage(page: number, perPage: number) {

      const embed = new EmbedBuilder()
        .setTitle(`Invites (${invites.size} total)`)
        .setDescription(member ? `Invites from ${member} in this server` : "Invites in this server")
        .setColor(member ? member.displayColor || Colors.Blurple : Colors.Blurple);

      const components = [];

      if (invites.size > perPage) {
        embed.setFooter({ text: `Page ${page} of ${Math.ceil(invites.size / perPage)}` })
        components.push(
          new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
              new ButtonBuilder()
                .setCustomId("invites_list_previous")
                .setLabel("Previous")
                .setStyle(ButtonStyle.Primary)
                .setDisabled(page === 1),
              new ButtonBuilder()
                .setCustomId("invites_list_next")
                .setLabel("Next")
                .setStyle(ButtonStyle.Primary)
                .setDisabled(page === Math.ceil(invites.size / perPage))
            )
        );
      }

      var i = 0;
      invites.forEach((invite: Invite) => {
        if (i >= (page - 1) * perPage && i < page * perPage) {
          embed.addFields({
            name: invite.code,
            value: `Uses: ${invite.uses}\nMax uses: ${invite.maxUses}\nChannel: ${invite.channel}\nCreated: ${invite.createdTimestamp ? `<t:${Math.round(invite.createdTimestamp / 1000)}:f>` : 'Unknown'}\nExpires: ${invite.expiresTimestamp ? `<t:${Math.round(invite.expiresTimestamp / 1000)}:f>` : 'Never'}${!member ? `\nCreated by: ${invite.inviter}` : ""}`,
          });
        }
        i++;
      });

      return {embeds: [embed], components};

    }

    await interaction.reply(embedPage(currentPage, perPage));
    const reply: Message<true> = await interaction.fetchReply();
    
    const collector: any = reply.createMessageComponentCollector()

    collector.on("collect", async (i: ButtonInteraction) => {
      if (i.user.id !== interaction.user.id) {
        return i.reply({ content: "You can't use this button!", ephemeral: true });
      }

      if (i.customId === "invites_list_previous") {
        currentPage--;
      }
      if (i.customId === "invites_list_next") {
        currentPage++;
      }

      await (reply as any).edit(embedPage(currentPage, perPage));
      i.deferUpdate();
    });

  }

  public info(interaction: Subcommand.ChatInputCommandInteraction) {
    if (!interaction.inCachedGuild()) return interaction.reply('Invalid guild')
    const code = interaction.options.getString("invite");
    const invite: Invite | undefined = interaction.guild.invites.cache.find((invite: Invite) => invite.code === code);

    if (!invite) {
      return interaction.reply({ content: "Invite not found", ephemeral: true });
    }

    const { inviter }: { inviter: User | null } = invite;
    const inviterMember: GuildMember | undefined | null = inviter ? interaction.guild.members.cache.get(inviter.id) : null;

    const embed = new EmbedBuilder()
      .setTitle("Invite Info")
      .setDescription(`Info about invite \`${invite.code}\``)
      .setColor(inviterMember ? inviterMember.displayColor : Colors.Blurple)
      .addFields(
        {
          name: "Uses",
          value: `${invite.uses || '0'}`,
          inline: true,
        },
        {
          name: "Max uses",
          value: `${invite.maxUses || 'Unlimited'}`,
          inline: true,
        },
        {
          name: "Channel",
          value: `${invite.channel}`,
          inline: true,
        },
        {
          name: "Created",
          value: `${invite.createdTimestamp ? `<t:${Math.round(invite.createdTimestamp / 1000)}:f>` : 'Unknown'}`,
          inline: true,
        },
        {
          name: "Expires",
          value: `${invite.expiresTimestamp ? `<t:${Math.round(invite.expiresTimestamp / 1000)}:f>` : 'Never'}`,
          inline: true,
        },
        {
          name: "Created by",
          value: `${inviterMember || inviter || 'Unknown'}`,
          inline: true,
        }
      );

    interaction.reply({ embeds: [embed] });

  }
}
