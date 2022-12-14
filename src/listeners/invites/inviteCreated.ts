import { Listener, Events, container } from '@sapphire/framework';
import { Invite } from 'discord.js';

export class InviteCreatedListener extends Listener {
  public constructor(context: Listener.Context, options: Listener.Options) {
    super(context, {
      ...options,
      event: Events.InviteCreate,
    });
  }
  public run(invite: Invite) {

    // Store the invite in the inviteJoins cache
    global.inviteJoins[invite.code] = invite.uses || 0;

  }
}