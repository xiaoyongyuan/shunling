import { combineReducers} from "redux";
import { SOCKET,SET_POLICELIST } from "../action/type";
const initialState={
    num:"0",
    actionKeys:"",
    policeList:""
};
const postReducer=(state=initialState,action)=>{
    switch (action.type) {
        case SOCKET:
            return{
                ...state,
                num:action.payload
            };
        case "SET_POLICELIST":
            return {
                policeList:action.policeList
            };
        default:
            return state;
    }
};
export default combineReducers({
    postReducer
})
