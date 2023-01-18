import { ChatInputCommand, ContextMenuCommand, Precondition } from '@sapphire/framework';
import type { ChatInputCommandInteraction, ContextMenuCommandInteraction, Message } from 'discord.js';
import cmdOverrideSchema from '@schemas/cmdOverrideSchema';

export class UserPrecondition extends Precondition {
	public override async messageRun(message: Message) {
		return await this.checkOverride(message)
	}

	public override async chatInputRun(interaction: ChatInputCommandInteraction, command: ChatInputCommand) {
		return await this.checkOverride(interaction, command.name)
	}

	public override async contextMenuRun(interaction: ContextMenuCommandInteraction, command: ContextMenuCommand) {
		return await this.checkOverride(interaction, command.name)
	}

	private async checkOverride({ guild }: ChatInputCommandInteraction | ContextMenuCommandInteraction | Message, name?: string) {

		if (!guild) return this.ok()
		if (!name) return this.ok()

		const commandOverrides = await cmdOverrideSchema.findOne({
			_id: guild.id
		})

		if (!commandOverrides || !commandOverrides.disabled) return this.ok()

		if (commandOverrides.disabled.includes(name)) return this.error({
			message: 'This command has been disabled in this server by the bot owner.',
			identifier: 'CheckOverride'
		})

		return this.ok()
	}
}

declare module '@sapphire/framework' {
	interface Preconditions {
		CheckOverride: never;
	}
}