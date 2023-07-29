import { useReducer } from "react";
import DigitButton from "./component/DigitButton";
import OperationButton from "./component/OperationButton";
import "./style.css";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
};

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      //this is to overwrite the evaluated value
      //after 1 + 1 = 2 , when typing 3, it will replace the number two instead of adding it
      if(state.overwrite){
        return{
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        }
      }
      //if we only put number 0 on the tray, it will not expand more
      //no matter how many timses you clicked the 0 button
      if (payload.digit === "0" && state.currentOperand === "0") {
        return state;
      }
      //same as the 0 above to avoid multiple dots
      if (payload.digit === "." && state.currentOperand.includes(".")) {
        return state;
      }
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };

    case ACTIONS.CHOOSE_OPERATION:
      //if there are no numbers input, you can put operations either in the tray
      if (state.currentOperand == null && state.previousOperand == null) {
        return state;
      }

      //overriding operation
      if(state.currentOperand === null){
        return{
          ...state,
          operation: payload.operation,
        }
      }
      //previous operand are numbers that will be put above along with the operations
      //current operand are numbers that are we currently typing
      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        };
      }

      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,
      };

    //clear means removes everything
    case ACTIONS.CLEAR:
      return {};

    case ACTIONS.DELETE_DIGIT:
      if(state.overwrite){
        return{
          ...state,
          overwrite: false,
          currentOperand: null
        }
      }
      // we can't delete if there are no numbers
      if(state.currentOperand === null) return state
      if(state.currentOperand === 1){
        return {...state,currentOperand: null}
      } 

      //remove the last digit from the current operand
    return {
      ...state,
      currentOperand: state.currentOperand.slice(0,-1)
    }

    case ACTIONS.EVALUATE:
      //no actions will be done if either of the three is null
        if(
          state.operation == null || 
          state.currentOperand == null ||
          state.previousOperand == null
          ){
            return state
          }
      //current operand is where we put the total number that was evaluated ex: 1+1 = 2
      return{
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state),
      }
      default:
        return state
  }
}

function evaluate({ currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);

  //Not a Number will be prevented
  if (isNaN(prev) || isNaN(current)) return "";
  let computation = "";

  switch (operation) {
    case "+":
      computation = prev + current;
      break;
    case "-":
      computation = prev - current;
      break;
    case "*":
      computation = prev * current;
      break;
    case "÷":
      computation = prev / current;
      break;
    default:
  }
  
  return computation.toString()
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us",{
  maximumFractionDigits: 0,
})
//1.5 1 is integer, 5 is decimal
//we use Internation number format like this : 12,000 where we can separate with comma
function formatOperand(operand){
  if(operand == null) return   //we return nothing

  const [integer,decimal] = operand.split('.')
  if(decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}` //
}

function App() {
  //useReducer is an alternative for useState and {} is a default state
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  );

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">
          {formatOperand(previousOperand)} {operation}
        </div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}
      >
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>
      <OperationButton operation="÷" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button className="span-two"  onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>=</button>
    </div>
  );
}

export default App;
