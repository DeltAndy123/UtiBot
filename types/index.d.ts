import { SapphireClient } from '@sapphire/framework';

declare global {
  var client: SapphireClient;
  var inviteJoins: { [key: string]: number };
}

export {};