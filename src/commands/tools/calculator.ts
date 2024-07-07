import { Command } from "@sapphire/framework";
import { evaluate, round, parse, MathNode } from "mathjs";
import {
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ComponentType,
} from "discord.js";
import { Tabs, calculatorLayout } from "@util/calculator-config";
import sendError from "@util/sendError";
import {AnyMathNode} from "../../types";

const calculatorTabs = Object.keys(Tabs).filter((key) => isNaN(Number(key)));

function colorizeExpression(expression: string) {
  // ANSI escape codes for colors
  const numberColor = "\u001b[1;33m"; // Bold yellow for numbers
  const functionColor = "\u001b[36m"; // Cyan for functions
  const operatorColor = "\u001b[37m"; // White for operators
  const errorColor = "\u001b[1;31m"; // Red for errors
  const colorEnd = "\u001b[0m"; // Reset

  // Regular expressions for different parts of the expression
  const numberRegex = /[\d.]+/g;
  const functionRegex =
    /\b(?:sin|cos|tan|log|sqrt|exp|ln|abs|round|mod|pi|e|π)+\b/g;
  const operatorRegex = /[+\-*/^()÷×!]+/g;
  const errorRegex = /\b(?:NaN|Error|ERR_ZERO_DIV_ZERO)+\b/g;

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
  private precision: number | null = null;
  private calcState: {
    expression: {
      display: string;
      value: string;
    }[];
    tab: Tabs;
    result: string;
    clearOnType: boolean;
    cursorPosition: number;
  } = {
    expression: [],
    tab: Tabs.Main,
    result: "",
    clearOnType: false,
    cursorPosition: 0,
  };

  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, { ...options });
  }

  private isZeroDivZero(expression: string): boolean {
    // Helper function to safely evaluate an expression node
    function safeEval(node: MathNode): number | null {
      try {
        return node.evaluate();
      } catch (e) {
        return null;
      }
    }

    // Helper function to recursively check for zero division
    function hasZeroDivZero(node: AnyMathNode): boolean {
      if (node.type === "ConstantNode") {
        return false;
      }

      if (node.type === "ParenthesisNode") {
        return hasZeroDivZero(node.content as AnyMathNode);
      }

      if (node.type === "OperatorNode") {
        if (node.op === '/') {
          const [numerator, denominator] = node.args.map(safeEval);
          if (numerator === 0 && denominator === 0) {
            return true;
          }
        }
        return (node.args as AnyMathNode[]).some((arg) => hasZeroDivZero(arg));
      }

      return false;
    }

    // Parse the expression
    const parsedExpression = parse(expression) as AnyMathNode;

    // Check for zero division in the parsed expression
    return hasZeroDivZero(parsedExpression);
  }

  private calculate() {
    const displayExpression = this.calcState.expression
      .map(({ display }) => display)
      .join("");
    let evalExpression =
      this.calcState.expression.map(({ value }) => value).join("") || "0";
    const openParenLen = (evalExpression.match(/\(/g) || []).length;
    const closeParenLen = (evalExpression.match(/\)/g) || []).length;
    if (openParenLen > closeParenLen) {
      evalExpression += ")".repeat(openParenLen - closeParenLen);
    }
    try {
      let result: string = round(
        evaluate(evalExpression),
        this.precision || 14
      ).toString();
      switch (result) {
        case "Infinity":
          this.calcState.expression = [
            {
              display: "∞",
              value: "Infinity",
            },
          ];
          this.calcState.cursorPosition = 1;
          result = "∞";
          break;
        case "-Infinity":
          this.calcState.expression = [
            {
              display: "-",
              value: "-",
            },
            {
              display: "∞",
              value: "Infinity",
            },
          ];
          this.calcState.cursorPosition = 2;
          result = "-∞";
          break;
        case "NaN":
          if (this.isZeroDivZero(evalExpression)) {
            this.calcState.expression = [
              {
                display:
                  "Imagine that you have zero cookies and you split them evenly among zero friends. How many cookies does each person get? See? It doesn’t make sense. And Cookie Monster is sad that there are no cookies, and you are sad that you have no friends.",
                value: "",
              },
            ];
            this.calcState.clearOnType = true;
            this.calcState.cursorPosition = 0;
            result = "ERR_ZERO_DIV_ZERO";
          } else {
            this.calcState.expression = [
              {
                display: "NaN",
                value: "",
              },
            ];
            this.calcState.clearOnType = true;
            this.calcState.cursorPosition = 0;
            result = "NaN";
          }
          break;
        default:
          this.calcState.expression = result.split("").map((char) => ({
            display: char,
            value:
              calculatorLayout[this.calcState.tab].buttonRows
                .flat()
                .find(({ textDisplay }) => textDisplay === char)
                ?.calculation || "",
          }));
          this.calcState.cursorPosition = this.calcState.expression.length;
      }
      this.calcState.result = `${displayExpression} = ${result}`;
    } catch (e) {
      this.calcState.result = `${displayExpression} = Error`;
      this.calcState.expression = [
        {
          display: "Error",
          value: "",
        },
      ];
      this.calcState.clearOnType = true;
      this.calcState.cursorPosition = 0;
    }
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
    this.precision = interaction.options.getNumber("precision");

    const updateMessage = () => {
      // Main tab:
      // 7 8 9 /
      // 4 5 6 *
      // 1 2 3 -
      // . 0 = +
      // (Tabs)
      const rows: ActionRowBuilder<ButtonBuilder>[] = [];
      calculatorLayout[this.calcState.tab].buttonRows.forEach((row, i) => {
        const actionRow = new ActionRowBuilder<ButtonBuilder>();
        actionRow.addComponents(
          ...row.map(({ buttonDisplay, id, calculation, style }) =>
            new ButtonBuilder()
              .setCustomId(`calculator.${id || calculation}`)
              .setLabel(buttonDisplay)
              .setStyle(style || ButtonStyle.Secondary)
          )
        );
        switch (i) {
          case 0:
            actionRow.addComponents(
              new ButtonBuilder()
                .setCustomId("calculator.backspace")
                .setLabel("⌫")
                .setStyle(ButtonStyle.Danger)
            );
            break;
          case 1:
            actionRow.addComponents(
              new ButtonBuilder()
                .setCustomId("calculator.clear")
                .setLabel("C")
                .setStyle(ButtonStyle.Danger)
            );
            break;
          case 2:
            actionRow.addComponents(
              new ButtonBuilder()
                .setCustomId("calculator.cursor.left")
                .setLabel("←")
                .setStyle(ButtonStyle.Success)
            );
            break;
          case 3:
            actionRow.addComponents(
              new ButtonBuilder()
                .setCustomId("calculator.cursor.right")
                .setLabel("→")
                .setStyle(ButtonStyle.Success)
            );
            break;
        }
        rows.push(actionRow);
      });

      const tabRow = new ActionRowBuilder<ButtonBuilder>();
      calculatorTabs.forEach((tabName) => {
        const button = new ButtonBuilder()
          .setCustomId(`calculator.tab.${tabName}`)
          .setLabel(tabName);

        if (Tabs[this.calcState.tab] === tabName)
          button.setStyle(ButtonStyle.Success);
        else button.setStyle(ButtonStyle.Secondary);

        tabRow.addComponents(button);
      });
      rows.push(tabRow);

      let content = "```ansi\n";
      if (this.precision) content = `**Precision: ${this.precision}**\n${content}`;
      if (this.calcState.result) {
        content += colorizeExpression(this.calcState.result) + "\n";
      }
      this.calcState.expression.forEach(({ display }, i) => {
        if (i === this.calcState.cursorPosition) content += "\u001b[1;34m‸\u001b[0m";
        content += display;
      });
      if (this.calcState.cursorPosition === this.calcState.expression.length)
        content += "\u001b[1;34m‸\u001b[0m";
      content += "\n```";

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
      if (buttonID[0] !== "calculator") return sendError(buttonInt, "INVALID_BUTTON_ID")
      switch (buttonID[1]) {
        case "tab":
          this.calcState.tab = Tabs[buttonID[2] as keyof typeof Tabs];
          break;
        case "cursor":
          const cursorID = buttonID[2];
          if (cursorID === "left") {
            this.calcState.cursorPosition = Math.max(0, this.calcState.cursorPosition - 1);
          } else if (cursorID === "right") {
            this.calcState.cursorPosition = Math.min(
              this.calcState.expression.length,
              this.calcState.cursorPosition + 1
            );
          } else {
            this.calcState.cursorPosition = Number(cursorID);
          }
          break;
        case "backspace":
          if (this.calcState.cursorPosition === 0) break;
          this.calcState.cursorPosition--;
          this.calcState.expression.splice(this.calcState.cursorPosition, 1);
          break;
        case "clear":
          this.calcState.expression = [];
          this.calcState.cursorPosition = 0;
          break;
        case "calculate":
          this.calculate();
          break;
        default:
          const calculatorButton = calculatorLayout[this.calcState.tab].buttonRows
            .flat()
            .find(({ id, calculation }) => id === buttonID[1] || calculation === buttonID[1]);
          if (!calculatorButton) return sendError(buttonInt, "BUTTON_NOT_FOUND", {
            shortID: buttonID[1],
            fullID: buttonInt.customId
          });
          if (this.calcState.clearOnType) {
            this.calcState.expression = [];
            this.calcState.clearOnType = false;
            this.calcState.cursorPosition = 0;
          }
          this.calcState.expression.splice(this.calcState.cursorPosition, 0, {
            display: calculatorButton.textDisplay,
            value: calculatorButton.calculation,
          });
          this.calcState.cursorPosition++;
      }
      await buttonInt.update(updateMessage());
    });
  }
}
