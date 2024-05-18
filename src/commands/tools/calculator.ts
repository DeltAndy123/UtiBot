import { Command } from "@sapphire/framework";
import { evaluate, round } from "mathjs";
import {
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ComponentType,
} from "discord.js";
import { Tabs, calculatorLayout } from "@util/calculator-config";

const calculatorTabs = Object.keys(Tabs).filter((key) => isNaN(Number(key)));

function colorizeExpression(expression: string) {
  // ANSI escape codes for colors
  const numberColor = "\u001b[1;33m"; // Bold yellow for numbers
  const functionColor = "\u001b[36m"; // Cyan for functions
  const operatorColor = "\u001b[37m"; // White for operators
  const errorColor = "\u001b[1;31m"; // Red for errors
  const colorEnd = "\u001b[0m"; // Reset

  // Regular expressions for different parts of the expression
  const numberRegex = /\d/g;
  const functionRegex =
    /\b(?:sin|cos|tan|log|sqrt|exp|ln|abs|round|mod|pi|e|π)\b/g;
  const operatorRegex = /[+\-*/^()÷×!]/g;
  const errorRegex = /\b(?:Error|ERR_ZERO_DIV_ZERO)\b/g;

  // Replace numbers with colored numbers
  expression = expression.replace(numberRegex, (match) => {
    return `${numberColor}${match}${colorEnd}`;
  });

  // Replace functions with colored functions
  expression = expression.replace(functionRegex, (match) => {
    return `${functionColor}${match}${colorEnd}`;
  });

  // Replace operators with colored operators
  expression = expression.replace(operatorRegex, (match) => {
    return `${operatorColor}${match}${colorEnd}`;
  });

  // Replace errors with colored errors
  expression = expression.replace(errorRegex, (match) => {
    return `${errorColor}${match}${colorEnd}`;
  });

  return `${expression}`;
}

export class CalculatorCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, { ...options });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName("calculator")
        .setDescription("A calculator that can be used in Discord")
        .addNumberOption((option) =>
          option
            .setName("precision")
            .setDescription(
              "Number of decimal places the calculator will round to (Default: 14)"
            )
            .setMinValue(1)
            .setMaxValue(14)
        )
    );
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const calculator: {
      expression: {
        display: string;
        value: string;
      }[];
      tab: Tabs;
      result: string;
      clearOnType: boolean;
    } = {
      expression: [],
      tab: Tabs.Main,
      result: "",
      clearOnType: false,
    };
    function updateMessage() {
      // Main tab:
      // 7 8 9 /
      // 4 5 6 *
      // 1 2 3 -
      // . 0 = +
      // (Tabs)
      const rows: ActionRowBuilder<ButtonBuilder>[] = [];
      calculatorLayout[calculator.tab].buttonRows.forEach((row, i) => {
        const actionRow = new ActionRowBuilder<ButtonBuilder>();
        actionRow.addComponents(
          ...row.map(({ buttonDisplay, id, style }) =>
            new ButtonBuilder()
              .setCustomId(id)
              .setLabel(buttonDisplay)
              .setStyle(style || ButtonStyle.Secondary)
          )
        );
        if (i === 0) {
          actionRow.addComponents(
            new ButtonBuilder()
              .setCustomId("calculator.backspace")
              .setLabel("⌫")
              .setStyle(ButtonStyle.Danger)
          );
        }
        if (i === 1) {
          actionRow.addComponents(
            new ButtonBuilder()
              .setCustomId("calculator.clear")
              .setLabel("C")
              .setStyle(ButtonStyle.Danger)
          );
        }
        rows.push(actionRow);
      });

      const tabRow = new ActionRowBuilder<ButtonBuilder>();
      calculatorTabs.forEach((tabName) => {
        const button = new ButtonBuilder()
          .setCustomId(`calculator.tab.${tabName}`)
          .setLabel(tabName);

        if (Tabs[calculator.tab] === tabName)
          button.setStyle(ButtonStyle.Success);
        else button.setStyle(ButtonStyle.Secondary);

        tabRow.addComponents(button);
      });
      rows.push(tabRow);

      let content = "```ansi\n";
      const precision = interaction.options.getNumber("precision");
      if (precision) content = `**Precision: ${precision}**\n${content}`;
      if (calculator.result) {
        content += colorizeExpression(calculator.result) + "\n";
      }
      content +=
        colorizeExpression(
          calculator.expression.map(({ display }) => display).join("") || " "
        ) + "\n```";

      return {
        content,
        components: rows,
      };
    }
    const response = await interaction.reply(updateMessage());

    const collector = response.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 3_600_000,
    });
    collector.on("collect", async (buttonInt) => {
      if (buttonInt.user.id !== interaction.user.id)
        return buttonInt.reply({
          content: "This is not your calculator",
          ephemeral: true,
        });
      const buttonID = buttonInt.customId.split(".");
      if (buttonID[0] !== "calculator")
        return buttonInt.reply({
          content: "An unexpected error occurred",
          ephemeral: true,
        });
      switch (buttonID[1]) {
        case "tab":
          calculator.tab = Tabs[buttonID[2] as keyof typeof Tabs];
          break;
        case "backspace":
          calculator.expression.pop();
          break;
        case "clear":
          calculator.expression = [];
          break;
        case "calculate":
          const displayExpression = calculator.expression
            .map(({ display }) => display)
            .join("");
          let evalExpression =
            calculator.expression.map(({ value }) => value).join("") || "0";
          const openParenLen = (evalExpression.match(/\(/g) || []).length;
          const closeParenLen = (evalExpression.match(/\)/g) || []).length;
          if (openParenLen > closeParenLen) {
            evalExpression += ")".repeat(openParenLen - closeParenLen);
          }
          try {
            let result: string = round(
              evaluate(evalExpression),
              interaction.options.getNumber("precision") || 14
            ).toString();
            switch (result) {
              case "Infinity":
                calculator.expression = [
                  {
                    display: "Infinity",
                    value: "Infinity",
                  },
                ];
                break;
              case "NaN":
                calculator.expression = [
                  {
                    display:
                      "Imagine that you have zero cookies and you split them evenly among zero friends. How many cookies does each person get? See? It doesn’t make sense. And Cookie Monster is sad that there are no cookies, and you are sad that you have no friends.",
                    value: "",
                  },
                ];
                calculator.clearOnType = true;
                result = "ERR_ZERO_DIV_ZERO";
                break;
              default:
                calculator.expression = result.split("").map((char) => ({
                  display: char,
                  value:
                    calculatorLayout[calculator.tab].buttonRows
                      .flat()
                      .find(({ textDisplay }) => textDisplay === char)
                      ?.calculation || "",
                }));
            }
            calculator.result = `${displayExpression} = ${result}`;
          } catch (e) {
            calculator.result = `${displayExpression} = Error`;
            calculator.expression = [
              {
                display: "Error",
                value: "",
              },
            ];
            calculator.clearOnType = true;
          }
          break;
        default:
          const calculatorButton = calculatorLayout[calculator.tab].buttonRows
            .flat()
            .find(({ id }) => id === buttonInt.customId);
          if (!calculatorButton)
            return buttonInt.reply({
              content: "An unexpected error occurred",
              ephemeral: true,
            });
          if (calculator.clearOnType) {
            calculator.expression = [];
            calculator.clearOnType = false;
          }
          calculator.expression.push({
            display: calculatorButton.textDisplay,
            value: calculatorButton.calculation,
          });
      }
      buttonInt.update(updateMessage());
    });
  }
}
