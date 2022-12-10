import { Listener, Events, container } from '@sapphire/framework';
import { Invite } from 'discord.js';

export class InviteDeletedListener extends Listener {
  public constructor(context: Listener.Context, options: Listener.Options) {
    super(context, {
      ...options,
      event: Events.InviteDelete,
    });
  }
  public run(invite: Invite) {

    // Delete the invite from the inviteJoins cache
    delete global.inviteJoins[invite.code];

  }
}