
import {
    USER_CHANGED,
    RECIPIENT_CHANGED,
    OUTGOING_MESSAGE_CHANGED,
    MESSAGE_RECEIVED,
    CLIENT_UPDATE_RECEIVED,
    SEND_MESSAGE,
    ABANDON_CHAT
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

        case MESSAGE_RECEIVED:
            
            let isSentEcho = (action.message.from === state.user);
            let thread, recipient = isSentEcho ? action.message.to : action.message.from;

            
            let messageKey = (!!state.threads[recipient]) ? state.threads[recipient].length : 0;
            let keyedMessage = Object.assign({}, action.message, {key: messageKey});

            
            if (state.threads[recipient]) {
                thread = state.threads[recipient].concat([keyedMessage]);
            } else {
                thread = [keyedMessage];
            }

            
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

        case SEND_MESSAGE:
            action.socket.sendIm({
                'from': state.user,
                'to': state.recipient,
                'text': state.outgoingMessage,
                'forwarded': false
            });
            reduced = Object.assign({},
                state, {outgoingMessage: action.user}
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