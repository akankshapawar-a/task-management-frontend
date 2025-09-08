import {combineReducers, createStore} from "redux";
import CardsReducer from "./CardsReducer";
const rootReducer=combineReducers({
    board:CardsReducer,
});

const store=createStore(rootReducer);
export default store;

