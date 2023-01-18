import { EmbedBuilder } from '@discordjs/builders';
import { ChatInputCommand, CommandStore, container } from '@sapphire/framework';
import { Subcommand } from '@sapphire/plugin-subcommands';
import envArray from '@util/env-array';
import cmdOverrideSchema from '@schemas/cmdOverrideSchema';
import { ChatInputCommandInteraction, Colors } from 'discord.js';

const cannotDisable = [
  'cmdoverride'
]

export class CmdOverrideCommand extends Subcommand {
  public constructor(context: Subcommand.Context, options: Subcommand.Options) {
    super(context, {
      ...options,
      preconditions: ['OwnerOnly'],
      subcommands: [
        {
          name: 'list',
          chatInputRun: 'chatInputList',
          default: true,
        },
        {
          name: 'disable',
          chatInputRun: 'chatInputDisable',
        },
        {
          name: 'enable',
          chatInputRun: 'chatInputEnable',
        }
      ],
    });
  }

  registerApplicationCommands(
    registry: ChatInputCommand.Registry
  ) {
    registry.registerChatInputCommand(
      (builder) =>
        builder
          .setName('cmdoverride')
          .setDescription('DEVELOPER ONLY: Override commands for guilds')
          .addSubcommand((subcmd) =>
            subcmd
              .setName('list')
              .setDescription('Lists all overrides in a certain guild')
              .addStringOption((option) =>
                option
                  .setName('guild')
                  .setDescription('Guild ID of the guild to list overrides for')
                  .setRequired(true)
              )
          )
          .addSubcommand((subcmd) =>
            subcmd
              .setName('disable')
              .setDescription('Force disable a command in a guild')
              .addStringOption((option) =>
                option
                  .setName('guild')
                  .setDescription('Guild ID of the guild to disable the command from')
                  .setRequired(true)
              )
              .addStringOption((option) =>
                option
                  .setName('command')
                  .setDescription('Name of the command to disable')
                  .setRequired(true)
              )
          )
          .addSubcommand((subcmd) =>
            subcmd
              .setName('enable')
              .setDescription('Remove forced disable from a command in a guild')
              .addStringOption((option) =>
                option
                  .setName('guild')
                  .setDescription('Guild ID of the guild to remove the disable from')
                  .setRequired(true)
              )
              .addStringOption((option) =>
                option
                  .setName('command')
                  .setDescription('Name of the command to remove disable')
                  .setRequired(true)
              )
          ),
      { guildIds: envArray('GUILD_IDS') },
    );
  }

  public async chatInputList(interaction: ChatInputCommandInteraction) {
    const guild = container.client.guilds.cache.get(interaction.options.getString('guild')!)
    if (!guild) return interaction.reply({ content: 'Unknown guild', ephemeral: true })
    const cmdOverrides = await cmdOverrideSchema.findOne({
      _id: guild.id
    })
    
    const embed = new EmbedBuilder()
      .setTitle('Command Overrides')
      .setDescription(`Command overrides for guild \`${guild.name.replace(/(`|\\)/g, '\\$1')}\``)
      .addFields({ name: 'Disabled Commands', value: (cmdOverrides && cmdOverrides.disabled) ? cmdOverrides.disabled.join(', ') : 'None'})
      .setColor(Colors.Blurple)

    return interaction.reply({ embeds: [embed] })
    
  }

  public async chatInputDisable(interaction: ChatInputCommandInteraction) {
    const guild = container.client.guilds.cache.get(interaction.options.getString('guild')!)
    const cmdName = interaction.options.getString('command')!.toLowerCase()
    if (cannotDisable.includes(cmdName)) return interaction.reply({ content: 'You cannot disable that command', ephemeral: true })
    if (!guild) return interaction.reply({ content: 'Unknown guild', ephemeral: true })
    const cmdOverrides = await cmdOverrideSchema.findOne({
      _id: guild.id
    })
    const command = this.container.stores.get('commands').get(cmdName)
    if (!command) return interaction.reply({ content: 'Unknown command', ephemeral: true })
    if (cmdOverrides && cmdOverrides.disabled.includes(cmdName)) return interaction.reply({ content: 'Command is already disabled', ephemeral: true })
    
    await cmdOverrideSchema.findOneAndUpdate(
      { _id: guild.id },
      { $push: { disabled: cmdName } },
      { upsert: true, new: true }
    );
    
    interaction.reply(`Added disable override for \`${cmdName}\` in \`${guild.name}\``)
  }

  public async chatInputEnable(interaction: ChatInputCommandInteraction) {
    const guild = container.client.guilds.cache.get(interaction.options.getString('guild')!)
    const cmdName = interaction.options.getString('command')!.toLowerCase()
    if (!guild) return interaction.reply({ content: 'Unknown guild', ephemeral: true })
    const cmdOverrides = await cmdOverrideSchema.findOne({
      _id: guild.id
    })
    if (!cmdOverrides || !cmdOverrides.disabled) return interaction.reply({ content: 'That guild does not have any disabled commands', ephemeral: true })
    const command = this.container.stores.get('commands').get(cmdName)
    if (!command) return interaction.reply({ content: 'Unknown command', ephemeral: true })
    if (!cmdOverrides.disabled.includes(cmdName)) return interaction.reply({ content: 'Command is not disabled', ephemeral: true })

    cmdOverrides.disabled = cmdOverrides.disabled.filter((cmd) => cmd != cmdName)

    await cmdOverrides.updateOne(cmdOverrides)

    interaction.reply(`Removed disable override for \`${cmdName}\` in \`${guild.name}\``)
  }
}
