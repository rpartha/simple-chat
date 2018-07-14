
export const USER_CHANGED             = 'message/user-changed';
export const SEND_MESSAGE             = 'message/send-message';
export const ABANDON_CHAT             = 'message/abandon-chat';
export const MESSAGE_RECEIVED         = 'message/message-received';
export const RECIPIENT_CHANGED        = 'message/recipient-changed';
export const CLIENT_UPDATE_RECEIVED   = 'message/client-update-received';
export const OUTGOING_MESSAGE_CHANGED = 'message/outgoing-message-changed';

export const userChanged = user => {
    return {
        type: USER_CHANGED,
        user: user
    };
};

export const recipientChanged = recipient => {
    return {
        type: RECIPIENT_CHANGED,
        recipient: recipient
    };
};

export const outgoingMessageChanged = text => {
    return {
        type: OUTGOING_MESSAGE_CHANGED,
        text: text
    };
};

export const messageReceived = message => {
    return {
        type: MESSAGE_RECEIVED,
        message: message
    };
};

export const clientUpdateReceived = (otherUsers, recipientLost) => {
    return {
        type: CLIENT_UPDATE_RECEIVED,
        otherUsers: otherUsers,
        recipientLost: recipientLost
    };
};

export const sendMessage = (socket, message) => {
    return {
        type: SEND_MESSAGE,
        message: message,
        socket: socket
    };
};

export const abandonChat = () => ({ type: ABANDON_CHAT });