import { ButtonStyle } from "discord.js";

const { Primary, Secondary, Success } = ButtonStyle;

interface CalculatorButton {
  buttonDisplay: string;
  textDisplay: string;
  calculation: string;
  id?: string;
  style?: ButtonStyle;
}

type CalculatorTab = CalculatorButton[][];

export enum Tabs {
  Main,
  Functions,
  Constants,
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
          style: Primary,
        },
        {
          buttonDisplay: "8",
          textDisplay: "8",
          calculation: "8",
          style: Primary,
        },
        {
          buttonDisplay: "9",
          textDisplay: "9",
          calculation: "9",
          style: Primary,
        },
        {
          buttonDisplay: "÷",
          textDisplay: "÷",
          calculation: "/",
          id: "divide",
          style: Secondary,
        },
      ],
      [
        {
          buttonDisplay: "4",
          textDisplay: "4",
          calculation: "4",
          style: Primary,
        },
        {
          buttonDisplay: "5",
          textDisplay: "5",
          calculation: "5",
          style: Primary,
        },
        {
          buttonDisplay: "6",
          textDisplay: "6",
          calculation: "6",
          style: Primary,
        },
        {
          buttonDisplay: "×",
          textDisplay: "×",
          calculation: "*",
          id: "multiply",
          style: Secondary,
        },
      ],
      [
        {
          buttonDisplay: "1",
          textDisplay: "1",
          calculation: "1",
          style: Primary,
        },
        {
          buttonDisplay: "2",
          textDisplay: "2",
          calculation: "2",
          style: Primary,
        },
        {
          buttonDisplay: "3",
          textDisplay: "3",
          calculation: "3",
          style: Primary,
        },
        {
          buttonDisplay: "−",
          textDisplay: "-",
          calculation: "-",
          id: "subtract",
          style: Secondary,
        },
      ],
      [
        {
          buttonDisplay: ".",
          textDisplay: ".",
          calculation: ".",
          id: "dot",
          style: Primary,
        },
        {
          buttonDisplay: "0",
          textDisplay: "0",
          calculation: "0",
          style: Primary,
        },
        {
          buttonDisplay: "=",
          textDisplay: "=",
          calculation: "=",
          id: "calculate",
          style: Success,
        },
        {
          buttonDisplay: "+",
          textDisplay: "+",
          calculation: "+",
          id: "add",
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
          buttonDisplay: "√",
          textDisplay: "√(",
          calculation: "sqrt(",
          id: "sqrt",
          style: Secondary,
        },
        {
          buttonDisplay: "sin",
          textDisplay: "sin(",
          calculation: "sin(",
          id: "sin",
          style: Secondary,
        },
        {
          buttonDisplay: "cos",
          textDisplay: "cos(",
          calculation: "cos(",
          id: "cos",
          style: Secondary,
        },
        {
          buttonDisplay: "tan",
          textDisplay: "tan(",
          calculation: "tan(",
          id: "tan",
          style: Secondary,
        },
      ],
      [
        {
          buttonDisplay: "e^",
          textDisplay: "e^(",
          calculation: "exp(",
          id: "exp",
          style: Secondary,
        },
        {
          buttonDisplay: "log",
          textDisplay: "log(",
          calculation: "log(",
          id: "log",
          style: Secondary,
        },
        {
          buttonDisplay: "ln",
          textDisplay: "ln(",
          calculation: "ln(",
          id: "ln",
          style: Secondary,
        },
        {
          buttonDisplay: ",",
          textDisplay: ",",
          calculation: ",",
          id: "comma",
          style: Secondary,
        },
      ],
      [
        {
          buttonDisplay: "(",
          textDisplay: "(",
          calculation: "(",
          id: "openParen",
          style: Secondary,
        },
        {
          buttonDisplay: ")",
          textDisplay: ")",
          calculation: ")",
          id: "closeParen",
          style: Secondary,
        },
        {
          buttonDisplay: "!",
          textDisplay: "!",
          calculation: "!",
          id: "factorial",
          style: Secondary,
        },
        {
          buttonDisplay: "^",
          textDisplay: "^",
          calculation: "^",
          id: "exponent",
          style: Secondary,
        },
      ],
      [
        {
          buttonDisplay: "abs",
          textDisplay: "abs(",
          calculation: "abs(",
          id: "abs",
          style: Secondary,
        },
        {
          buttonDisplay: "round",
          textDisplay: "round(",
          calculation: "round(",
          id: "round",
          style: Secondary,
        },
        {
          buttonDisplay: "mod",
          textDisplay: "mod(",
          calculation: "mod(",
          id: "mod",
          style: Secondary,
        },
        {
          buttonDisplay: "%",
          textDisplay: "%",
          calculation: "%",
          id: "remainder",
          style: Secondary,
        },
      ],
    ],
  },
  {
    tab: Tabs.Constants,
    buttonRows: [
        [
          {
            buttonDisplay: "π",
            textDisplay: "π",
            calculation: "pi",
            style: Secondary,
          },
          {
            buttonDisplay: "e",
            textDisplay: "e",
            calculation: "e",
            style: Secondary,
          },
          {
            buttonDisplay: "φ",
            textDisplay: "φ",
            calculation: "phi",
            style: Secondary,
          },
          {
            buttonDisplay: "i",
            textDisplay: "i",
            calculation: "i",
            style: Secondary,
          }
        ],
        [
          {
            buttonDisplay: "∞",
            textDisplay: "∞",
            calculation: "Infinity",
            style: Secondary,
          }
        ]
    ]
  }
];
