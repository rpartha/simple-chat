export const CONNECT_SOCKET     = 'socket/connect';
export const DISCONNECT_SOCKET  = 'socket/disconnect';
export const PORT_CHANGED       = 'socket/port-changed';
export const CONNECTION_CHANGED = 'socket/connection-changed';

//Socket connection's state changed
export const connectionChanged = isConnected => {
    return {
        type: CONNECTION_CHANGED,
        connected: isConnected,
        isError: false
    };
};

//User selected a differenrt port
export const portChanged = port => {
    return {
        type: PORT_CHANGED,
        port: port
    };
};

//User clicked connect button
export const connectSocket = (user, port) => {
    return{
        type: CONNECT_SOCKET
    };
};

//User clicked disconnect button
export const disconnectSocket = () => {
    return{
        type: DISCONNECT_SOCKET
    };
};