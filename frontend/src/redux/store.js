import {createStore, applyMiddleware} from 'redux'

import logger from 'redux-logger'
import rootReducer from './root.reducer'

import md5 from 'md5'

const middleware = [logger]
if(process.env.NODE_ENV === "production"){
    middleware.pop();
}

const saveToLocalStorage = (state)=>{
    try{
        const serializeState = JSON.stringify(state)
        localStorage.setItem(md5('redjungles-state'), serializeState)
    }catch(e){
        console.log(e)
    }
}
const loadFromLocalStorage = ()=>{
    try{
        const serializeState = localStorage.getItem(md5('redjungles-state'))
        if(serializeState == null)return undefined
        return JSON.parse(serializeState)
    }catch(e){
        console.log(e)
        return undefined
    }
}
const persistState = loadFromLocalStorage()
const store = createStore(rootReducer,persistState, applyMiddleware(...middleware))
store.subscribe(()=>saveToLocalStorage(store.getState()))
export default store;