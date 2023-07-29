import {ACTIONS} from '../App';

export default function DigitButton({dispatch,digit}){
    return(
        <button onClick={()=>
            dispatch({
                type:ACTIONS.ADD_DIGIT,
                payload: {digit}})}>
            {digit}
        </button>
    )
}
//put the dispatch here so we can access our reducer
//payload is what number should we put on the tray - we have numbers 0-9