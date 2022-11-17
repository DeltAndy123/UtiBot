import { Command, ChatInputCommand } from '@sapphire/framework';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
const { evaluate } = require("mathjs");

export class CalulatorCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
    });
  }

  public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName('calculator')
        .setDescription('A usable calculator in Discord (WARNING: Very buggy)')
        .addBooleanOption((option) =>
          option
            .setName('debug')
            .setDescription('Debug mode (Shows error messages when there is an error)')
            .setRequired(false)
        )
    );
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction, ) {

    /** Example UI:
     * 1 + 1 = 2
     * [^] [C] [⌫] [÷]
     * [7] [8] [9] [×]
     * [4] [5] [6] [-]
     * [1] [2] [3] [+]
     * [2nd] [0] [.] [=]
     *
     * 2nd:
     * [sin] [cos] [tan] [log]
     * [sin⁻¹] [cos⁻¹] [tan⁻¹] [ln]
     * [π] [e] [(] [)]
     * [rand] [√] [∛] [,]
     * [2nd] [abs] [x!] [=]
     */

     var calculations: any[] = [];
     var previousCalc = "";
     var previousAns = "";
     var second = false;
     var debug = interaction.options.getBoolean('debug') || false;
 
     function updateCalculator() {
       // Create button rows with 4 buttons each
       const buttonRows: any[] = [];
       const row1 = new ActionRowBuilder();
       const row2 = new ActionRowBuilder();
       const row3 = new ActionRowBuilder();
       const row4 = new ActionRowBuilder();
       const row5 = new ActionRowBuilder();
 
       // Add buttons to rows
       row1.addComponents(
         new ButtonBuilder()
           .setCustomId("power")
           .setLabel("^")
           .setStyle(ButtonStyle.Primary),
         new ButtonBuilder()
           .setCustomId("clear")
           .setLabel("C")
           .setStyle(ButtonStyle.Primary),
         new ButtonBuilder()
           .setCustomId("backspace")
           .setLabel("⌫")
           .setStyle(ButtonStyle.Primary),
         new ButtonBuilder()
           .setCustomId("divide")
           .setLabel("÷")
           .setStyle(ButtonStyle.Success)
       );
       row2.addComponents(
         new ButtonBuilder()
           .setCustomId("7")
           .setLabel("7")
           .setStyle(ButtonStyle.Secondary),
         new ButtonBuilder()
           .setCustomId("8")
           .setLabel("8")
           .setStyle(ButtonStyle.Secondary),
         new ButtonBuilder()
           .setCustomId("9")
           .setLabel("9")
           .setStyle(ButtonStyle.Secondary),
         new ButtonBuilder()
           .setCustomId("multiply")
           .setLabel("×")
           .setStyle(ButtonStyle.Success)
       );
       row3.addComponents(
         new ButtonBuilder()
           .setCustomId("4")
           .setLabel("4")
           .setStyle(ButtonStyle.Secondary),
         new ButtonBuilder()
           .setCustomId("5")
           .setLabel("5")
           .setStyle(ButtonStyle.Secondary),
         new ButtonBuilder()
           .setCustomId("6")
           .setLabel("6")
           .setStyle(ButtonStyle.Secondary),
         new ButtonBuilder()
           .setCustomId("subtract")
           .setLabel("-")
           .setStyle(ButtonStyle.Success)
       );
       row4.addComponents(
         new ButtonBuilder()
           .setCustomId("1")
           .setLabel("1")
           .setStyle(ButtonStyle.Secondary),
         new ButtonBuilder()
           .setCustomId("2")
           .setLabel("2")
           .setStyle(ButtonStyle.Secondary),
         new ButtonBuilder()
           .setCustomId("3")
           .setLabel("3")
           .setStyle(ButtonStyle.Secondary),
         new ButtonBuilder().setCustomId("add").setLabel("+").setStyle(ButtonStyle.Success)
       );
       row5.addComponents(
         new ButtonBuilder()
           .setCustomId("second")
           .setLabel("2nd")
           .setStyle(ButtonStyle.Secondary),
         new ButtonBuilder()
           .setCustomId("0")
           .setLabel("0")
           .setStyle(ButtonStyle.Secondary),
         new ButtonBuilder()
           .setCustomId("decimal")
           .setLabel(".")
           .setStyle(ButtonStyle.Secondary),
         new ButtonBuilder()
           .setCustomId("equals")
           .setLabel("=")
           .setStyle(ButtonStyle.Success)
       );
 
       // Create button rows for 2nd
       const buttonRows2 = [];
       const row6 = new ActionRowBuilder();
       const row7 = new ActionRowBuilder();
       const row8 = new ActionRowBuilder();
       const row9 = new ActionRowBuilder();
       const row10 = new ActionRowBuilder();
 
       // Add buttons to rows
       row6.addComponents(
         new ButtonBuilder()
           .setCustomId("sin")
           .setLabel("sin")
           .setStyle(ButtonStyle.Secondary),
         new ButtonBuilder()
           .setCustomId("cos")
           .setLabel("cos")
           .setStyle(ButtonStyle.Secondary),
         new ButtonBuilder()
           .setCustomId("tan")
           .setLabel("tan")
           .setStyle(ButtonStyle.Secondary),
         new ButtonBuilder()
           .setCustomId("log")
           .setLabel("log")
           .setStyle(ButtonStyle.Secondary)
       );
       row7.addComponents(
         new ButtonBuilder()
           .setCustomId("asin")
           .setLabel("sin⁻¹")
           .setStyle(ButtonStyle.Secondary),
         new ButtonBuilder()
           .setCustomId("acos")
           .setLabel("cos⁻¹")
           .setStyle(ButtonStyle.Secondary),
         new ButtonBuilder()
           .setCustomId("atan")
           .setLabel("tan⁻¹")
           .setStyle(ButtonStyle.Secondary),
         new ButtonBuilder()
           .setCustomId("ln")
           .setLabel("ln")
           .setStyle(ButtonStyle.Secondary)
       );
       row8.addComponents(
         new ButtonBuilder()
           .setCustomId("pi")
           .setLabel("π")
           .setStyle(ButtonStyle.Secondary),
         new ButtonBuilder()
           .setCustomId("e")
           .setLabel("e")
           .setStyle(ButtonStyle.Secondary),
         new ButtonBuilder()
           .setCustomId("open-parenthesis")
           .setLabel("(")
           .setStyle(ButtonStyle.Secondary),
         new ButtonBuilder()
           .setCustomId("close-parenthesis")
           .setLabel(")")
           .setStyle(ButtonStyle.Secondary)
       );
       row9.addComponents(
         new ButtonBuilder()
           .setCustomId("rand")
           .setLabel("rand")
           .setStyle(ButtonStyle.Secondary),
         new ButtonBuilder()
           .setCustomId("sqrt")
           .setLabel("√")
           .setStyle(ButtonStyle.Secondary),
         new ButtonBuilder()
           .setCustomId("cbrt")
           .setLabel("∛")
           .setStyle(ButtonStyle.Secondary),
         new ButtonBuilder()
           .setCustomId("comma")
           .setLabel(",")
           .setStyle(ButtonStyle.Secondary)
       );
       row10.addComponents(
         new ButtonBuilder()
           .setCustomId("second")
           .setLabel("2nd")
           .setStyle(ButtonStyle.Primary),
         new ButtonBuilder()
           .setCustomId("abs")
           .setLabel("abs")
           .setStyle(ButtonStyle.Secondary),
         new ButtonBuilder()
           .setCustomId("factorial")
           .setLabel("x!")
           .setStyle(ButtonStyle.Secondary),
         new ButtonBuilder()
           .setCustomId("equals")
           .setLabel("=")
           .setStyle(ButtonStyle.Success)
       );
 
       // Add rows to buttonRows
       buttonRows.push(row1, row2, row3, row4, row5);
       buttonRows2.push(row6, row7, row8, row9, row10);
 
       // Parse the expression from calculations
       var calculationDisplay = "";
       calculations.forEach((calculationObject) => {
         calculationDisplay += calculationObject.display;
       });
 
       // Return JSON with message and buttons
       var content = `\`\`\`js\n${previousCalc ? `${previousCalc} = ${previousAns}\n` : ""}${
         calculationDisplay === "" ? " " : calculationDisplay
       }\n\`\`\``
       if (debug) content = '*Debug Mode*\n' + content
       return {
         content,
         components: second ? buttonRows2 : buttonRows,
       };
     }
 
     // Send initial message
     await interaction.reply(updateCalculator());
     const interactionReply: any = await interaction.fetchReply();
 
     // Listen for button clicks
     const filter = (i: any) => i.user.id === i.message.interaction?.user.id;
 
     const collector = interactionReply.createMessageComponentCollector({
       filter,
     });
 
     // function factorial(n: any) {
     //   var rval = 1;
     //   for (var i = 2; i <= n; i++) rval = rval * i;
     //   return rval;
     // }
 
     collector.on("collect", async (i: any) => {
       // If the calculation is message=true, then clear the calculations array
       if (calculations[0]?.message) {
         if (i.customId !== "second") {
           calculations = [];
         }
       }
       // Update calculation
       switch (i.customId) {
         case "power":
           calculations.push({
             display: "^",
             calculation: "^",
           });
           break;
         case "clear":
           calculations = [];
           break;
         case "backspace":
           calculations.pop();
           break;
         case "divide":
           calculations.push({
             display: "÷",
             calculation: "/",
           });
           break;
         case "7":
           calculations.push({
             display: "7",
             calculation: "7",
           });
           break;
         case "8":
           calculations.push({
             display: "8",
             calculation: "8",
           });
           break;
         case "9":
           calculations.push({
             display: "9",
             calculation: "9",
           });
           break;
         case "multiply":
           calculations.push({
             display: "×",
             calculation: "*",
           });
           break;
         case "4":
           calculations.push({
             display: "4",
             calculation: "4",
           });
           break;
         case "5":
           calculations.push({
             display: "5",
             calculation: "5",
           });
           break;
         case "6":
           calculations.push({
             display: "6",
             calculation: "6",
           });
           break;
         case "subtract":
           calculations.push({
             display: "-",
             calculation: "-",
           });
           break;
         case "1":
           calculations.push({
             display: "1",
             calculation: "1",
           });
           break;
         case "2":
           calculations.push({
             display: "2",
             calculation: "2",
           });
           break;
         case "3":
           calculations.push({
             display: "3",
             calculation: "3",
           });
           break;
         case "add":
           calculations.push({
             display: "+",
             calculation: "+",
           });
           break;
         case "0":
           calculations.push({
             display: "0",
             calculation: "0",
           });
           break;
         case "decimal":
           calculations.push({
             display: ".",
             calculation: ".",
           });
           break;
         case "sin":
           calculations.push({
             display: "sin(",
             calculation: "sin(",
           });
           break;
         case "cos":
           calculations.push({
             display: "cos(",
             calculation: "cos(",
           });
           break;
         case "tan":
           calculations.push({
             display: "tan(",
             calculation: "tan(",
           });
           break;
         case "log":
           calculations.push({
             display: "log(",
             calculation: "log10(",
           });
           break;
         case "asin":
           calculations.push({
             display: "sin⁻¹(",
             calculation: "asin(",
           });
           break;
         case "acos":
           calculations.push({
             display: "cos⁻¹(",
             calculation: "acos(",
           });
           break;
         case "atan":
           calculations.push({
             display: "tan⁻¹(",
             calculation: "atan(",
           });
           break;
         case "ln":
           calculations.push({
             display: "ln(",
             calculation: "log(",
           });
           break;
         case "pi":
           calculations.push({
             display: "π",
             calculation: "pi",
           });
           break;
         case "e":
           calculations.push({
             display: "e",
             calculation: "e",
           });
           break;
         case "open-parenthesis":
           calculations.push({
             display: "(",
             calculation: "(",
           });
           break;
         case "close-parenthesis":
           calculations.push({
             display: ")",
             calculation: ")",
           });
           break;
         case "rand":
           calculations.push({
             display: "rand(",
             calculation: "random(",
           });
           break;
         case "sqrt":
           calculations.push({
             display: "√(",
             calculation: "sqrt(",
           });
           break;
         case "cbrt":
           calculations.push({
             display: "∛(",
             calculation: "cbrt(",
           });
           break;
         case "comma":
           calculations.push({
             display: ",",
             calculation: ",",
           });
           break;
         case "abs":
           calculations.push({
             display: "abs(",
             calculation: "abs(",
           });
           break;
         case "factorial":
           calculations.push({
             display: "factorial(",
             calculation: "factorial(",
           });
           break;
         case "equals":
           // Calculate
           let calculation = "";
           let calculationDisplay = "";
           calculations.forEach((calculationObject: any) => {
             calculation += calculationObject.calculation;
             calculationDisplay += calculationObject.display;
           });
 
           // Check if calculation is valid
           if (calculation === "") {
             calculation = "0";
           }
 
           // Calculate
           try {
             calculations = [];
             var result = evaluate(calculation).toString();
             switch (calculation) {
               case "0/0":
                 result = "ERROR_ZERO_DIVIDED_BY_ZERO";
                 break;
             }
 
             switch (result) {
               case "NaN":
               case "Infinity":
               case "-Infinity":
                 calculations = [
                   {
                     display: result,
                     calculation: result,
                     message: true,
                   },
                 ];
                 break;
               case "ERROR_ZERO_DIVIDED_BY_ZERO":
                 calculations = [
                   {
                     display:
                       "Imagine you have 0 cookies and you split them evenly among 0 friends. How many cookies does each person get? See? It doesn’t make sense. And Cookie Monster is sad that there are no cookies, and you are sad that you have no friends.",
                     calculation: "",
                     message: true,
                   },
                 ];
                 break;
               default:
                 result.split("").forEach((char: any) => {
                   calculations.push({
                     display: char,
                     calculation: char,
                   });
                 });
             }
           } catch (error: any) {
             calculations = [
               {
                 display: "Error",
                 calculation: "",
                 message: true,
               },
             ];
             if (debug) {
               calculations[0].display = error.toString();
             }
           }
           previousCalc = calculationDisplay;
           previousAns = result;
           break;
         case "second":
           second = !second;
           break;
       }
 
       // Update message
       interactionReply.edit(updateCalculator());
 
       // Defer button click
       await i.deferUpdate();
     });

  }
}