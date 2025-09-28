import { Columns } from "./cards.Type";

const FETCH_ALL_CARDS_DATA="FETCH_ALL_CARDS_DATA"
const SET_LOADING="SET_LOADING"
const SHOW_NEW_COLUMN_FORM="SHOW_NEW_COLUMN_FORM"

type ActionType=typeof FETCH_ALL_CARDS_DATA  | typeof SET_LOADING |typeof SHOW_NEW_COLUMN_FORM
interface ActionInterface{
 type:ActionType,
 payload:unknown
}

const initalState:Columns={
    columns:[],
    loading:true,
    showNewColumnForm:false,
};
const CardsReducer=(store=initalState,action:ActionInterface)=>{
    const {type,payload}=action;
    switch(type){
        case 'FETCH_ALL_CARDS_DATA':
            return {...store,columns:payload};
        // case 'SHOW_ADD_CARDS':
        //     return {...store,column.}
        case 'SET_LOADING':
            return {...store,loading:payload};
        case 'SHOW_NEW_COLUMN_FORM':
            return {...store,showNewColumnForm:payload};
        default :
        return store;
    }
}

export {FETCH_ALL_CARDS_DATA,SET_LOADING,SHOW_NEW_COLUMN_FORM};
export default CardsReducer;