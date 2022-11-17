export default (instance: any, options?: { showHidden: boolean }) => {
  const commands = instance.commandHandler.commands;
  
  var categories = commands.reduce((acc: any, command: any) => {
    if (command.hidden && (!options || !options.showHidden)) return acc;
    var category = command.category;
    if (!acc[category]) {
      acc[category] = {
        emoji: instance.getEmoji(category),
        commands: []
      };
    }
    acc[category].commands.push(command.names[0]);
    return acc;
  }, {})

  return categories
}