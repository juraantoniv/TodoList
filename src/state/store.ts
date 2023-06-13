import { tasksReducer } from './tasks-reducer';
import { todolistsReducer } from './todolists-reducer';
import {Action, applyMiddleware, combineReducers, createStore, legacy_createStore} from 'redux';
import thunk, {ThunkDispatch} from "redux-thunk";
import {useDispatch} from "react-redux";


const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer
})


type AppDispatchType = ThunkDispatch<AppRootStateType, any, Action>

export const useAppDispatch  = () => useDispatch<AppDispatchType>()
export const store = legacy_createStore(rootReducer,applyMiddleware(thunk));

export type AppRootStateType = ReturnType<typeof rootReducer>


// @ts-ignore
window.store = store;
