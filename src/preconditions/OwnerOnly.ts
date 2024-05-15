import { Precondition } from "@sapphire/framework";
import envArray from "@util/env-array";
import type {
  CommandInteraction,
  ContextMenuCommandInteraction,
  Message,
  Snowflake,
} from "discord.js";

export class OwnerOnlyPrecondition extends Precondition {
  public chatInputRun(interaction: CommandInteraction) {
    return this.checkOwner(interaction.user.id);
  }

  public contextMenuRun(interaction: ContextMenuCommandInteraction) {
    return this.checkOwner(interaction.user.id);
  }

  public messageRun(message: Message) {
    return this.checkOwner(message.author.id);
  }

  private checkOwner(userId: Snowflake) {
    return envArray("OWNER_IDS").includes(userId)
      ? this.ok()
      : this.error({
          message: "This command can only be used by the owner.",
        });
  }
}

declare module "@sapphire/framework" {
  interface Preconditions {
    OwnerOnly: never;
  }
}
