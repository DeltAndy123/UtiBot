import { Command, ChatInputCommand, Events } from '@sapphire/framework';
import envArray from '@util/env-array';

export class TestJoinCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      preconditions: ['OwnerOnly', 'CheckOverride'],
    });
  }

  public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName('testjoin')
        .setDescription('Test join event')
        .addUserOption((option) =>
          option
            .setName('user')
            .setDescription('The user to test join event with')
            .setRequired(false)
        ),
      { guildIds: envArray('GUILD_IDS') }
        
    );
  }

  public chatInputRun(interaction: Command.ChatInputCommandInteraction) {

    const user = interaction.options.getUser('user') || interaction.user;

    this.container.client.emit(Events.GuildMemberAdd as any, interaction.guild?.members.cache.get(user.id));

    interaction.reply({ content: 'Emitted member join', ephemeral: true });

  }
}