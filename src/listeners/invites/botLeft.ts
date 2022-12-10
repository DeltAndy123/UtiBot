import { Listener, Events } from '@sapphire/framework';
import { Guild } from 'discord.js';

export class BotLeftListener extends Listener {
  public constructor(context: Listener.Context, options: Listener.Options) {
    super(context, {
      ...options,
      event: Events.GuildDelete,
    });
  }
  public run(guild: Guild) {

    // Delete the invites in the inviteJoins cache
    guild.invites.fetch().then((invites) => {
      invites.forEach((invite) => {
        delete global.inviteJoins[invite.code];
      });
    });

  }
}