import { TasksStateType } from '../App';
import { v1 } from 'uuid';
import {AddTodolistActionType, RemoveTodolistActionType, setTodoListAC, SetTodoListType} from './todolists-reducer';
import {
    TaskPriorities,
    TaskStatuses,
    TaskType,
    todolistsAPI,
    TodolistType,
    UpdateTaskModelType
} from '../api/todolists-api'
import {Dispatch} from "redux";
import {AppRootStateType} from "./store";

export type RemoveTaskActionType = {
    type: 'REMOVE-TASK',
    todolistId: string
    taskId: string
}

export type AddTaskActionType = {
    type: 'ADD-TASK',
    task:TaskType
}

export type ChangeTaskStatusActionType = {
    type: 'CHANGE-TASK-STATUS',
    todolistId: string
    taskId: string
    status: TaskStatuses
}

export type ChangeTaskTitleActionType = {
    type: 'CHANGE-TASK-TITLE',
    todolistId: string
    taskId: string
    title: string
}

type ActionsType = RemoveTaskActionType | AddTaskActionType
    | ChangeTaskStatusActionType
    | ChangeTaskTitleActionType
    | AddTodolistActionType
    | RemoveTodolistActionType|SetTodoListType|ReturnType<typeof seTasks>

const initialState: TasksStateType = {
    /*"todolistId1": [
        { id: "1", title: "CSS", status: TaskStatuses.New, todoListId: "todolistId1", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "2", title: "JS", status: TaskStatuses.Completed, todoListId: "todolistId1", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "3", title: "React", status: TaskStatuses.New, todoListId: "todolistId1", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low }
    ],
    "todolistId2": [
        { id: "1", title: "bread", status: TaskStatuses.New, todoListId: "todolistId2", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "2", title: "milk", status: TaskStatuses.Completed, todoListId: "todolistId2", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "3", title: "tea", status: TaskStatuses.New, todoListId: "todolistId2", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low }
    ]*/

}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
    switch (action.type) {

        case "SetTasks":{

           return  {...state, [action.todoId]:action.tasks}
        }
        case "Set-Todos":{
            const copyState = {...state}
            action.todo.forEach((tl)=>{
                copyState[tl.id]=[]
            })
            return copyState
        }
        case 'REMOVE-TASK': {
            const stateCopy = {...state}
            const tasks = stateCopy[action.todolistId];
            const newTasks = tasks.filter(t => t.id !== action.taskId);
            stateCopy[action.todolistId] = newTasks;
            return stateCopy;
        }
        case 'ADD-TASK': {

            return {...state, [action.task.todoListId]:[action.task,...state[action.task.todoListId]]}
        }
        case 'CHANGE-TASK-STATUS': {
            let todolistTasks = state[action.todolistId];
            let newTasksArray = todolistTasks
                .map(t => t.id === action.taskId ? {...t, status: action.status} : t);

            state[action.todolistId] = newTasksArray;
            return ({...state});
        }
        case 'CHANGE-TASK-TITLE': {
            let todolistTasks = state[action.todolistId];

            let newTasksArray = todolistTasks
                .map(t => t.id === action.taskId ? {...t, title: action.title} : t);

            state[action.todolistId] = newTasksArray;
            return ({...state});
        }
        case 'ADD-TODOLIST': {
            return {
                ...state,
                [action.todolistId]: []
            }
        }
        case 'REMOVE-TODOLIST': {
            const copyState = {...state};
            delete copyState[action.id];
            return copyState;
        }
        default:
            return state;
    }
}

export const removeTaskAC = (taskId: string, todolistId: string): RemoveTaskActionType => {
    return {type: 'REMOVE-TASK', taskId: taskId, todolistId: todolistId}
}
export const addTaskAC = (task: TaskType): AddTaskActionType => {
    return {type: 'ADD-TASK', task}
}
export const changeTaskStatusAC = (taskId: string, status: TaskStatuses, todolistId: string): ChangeTaskStatusActionType => {
    return {type: 'CHANGE-TASK-STATUS', status, todolistId, taskId}
}
export const changeTaskTitleAC = (taskId: string, title: string, todolistId: string): ChangeTaskTitleActionType => {
    return {type: 'CHANGE-TASK-TITLE', title, todolistId, taskId}
}

export type _SetTodoListType = {
    type: 'Set-Todos',
    todo: TodolistType[]
}

export const seTasks = (todoId:string ,tasks:TaskType[])=>{

    return {

        type:'SetTasks',
        tasks,
        todoId
    } as const
}

export const getTasks=(todoId:string) => (dispatch:Dispatch)=>{

    todolistsAPI.getTasks(todoId).then((el)=>{
        dispatch(seTasks(todoId, el.data.items))
    })
}


export const deleteTasks=(todoId:string, taskId:string) => (dispatch:Dispatch)=>{

    todolistsAPI.deleteTask(todoId,taskId).then((el)=>{
        dispatch(removeTaskAC(taskId, todoId))

    })
}

export const createTasks=(todoId:string,title:string) => (dispatch:Dispatch)=>{

    todolistsAPI.createTask(todoId,title).then((el)=>{
        dispatch(addTaskAC(el.data.data.item))
    })
}

export const updateTasks=(todoId:string,taskId:string, status:TaskStatuses) => (dispatch:Dispatch, getState:()=>AppRootStateType)=>{

    const task = getState().tasks[todoId].find(el =>el.id===taskId)

    const model:UpdateTaskModelType ={
        title:task!.title,
        deadline:task!.deadline,
        startDate:task!.startDate,
        priority:task!.priority,
        description:task!.description,
        status


    }

    todolistsAPI.updateTask(todoId,taskId, model).then((el)=>{
        dispatch(changeTaskStatusAC(taskId,status,todoId))
    })
}



