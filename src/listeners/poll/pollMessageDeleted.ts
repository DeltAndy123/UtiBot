import { Listener, Events } from '@sapphire/framework';
import { Message } from 'discord.js';
import pollSchema from '@schemas/pollSchema';

export class PollMessageDeletedListener extends Listener {
  public constructor(context: Listener.Context, options: Listener.Options) {
    super(context, {
      ...options,
      event: Events.MessageDelete,
    });
  }
  public async run(message: Message) {

    if (message.author.id !== this.container.client.user?.id) return;
    
    const poll = pollSchema.findOne({
      messageId: message.id,
    });

    if (!poll) return;

    await poll.deleteOne();

  }
}