import {
  AccessorNode,
  ArrayNode,
  AssignmentNode,
  BlockNode,
  ConditionalNode,
  ConstantNode,
  FunctionAssignmentNode,
  FunctionNode,
  IndexNode,
  ObjectNode,
  OperatorNode,
  ParenthesisNode,
  RangeNode,
  RelationalNode,
  SymbolNode
} from "mathjs";

type AnyMathNode = AccessorNode |
  ArrayNode |
  AssignmentNode |
  BlockNode |
  ConditionalNode |
  ConstantNode |
  FunctionAssignmentNode |
  FunctionNode |
  IndexNode |
  ObjectNode |
  OperatorNode |
  ParenthesisNode |
  RangeNode |
  RelationalNode |
  SymbolNode