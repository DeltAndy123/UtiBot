import { ChatInputCommand, ContextMenuCommand, Precondition, container } from '@sapphire/framework';
import { ChatInputCommandInteraction, Colors, ContextMenuCommandInteraction, EmbedBuilder, Message } from 'discord.js';
import cmdOverrideSchema from '@schemas/cmdOverrideSchema';

export class UserPrecondition extends Precondition {
	#error = this.error({
		message: 'This command has been disabled in this server by the bot owner.',
		identifier: 'CheckOverride'
	})

	public override async messageRun(message: Message) {
		return await this.checkOverride(message)
	}

	public override async chatInputRun(interaction: ChatInputCommandInteraction, command: ChatInputCommand) {
		return await this.checkOverride(interaction, command.name)
	}

	public override async contextMenuRun(interaction: ContextMenuCommandInteraction, command: ContextMenuCommand) {
		return await this.checkOverride(interaction, command.name)
	}

	private async checkOverride({ guild, member }: ChatInputCommandInteraction | ContextMenuCommandInteraction | Message, name?: string) {

		if (!guild) return this.ok()
		if (!name) return this.ok()

		const commandOverrides = await cmdOverrideSchema.findOne({
			_id: guild.id
		})

		if (!commandOverrides || !commandOverrides.disabled) return this.ok()

		if (commandOverrides.disabled.includes(name)) {
			let logChannel = container.client.channels.cache.get(process.env.GLOBAL_LOG_ID!)
			if (!logChannel || !logChannel.isTextBased()) return this.#error
			const embed = new EmbedBuilder()
				.setTitle('Overrided command used')
				.setDescription(`Command \`${name}\` was attempted to be used, but overrided in guild \`${guild.name}\` by \`${member?.user.username}#${member?.user.discriminator}\``)
				.setColor(Colors.Blurple)
				.setTimestamp()
			logChannel.send({ embeds: [embed] })
			return this.#error
		}

		return this.ok()
	}
}

declare module '@sapphire/framework' {
	interface Preconditions {
		CheckOverride: never;
	}
}