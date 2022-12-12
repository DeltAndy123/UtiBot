import { Command, ChatInputCommand } from '@sapphire/framework';

export class EvalCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      preconditions: ['OwnerOnly'],
    });
  }

  public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName('eval')
        .setDescription('Bot owner only')
        .addStringOption((option) =>
          option
            .setName('code')
            .setDescription('Code to run')
            .setRequired(true)
        )
    );
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {

    const code = interaction.options.getString('code', true);
    const time = Date.now();
    try {
      const result = await eval(code);
      const timeTaken = Date.now() - time;
      const maxlen = 2000 - `Code ran in ${timeTaken}ms\n\`\`\`js`.length - 5;
      interaction.reply({ content: `Code ran in ${timeTaken}ms\n\`\`\`js
${`${result}`.slice(0, maxlen)}
\`\`\``, ephemeral: true });
    } catch (error: any) {
      const maxlen = 2000 - `Error: \`\`\`js`.length - 5;
      interaction.reply({ content: `Error: \`\`\`js
${`${error}`.substring(0, maxlen)}
\`\`\``, ephemeral: true });
    }

  }
}