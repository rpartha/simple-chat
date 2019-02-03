
import {
    USER_CHANGED,
    ABANDON_CHAT,
    MESSAGE_SENT,
    MESSAGE_RECEIVED,
    RECIPIENT_CHANGED,
    CLIENT_UPDATE_RECEIVED,
    OUTGOING_MESSAGE_CHANGED,    
} from '../actions';

import { UI } from '../../../constants';

const INIT_STATE = {
    user: undefined,
    recipient: UI.NO_RECIPIENT,
    outgoingMessage: '',
    recipientLost: false,
    lostRecipient: null,
    threads: {},
    users: []
};

function messageReducer(state = INIT_STATE, action) {
    let reduced;
    switch (action.type){
       case USER_CHANGED:
            reduced = Object.assign({},
                state, {user: action.user}
            );
            break;

        case RECIPIENT_CHANGED:
            reduced = Object.assign({},
                state,
                {recipient: action.recipient},
                (action.recipient === UI.NO_RECIPIENT) ? {outgoingMessage: ''} : {}
            );
            break;

        case OUTGOING_MESSAGE_CHANGED:
            reduced = Object.assign({},
                state,
                {outgoingMessage: action.text}
            );
            break;
        
        case MESSAGE_SENT:
            reduced = Object.assign({},
                state, {outgoingMessage: ''}
            );
            break;

        case MESSAGE_RECEIVED:
            const isSentEcho = (action.message.from === state.user);
            const recipient = isSentEcho ? action.message.to : action.message.from;

            //Use array index of rendered IM components
            const messageKey = (!!state.threads[recipient]) ? state.threads[recipient].length : 0;
            const keyedMessage = Object.assign({}, action.message, {key: messageKey});
            
            //Add keyed message to clone of appropriate thread
            const thread = (state.threads[recipient]) ? state.threads[recipient].concat([keyedMessage]) : [keyedMessage];

            reduced = Object.assign({}, state, {
                recipient: recipient,
                threads: Object.assign({}, state.threads, {
                    [recipient]: thread
                })
            });
            break;

        case CLIENT_UPDATE_RECEIVED:
            reduced = Object.assign({},
                state, {users: action.otherUsers, recipientLost: action.recipientLost},
                (action.recipientLost)
                    ? {recipient: UI.NO_RECIPIENT, lostRecipient: state.recipient}
                    : {},
                (!action.recipientLost && !!state.lostRecipient)
                    ? {recipient: state.lostRecipient}
                    : {}
            );
            break;

        case ABANDON_CHAT:
            reduced = Object.assign({},
                state,
                {users:[], recipient: UI.NO_RECIPIENT, outgoingMessage: ''}
            );
            break;

        default:
            reduced = state;
    }
    return reduced;
}

export default messageReducer;