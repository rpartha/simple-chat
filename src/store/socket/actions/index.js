export const PORT_CHANGED       = 'socket/port-changed';
export const CONNECTION_CHANGED = 'socket/connection-changed';

export const connectionChanged = isConnected => {
    return {
        type: CONNECTION_CHANGED,
        connected: isConnected,
        isError: false
    };
};

export const portChanged = port => {
    return {
        type: PORT_CHANGED,
        port: port
    };
};