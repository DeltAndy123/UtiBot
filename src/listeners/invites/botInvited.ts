import { Listener, Events } from '@sapphire/framework';
import { Guild } from 'discord.js';

export class BotInvitedListener extends Listener {
  public constructor(context: Listener.Context, options: Listener.Options) {
    super(context, {
      ...options,
      event: Events.GuildCreate,
    });
  }
  public run(guild: Guild) {

    // Store the invites in the inviteJoins cache
    guild.invites.fetch().then((invites) => {
      invites.forEach((invite) => {
        global.inviteJoins[invite.code] = invite.uses || 0;
      });
    });

  }
}