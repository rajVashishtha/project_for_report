const INITIAL_STATE = {
    currentTheme : "light"
}

const themeReducer = (state = INITIAL_STATE, action) =>{
    switch(action.type){
        case 'SET_THEME' : 
            return{
                ...state,
                currentTheme : action.payload
            }
        default:
            return state
    }
}

export default themeReducer;