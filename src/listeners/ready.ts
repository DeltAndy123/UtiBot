import { Listener, Events } from '@sapphire/framework';
import { ChannelType, Client, PermissionFlagsBits } from 'discord.js';
import pollSchema from '@schemas/pollSchema';

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

    // Fetch all poll messages from the database
    pollSchema.find().then((polls) => {
      polls.forEach(async (poll) => {
        if (!poll.guildId || !poll.channelId || !poll.messageId) return;
        const guild = client.guilds.cache.get(poll.guildId);
        if (!guild) return;
        const channel = guild.channels.cache.get(poll.channelId);
        if (!channel) return;
        if (channel.type !== ChannelType.GuildText) return;
        await channel.messages.fetch(poll.messageId);
      });
    });
  }
}