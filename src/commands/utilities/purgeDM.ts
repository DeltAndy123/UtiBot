import { Command, ChatInputCommand, CommandOptionsRunTypeEnum } from "@sapphire/framework";
import { ChannelType } from "discord.js";

export class PurgeDMCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      runIn: CommandOptionsRunTypeEnum.Dm,
      preconditions: ['CheckOverride'],
    });
  }

  public override registerApplicationCommands(
    registry: ChatInputCommand.Registry
  ) {
    registry.registerChatInputCommand(
      (builder) =>
        builder
          .setName("purgedm")
          .setDescription("Delete all messages the bot sent in your DMs")
    );
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    if (!interaction.channel || interaction.channel.type !== ChannelType.DM) return interaction.reply("This command can only be used in DMs.")
    interaction.reply({ content: "Purging DMs...", ephemeral: true });
    const messages = await interaction.channel.messages.fetch({ limit: 100 });
    const botMessages = messages.filter((m) => m.author.id === interaction.client.user!.id);
    await new Promise<void>((resolve) => {
      botMessages.forEach(async (m) => {
        await m.delete();
        await new Promise((r) => setTimeout(r, 1000));
        resolve();
      });
    });
    interaction.editReply("Purged DMs.");
  }
}
