import * as Protocol from '../constants/protocol.js';
import io from 'socket.io-client';

export default class Socket {
    constructor(onChange, onSocketError, onMessage, onUpdateClient) {
        this.onChange = onChange;
        this.onSocketError = onSocketError;
        this.onMessage = onMessage;
        this.onUpdateClient = onUpdateClient;
        this.socket = null;
        this.user = null;
        this.port = null;
    }
    
    connect = (user, port) => {
        this.user = user;
        this.port = port;

        var os = require('os');

        var interfaces = os.networkInterfaces();
        var addresses = [];
        for (var k in interfaces) {
            for (var k2 in interfaces[k]) {
                var address = interfaces[k][k2];
                if (address.family === 'IPv4' && !address.internal) {
                    addresses.push(address.address);
                }
            }
        }
        
        let host = `http://localhost:${port}`; //
        this.socket = io.connect(host);
        
        this.socket.on(Protocol.CONNECT, this.onConnected);
        this.socket.on(Protocol.DISCONNECT, this.onDisconnected);
        this.socket.on(Protocol.CONNECT_ERR, this.onError);
        this.socket.on(Protocol.RECONNECT_ERR, this.onError);
    };
    
    onConnected = () => {
        this.sendIdent();
        this.socket.on(Protocol.IM, this.onMessage);
        this.socket.on(Protocol.UPDATE_CLIENT, this.onUpdateClient);
        this.onChange(true);
    };
    
    onDisconnected = () => this.onChange(false);
    sendIdent = () => this.socket.emit(Protocol.IDENT, this.user);
    sendIm = message => this.socket.emit(Protocol.IM, message);
    disconnect = () => this.socket.close();
    onError = message  => {
        this.onSocketError(message);
        this.disconnect();
    };
}