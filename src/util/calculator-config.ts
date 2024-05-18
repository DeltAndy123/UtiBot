import { ButtonStyle } from "discord.js";

const { Primary, Secondary, Success } = ButtonStyle;

interface CalculatorButton {
  buttonDisplay: string;
  textDisplay: string;
  calculation: string;
  id: string;
  style?: ButtonStyle;
}

type CalculatorTab = CalculatorButton[][];

export enum Tabs {
  Main,
  Functions,
}

type CalculatorLayout = {
  tab: Tabs;
  buttonRows: CalculatorTab;
}[];

export const calculatorLayout: CalculatorLayout = [
  {
    tab: Tabs.Main,
    buttonRows: [
      [
        {
          buttonDisplay: "7",
          textDisplay: "7",
          calculation: "7",
          id: "calculator.7",
          style: Primary,
        },
        {
          buttonDisplay: "8",
          textDisplay: "8",
          calculation: "8",
          id: "calculator.8",
          style: Primary,
        },
        {
          buttonDisplay: "9",
          textDisplay: "9",
          calculation: "9",
          id: "calculator.9",
          style: Primary,
        },
        {
          buttonDisplay: "÷",
          textDisplay: "÷",
          calculation: "/",
          id: "calculator.divide",
          style: Secondary,
        },
      ],
      [
        {
          buttonDisplay: "4",
          textDisplay: "4",
          calculation: "4",
          id: "calculator.4",
          style: Primary,
        },
        {
          buttonDisplay: "5",
          textDisplay: "5",
          calculation: "5",
          id: "calculator.5",
          style: Primary,
        },
        {
          buttonDisplay: "6",
          textDisplay: "6",
          calculation: "6",
          id: "calculator.6",
          style: Primary,
        },
        {
          buttonDisplay: "×",
          textDisplay: "×",
          calculation: "*",
          id: "calculator.multiply",
          style: Secondary,
        },
      ],
      [
        {
          buttonDisplay: "1",
          textDisplay: "1",
          calculation: "1",
          id: "calculator.1",
          style: Primary,
        },
        {
          buttonDisplay: "2",
          textDisplay: "2",
          calculation: "2",
          id: "calculator.2",
          style: Primary,
        },
        {
          buttonDisplay: "3",
          textDisplay: "3",
          calculation: "3",
          id: "calculator.3",
          style: Primary,
        },
        {
          buttonDisplay: "−",
          textDisplay: "-",
          calculation: "-",
          id: "calculator.subtract",
          style: Secondary,
        },
      ],
      [
        {
          buttonDisplay: ".",
          textDisplay: ".",
          calculation: ".",
          id: "calculator.dot",
          style: Primary,
        },
        {
          buttonDisplay: "0",
          textDisplay: "0",
          calculation: "0",
          id: "calculator.0",
          style: Primary,
        },
        {
          buttonDisplay: "=",
          textDisplay: "=",
          calculation: "=",
          id: "calculator.calculate",
          style: Success,
        },
        {
          buttonDisplay: "+",
          textDisplay: "+",
          calculation: "+",
          id: "calculator.add",
          style: Secondary,
        },
      ],
    ],
  },
  {
    tab: Tabs.Functions,
    buttonRows: [
      [
        {
          buttonDisplay: "sin",
          textDisplay: "sin(",
          calculation: "sin(",
          id: "calculator.sin",
          style: Secondary,
        },
        {
          buttonDisplay: "cos",
          textDisplay: "cos(",
          calculation: "cos(",
          id: "calculator.cos",
          style: Secondary,
        },
        {
          buttonDisplay: "tan",
          textDisplay: "tan(",
          calculation: "tan(",
          id: "calculator.tan",
          style: Secondary,
        },
        {
          buttonDisplay: "log",
          textDisplay: "log(",
          calculation: "log(",
          id: "calculator.log",
          style: Secondary,
        },
      ],
      [
        {
          buttonDisplay: "√",
          textDisplay: "√(",
          calculation: "sqrt(",
          id: "calculator.sqrt",
          style: Secondary,
        },
        {
          buttonDisplay: "exp",
          textDisplay: "exp(",
          calculation: "exp(",
          id: "calculator.exp",
          style: Secondary,
        },
        {
          buttonDisplay: "ln",
          textDisplay: "ln(",
          calculation: "ln(",
          id: "calculator.ln",
          style: Secondary,
        },
        {
          buttonDisplay: "π",
          textDisplay: "π",
          calculation: "pi",
          id: "calculator.pi",
          style: Secondary,
        },
      ],
      [
        {
          buttonDisplay: "(",
          textDisplay: "(",
          calculation: "(",
          id: "calculator.openParen",
          style: Secondary,
        },
        {
          buttonDisplay: ")",
          textDisplay: ")",
          calculation: ")",
          id: "calculator.closeParen",
          style: Secondary,
        },
        {
          buttonDisplay: "!",
          textDisplay: "!",
          calculation: "!",
          id: "calculator.factorial",
          style: Secondary,
        },
        {
          buttonDisplay: "^",
          textDisplay: "^",
          calculation: "^",
          id: "calculator.exponent",
          style: Secondary,
        },
      ],
      [
        {
          buttonDisplay: "e",
          textDisplay: "e",
          calculation: "e",
          id: "calculator.e",
          style: Secondary,
        },
        {
          buttonDisplay: "abs",
          textDisplay: "abs(",
          calculation: "abs(",
          id: "calculator.abs",
          style: Secondary,
        },
        {
          buttonDisplay: "round",
          textDisplay: "round(",
          calculation: "round(",
          id: "calculator.round",
          style: Secondary,
        },
        {
          buttonDisplay: "mod",
          textDisplay: "mod(",
          calculation: "mod(",
          id: "calculator.mod",
          style: Secondary,
        },
      ],
    ],
  },
];
