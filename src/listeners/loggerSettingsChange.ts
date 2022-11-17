import { Listener, Events } from '@sapphire/framework';
import { AnySelectMenuInteraction } from 'discord.js';
import loggerSettingsSchema from '@schemas/loggerSettingsSchema';

export class LoggerSettingsChangeListener extends Listener {
  public constructor(context: Listener.Context, options: Listener.Options) {
    super(context, {
      ...options,
      event: Events.InteractionCreate,
    });
  }
  public async run(interaction: AnySelectMenuInteraction) {

    if (!interaction.isAnySelectMenu()) return;
    
    const data = await loggerSettingsSchema.findOne({
      _id: interaction.guildId,
    });


    if (interaction.isStringSelectMenu()) {
      switch(interaction.customId) {
        case 'enable':
          await loggerSettingsSchema.findOneAndUpdate({
            _id: interaction.guildId,
          }, {
            _id: interaction.guildId,
            channel: data?.channel,
            enabled: interaction.values[0] === 'enable' ? true : false,
            events: data?.events,
          }, {
            upsert: true,
          });
        break;
        case 'events':
          await loggerSettingsSchema.findOneAndUpdate({
            _id: interaction.guildId,
          }, {
            _id: interaction.guildId,
            channel: data?.channel,
            enabled: data?.enabled,
            events: {
              messageDelete: interaction.values.includes('message-delete') ? true : false,
              messageEdit: interaction.values.includes('message-edit') ? true : false,
              ghostPing: interaction.values.includes('ghost-ping') ? true : false,
              memberJoin: interaction.values.includes('member-join') ? true : false,
              memberLeave: interaction.values.includes('member-leave') ? true : false,
              impersonateUsed: interaction.values.includes('impersonate-used') ? true : false,
            },
          }, {
            upsert: true,
          });
        break;
      }
          
    }

    if (interaction.isChannelSelectMenu()) {
      const channel: any = interaction.channels.first();
      switch(interaction.customId) {
        case 'channel':
          await loggerSettingsSchema.findOneAndUpdate({
            _id: interaction.guildId,
          }, {
            _id: interaction.guildId,
            channel: channel.id,
            enabled: data?.enabled,
            events: data?.events,
          }, {
            upsert: true,
          });
        break;
      }
    }

    interaction.reply({ content: 'Settings updated!', ephemeral: true });

  }
}