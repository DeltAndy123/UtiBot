import { Listener, Events } from '@sapphire/framework';
import { Channel, ChannelType } from 'discord.js';
import pollSchema from '@schemas/pollSchema';

export class PollChannelDeletedListener extends Listener {
  public constructor(context: Listener.Context, options: Listener.Options) {
    super(context, {
      ...options,
      event: Events.ChannelDelete,
    });
  }
  public async run(channel: Channel) {

    if (channel.type !== ChannelType.GuildText) return;

    const polls = await pollSchema.find({
      channelId: channel.id,
    });

    if (!polls) return;

    await pollSchema.deleteMany({
      channelId: channel.id,
    });

  }
}