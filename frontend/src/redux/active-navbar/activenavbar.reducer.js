const INITIAL_STATE = {
    currentActive : 0
}

const activeReducer = (state = INITIAL_STATE, action) =>{
    switch(action.type){
        case 'SET_ACTIVE_NAVBAR' : 
            return{
                ...state,
                currentActive : action.payload
            }
        default:
            return state
    }
}

export default activeReducer;