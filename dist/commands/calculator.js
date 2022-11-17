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
exports.CalulatorCommand = void 0;
const framework_1 = require("@sapphire/framework");
const discord_js_1 = require("discord.js");
const { evaluate } = require("mathjs");
class CalulatorCommand extends framework_1.Command {
    constructor(context, options) {
        super(context, Object.assign({}, options));
    }
    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) => builder
            .setName('calculator')
            .setDescription('A usable calculator in Discord (WARNING: Very buggy)')
            .addBooleanOption((option) => option
            .setName('debug')
            .setDescription('Debug mode (Shows error messages when there is an error)')
            .setRequired(false)));
    }
    chatInputRun(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
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
            var calculations = [];
            var previousCalc = "";
            var previousAns = "";
            var second = false;
            var debug = interaction.options.getBoolean('debug') || false;
            function updateCalculator() {
                // Create button rows with 4 buttons each
                const buttonRows = [];
                const row1 = new discord_js_1.ActionRowBuilder();
                const row2 = new discord_js_1.ActionRowBuilder();
                const row3 = new discord_js_1.ActionRowBuilder();
                const row4 = new discord_js_1.ActionRowBuilder();
                const row5 = new discord_js_1.ActionRowBuilder();
                // Add buttons to rows
                row1.addComponents(new discord_js_1.ButtonBuilder()
                    .setCustomId("power")
                    .setLabel("^")
                    .setStyle(discord_js_1.ButtonStyle.Primary), new discord_js_1.ButtonBuilder()
                    .setCustomId("clear")
                    .setLabel("C")
                    .setStyle(discord_js_1.ButtonStyle.Primary), new discord_js_1.ButtonBuilder()
                    .setCustomId("backspace")
                    .setLabel("⌫")
                    .setStyle(discord_js_1.ButtonStyle.Primary), new discord_js_1.ButtonBuilder()
                    .setCustomId("divide")
                    .setLabel("÷")
                    .setStyle(discord_js_1.ButtonStyle.Success));
                row2.addComponents(new discord_js_1.ButtonBuilder()
                    .setCustomId("7")
                    .setLabel("7")
                    .setStyle(discord_js_1.ButtonStyle.Secondary), new discord_js_1.ButtonBuilder()
                    .setCustomId("8")
                    .setLabel("8")
                    .setStyle(discord_js_1.ButtonStyle.Secondary), new discord_js_1.ButtonBuilder()
                    .setCustomId("9")
                    .setLabel("9")
                    .setStyle(discord_js_1.ButtonStyle.Secondary), new discord_js_1.ButtonBuilder()
                    .setCustomId("multiply")
                    .setLabel("×")
                    .setStyle(discord_js_1.ButtonStyle.Success));
                row3.addComponents(new discord_js_1.ButtonBuilder()
                    .setCustomId("4")
                    .setLabel("4")
                    .setStyle(discord_js_1.ButtonStyle.Secondary), new discord_js_1.ButtonBuilder()
                    .setCustomId("5")
                    .setLabel("5")
                    .setStyle(discord_js_1.ButtonStyle.Secondary), new discord_js_1.ButtonBuilder()
                    .setCustomId("6")
                    .setLabel("6")
                    .setStyle(discord_js_1.ButtonStyle.Secondary), new discord_js_1.ButtonBuilder()
                    .setCustomId("subtract")
                    .setLabel("-")
                    .setStyle(discord_js_1.ButtonStyle.Success));
                row4.addComponents(new discord_js_1.ButtonBuilder()
                    .setCustomId("1")
                    .setLabel("1")
                    .setStyle(discord_js_1.ButtonStyle.Secondary), new discord_js_1.ButtonBuilder()
                    .setCustomId("2")
                    .setLabel("2")
                    .setStyle(discord_js_1.ButtonStyle.Secondary), new discord_js_1.ButtonBuilder()
                    .setCustomId("3")
                    .setLabel("3")
                    .setStyle(discord_js_1.ButtonStyle.Secondary), new discord_js_1.ButtonBuilder().setCustomId("add").setLabel("+").setStyle(discord_js_1.ButtonStyle.Success));
                row5.addComponents(new discord_js_1.ButtonBuilder()
                    .setCustomId("second")
                    .setLabel("2nd")
                    .setStyle(discord_js_1.ButtonStyle.Secondary), new discord_js_1.ButtonBuilder()
                    .setCustomId("0")
                    .setLabel("0")
                    .setStyle(discord_js_1.ButtonStyle.Secondary), new discord_js_1.ButtonBuilder()
                    .setCustomId("decimal")
                    .setLabel(".")
                    .setStyle(discord_js_1.ButtonStyle.Secondary), new discord_js_1.ButtonBuilder()
                    .setCustomId("equals")
                    .setLabel("=")
                    .setStyle(discord_js_1.ButtonStyle.Success));
                // Create button rows for 2nd
                const buttonRows2 = [];
                const row6 = new discord_js_1.ActionRowBuilder();
                const row7 = new discord_js_1.ActionRowBuilder();
                const row8 = new discord_js_1.ActionRowBuilder();
                const row9 = new discord_js_1.ActionRowBuilder();
                const row10 = new discord_js_1.ActionRowBuilder();
                // Add buttons to rows
                row6.addComponents(new discord_js_1.ButtonBuilder()
                    .setCustomId("sin")
                    .setLabel("sin")
                    .setStyle(discord_js_1.ButtonStyle.Secondary), new discord_js_1.ButtonBuilder()
                    .setCustomId("cos")
                    .setLabel("cos")
                    .setStyle(discord_js_1.ButtonStyle.Secondary), new discord_js_1.ButtonBuilder()
                    .setCustomId("tan")
                    .setLabel("tan")
                    .setStyle(discord_js_1.ButtonStyle.Secondary), new discord_js_1.ButtonBuilder()
                    .setCustomId("log")
                    .setLabel("log")
                    .setStyle(discord_js_1.ButtonStyle.Secondary));
                row7.addComponents(new discord_js_1.ButtonBuilder()
                    .setCustomId("asin")
                    .setLabel("sin⁻¹")
                    .setStyle(discord_js_1.ButtonStyle.Secondary), new discord_js_1.ButtonBuilder()
                    .setCustomId("acos")
                    .setLabel("cos⁻¹")
                    .setStyle(discord_js_1.ButtonStyle.Secondary), new discord_js_1.ButtonBuilder()
                    .setCustomId("atan")
                    .setLabel("tan⁻¹")
                    .setStyle(discord_js_1.ButtonStyle.Secondary), new discord_js_1.ButtonBuilder()
                    .setCustomId("ln")
                    .setLabel("ln")
                    .setStyle(discord_js_1.ButtonStyle.Secondary));
                row8.addComponents(new discord_js_1.ButtonBuilder()
                    .setCustomId("pi")
                    .setLabel("π")
                    .setStyle(discord_js_1.ButtonStyle.Secondary), new discord_js_1.ButtonBuilder()
                    .setCustomId("e")
                    .setLabel("e")
                    .setStyle(discord_js_1.ButtonStyle.Secondary), new discord_js_1.ButtonBuilder()
                    .setCustomId("open-parenthesis")
                    .setLabel("(")
                    .setStyle(discord_js_1.ButtonStyle.Secondary), new discord_js_1.ButtonBuilder()
                    .setCustomId("close-parenthesis")
                    .setLabel(")")
                    .setStyle(discord_js_1.ButtonStyle.Secondary));
                row9.addComponents(new discord_js_1.ButtonBuilder()
                    .setCustomId("rand")
                    .setLabel("rand")
                    .setStyle(discord_js_1.ButtonStyle.Secondary), new discord_js_1.ButtonBuilder()
                    .setCustomId("sqrt")
                    .setLabel("√")
                    .setStyle(discord_js_1.ButtonStyle.Secondary), new discord_js_1.ButtonBuilder()
                    .setCustomId("cbrt")
                    .setLabel("∛")
                    .setStyle(discord_js_1.ButtonStyle.Secondary), new discord_js_1.ButtonBuilder()
                    .setCustomId("comma")
                    .setLabel(",")
                    .setStyle(discord_js_1.ButtonStyle.Secondary));
                row10.addComponents(new discord_js_1.ButtonBuilder()
                    .setCustomId("second")
                    .setLabel("2nd")
                    .setStyle(discord_js_1.ButtonStyle.Primary), new discord_js_1.ButtonBuilder()
                    .setCustomId("abs")
                    .setLabel("abs")
                    .setStyle(discord_js_1.ButtonStyle.Secondary), new discord_js_1.ButtonBuilder()
                    .setCustomId("factorial")
                    .setLabel("x!")
                    .setStyle(discord_js_1.ButtonStyle.Secondary), new discord_js_1.ButtonBuilder()
                    .setCustomId("equals")
                    .setLabel("=")
                    .setStyle(discord_js_1.ButtonStyle.Success));
                // Add rows to buttonRows
                buttonRows.push(row1, row2, row3, row4, row5);
                buttonRows2.push(row6, row7, row8, row9, row10);
                // Parse the expression from calculations
                var calculationDisplay = "";
                calculations.forEach((calculationObject) => {
                    calculationDisplay += calculationObject.display;
                });
                // Return JSON with message and buttons
                var content = `\`\`\`js\n${previousCalc ? `${previousCalc} = ${previousAns}\n` : ""}${calculationDisplay === "" ? " " : calculationDisplay}\n\`\`\``;
                if (debug)
                    content = '*Debug Mode*\n' + content;
                return {
                    content,
                    components: second ? buttonRows2 : buttonRows,
                };
            }
            // Send initial message
            yield interaction.reply(updateCalculator());
            const interactionReply = yield interaction.fetchReply();
            // Listen for button clicks
            const filter = (i) => { var _a; return i.user.id === ((_a = i.message.interaction) === null || _a === void 0 ? void 0 : _a.user.id); };
            const collector = interactionReply.createMessageComponentCollector({
                filter,
            });
            // function factorial(n: any) {
            //   var rval = 1;
            //   for (var i = 2; i <= n; i++) rval = rval * i;
            //   return rval;
            // }
            collector.on("collect", (i) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                // If the calculation is message=true, then clear the calculations array
                if ((_a = calculations[0]) === null || _a === void 0 ? void 0 : _a.message) {
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
                        calculations.forEach((calculationObject) => {
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
                                            display: "Imagine you have 0 cookies and you split them evenly among 0 friends. How many cookies does each person get? See? It doesn’t make sense. And Cookie Monster is sad that there are no cookies, and you are sad that you have no friends.",
                                            calculation: "",
                                            message: true,
                                        },
                                    ];
                                    break;
                                default:
                                    result.split("").forEach((char) => {
                                        calculations.push({
                                            display: char,
                                            calculation: char,
                                        });
                                    });
                            }
                        }
                        catch (error) {
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
                yield i.deferUpdate();
            }));
        });
    }
}
exports.CalulatorCommand = CalulatorCommand;
