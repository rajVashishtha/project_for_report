import themeReducer from './theme/theme.reducer'
import activeReducer from './active-navbar/activenavbar.reducer'
import adminReducer from './admin/admin.reducer'
import {combineReducers} from 'redux'

export default combineReducers({
    theme : themeReducer,
    active_navbar:activeReducer,
    admin:adminReducer
})
