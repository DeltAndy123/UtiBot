import { Listener, Events } from '@sapphire/framework';
import { Guild, ChannelType } from 'discord.js';
import pollSchema from '@schemas/pollSchema';

export class PollGuildDeletedListener extends Listener {
  public constructor(context: Listener.Context, options: Listener.Options) {
    super(context, {
      ...options,
      event: Events.GuildDelete,
    });
  }
  public async run(guild: Guild) {
    
    const polls = await pollSchema.find({
      guildId: guild.id,
    });

    if (!polls) return;

    await pollSchema.deleteMany({
      guildId: guild.id,
    });

  }
}