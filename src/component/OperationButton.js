import {ACTIONS} from '../App';

export default function OperationButton({dispatch,operation}){
    return(
        <button onClick={()=>
            dispatch({
                type:ACTIONS.CHOOSE_OPERATION,
                payload: {operation}})}>
            {operation}
        </button>
    )
}

//here we put on what the ACTIONS should we do
//in payload this will determine on what operation should we use to calculate numbers