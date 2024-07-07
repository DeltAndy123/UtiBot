import {ChatInputCommandInteraction} from "discord.js";

export default async (interaction: { reply: ChatInputCommandInteraction["reply"] }, code: string, debug?: string | {[key: string]: string}) => {
    let errorMsg = `An error occurred while executing the command: \`${code}\`\n\nPlease report this to the bot developer.`;
    if (debug) {
        errorMsg += `\n\nExtra Debug Information (Please include this in your report):\n\`\`\``;
        if (typeof debug === "object") {
            for (const [key, value] of Object.entries(debug)) {
                errorMsg += `${key}: ${value}\n`;
            }
        } else {
            errorMsg += debug;
        }
        errorMsg += "```";
    }
    await interaction.reply({
        content: errorMsg,
        ephemeral: true
    });
}