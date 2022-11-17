"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvalCommand = void 0;
const framework_1 = require("@sapphire/framework");
class EvalCommand extends framework_1.Command {
    constructor(context, options) {
        super(context, Object.assign(Object.assign({}, options), { preconditions: ['OwnerOnly'] }));
    }
    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) => builder
            .setName('eval')
            .setDescription('Bot owner only')
            .addStringOption((option) => option
            .setName('code')
            .setDescription('Code to run')
            .setRequired(true)));
    }
    chatInputRun(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            // if (process.env.OWNER_IDS?.split(', ').includes(interaction.user.id)) {
            const code = interaction.options.getString('code', true);
            const time = Date.now();
            try {
                const result = yield eval(code);
                const timeTaken = Date.now() - time;
                const maxlen = 2000 - `Code ran in ${timeTaken}ms\n\`\`\`js`.length - 5;
                interaction.reply({ content: `Code ran in ${timeTaken}ms\n\`\`\`js
${`${result}`.slice(0, maxlen)}
\`\`\``, ephemeral: true });
            }
            catch (error) {
                const maxlen = 2000 - `Error: \`\`\`js`.length - 5;
                interaction.reply({ content: `Error: \`\`\`js
${`${error}`.substring(0, maxlen)}
\`\`\``, ephemeral: true });
            }
            // } else {
            //   interaction.reply({ content: 'no', ephemeral: true });
            // }
        });
    }
}
exports.EvalCommand = EvalCommand;
