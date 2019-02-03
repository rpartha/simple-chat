import { combineReducers, createStore, applyMiddleware} from 'redux';


import socketReducer from './socket/reducer';
import messageReducer from './message/reducer';
import statusReducer from './status/reducer';

import socketMiddleware from './socket/middleware';


const rootReducer = combineReducers({
    socketState: socketReducer,
    messageState: messageReducer,
    statusState: statusReducer
});


const store = createStore(rootReducer, applyMiddleware(socketMiddleware));

export default store;