import { v1 } from 'uuid';
import {todolistsAPI, TodolistType} from '../api/todolists-api'
import {Dispatch} from "redux";

export type RemoveTodolistActionType = {
    type: 'REMOVE-TODOLIST',
    id: string
}
export type AddTodolistActionType = {
    type: 'ADD-TODOLIST',
    title: string
    todolistId: string
}
export type ChangeTodolistTitleActionType = {
    type: 'CHANGE-TODOLIST-TITLE',
    id: string
    title: string
}
export type ChangeTodolistFilterActionType = {
    type: 'CHANGE-TODOLIST-FILTER',
    id: string
    filter: FilterValuesType
}

type ActionsType = RemoveTodolistActionType | AddTodolistActionType
    | ChangeTodolistTitleActionType
    | ChangeTodolistFilterActionType|SetTodoListType

const initialState: Array<TodolistDomainType> = [
    /*{id: todolistId1, title: 'What to learn', filter: 'all', addedDate: '', order: 0},
    {id: todolistId2, title: 'What to buy', filter: 'all', addedDate: '', order: 0}*/
]

export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
}

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: ActionsType): Array<TodolistDomainType> => {
    switch (action.type) {

        case "Set-Todos":{

            return action.todo.map(el=>({...el,filter:'all'}))
        }

        case 'REMOVE-TODOLIST': {
            return state.filter(tl => tl.id !== action.id)
        }
        case 'ADD-TODOLIST': {
            return [{
                id: action.todolistId,
                title: action.title,
                filter: 'all',
                addedDate: '',
                order: 0
            }, ...state]
        }
        case 'CHANGE-TODOLIST-TITLE': {
            const todolist = state.find(tl => tl.id === action.id);
            if (todolist) {

                todolist.title = action.title;
            }
            return [...state]
        }
        case 'CHANGE-TODOLIST-FILTER': {
            const todolist = state.find(tl => tl.id === action.id);
            if (todolist) {

                todolist.filter = action.filter;
            }
            return [...state]
        }
        default:
            return state;
    }
}

export const removeTodolistAC = (todolistId: string): RemoveTodolistActionType => {
    return {type: 'REMOVE-TODOLIST', id: todolistId}
}
export const addTodolistAC = (title: string,todoId:string): AddTodolistActionType => {
    return {type: 'ADD-TODOLIST', title: title, todolistId: todoId}
}
export const changeTodolistTitleAC = (id: string, title: string): ChangeTodolistTitleActionType => {
    return {type: 'CHANGE-TODOLIST-TITLE', id: id, title: title}
}
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType): ChangeTodolistFilterActionType => {
    return {type: 'CHANGE-TODOLIST-FILTER', id: id, filter: filter}
}

export type SetTodoListType = ReturnType<typeof setTodoListAC>

export const setTodoListAC = (todo:TodolistType[]) => {
    return {type: 'Set-Todos', todo} as const
}


export const getTodos=() => (dispatch:Dispatch)=>{

    todolistsAPI.getTodolists().then((el)=>{
        dispatch(setTodoListAC(el.data))
    })
}


export const updateTodoListTitle=(id: string, title: string) => (dispatch:Dispatch)=>{

    todolistsAPI.updateTodolist(id,title).then((el)=>{

        dispatch(changeTodolistTitleAC(id,title))
    })
}

export const AddTodoList = (title: string) => (dispatch:Dispatch)=>{

    todolistsAPI.createTodolist(title).then((el)=>{

        dispatch(addTodolistAC(title,el.data.data.item.id))
    })
}

export const deleteTodoList = (id: string) => (dispatch:Dispatch)=>{

    todolistsAPI.deleteTodolist(id).then((el)=>{

        dispatch(removeTodolistAC(id))
    })
}



