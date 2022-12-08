import { Listener, Events } from '@sapphire/framework';
import { Client, PermissionFlagsBits } from 'discord.js';

export class ReadyListener extends Listener {
  public constructor(context: Listener.Context, options: Listener.Options) {
    super(context, {
      ...options,
      once: true,
      event: Events.ClientReady,
    });
  }
  public run(client: Client) {
    const { username, id, discriminator } = client.user!;
    this.container.logger.info(`Successfully logged in as ${username}#${discriminator} (${id})`);

    global.inviteJoins = {};

    client.guilds.cache.forEach(async (guild) => {
      if (!guild.members.cache.get(client.user!.id)!.permissions.has(PermissionFlagsBits.ManageGuild)) return;
      const guildInvites = await guild.invites.fetch();
      guildInvites.forEach((invite) => {
        global.inviteJoins[invite.code] = invite.uses || 0;
      });
    });
  }
}