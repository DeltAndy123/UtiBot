"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (instance, options) => {
    const commands = instance.commandHandler.commands;
    var categories = commands.reduce((acc, command) => {
        if (command.hidden && (!options || !options.showHidden))
            return acc;
        var category = command.category;
        if (!acc[category]) {
            acc[category] = {
                emoji: instance.getEmoji(category),
                commands: []
            };
        }
        acc[category].commands.push(command.names[0]);
        return acc;
    }, {});
    return categories;
};
