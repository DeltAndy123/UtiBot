import { Command } from "@sapphire/framework";

export class PingCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, { ...options });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName("ping")
        .setDescription("A ping command to test the discord bot")
    );
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    // Respond with the latency of the bot
    const reply = await interaction.reply({
      content: "Pong! (Calculating round trip)",
      fetchReply: true,
    });

    interaction.editReply(
      `Pong! (${reply.createdTimestamp - interaction.createdTimestamp}ms)`
    );
  }
}
