let config;
let path = process.argv[2];
let mId = process.argv[3];
let usage = 'Usage: node server.js path/to/servers.json server-id';

if (!path) {
    console.log(usage);
    process.exit();
} else {
    console.log(`Loading config from: ${path}`);
    try {
        let fs = require('fs');
        config = JSON.parse(fs.readFileSync(path, 'utf8'));
    } catch (err) {
        console.log('Loading failed or config could not be parsed.');
        process.exit();
    }
    console.log('Config loaded.');
    console.log(`My id: ${mId}`);
}

let myConfig = config.servers.find(server => server.id === mId);

if (!myConfig){
    console.log(usage);
    process.exit();
}

const IM = 'im';
const IDENT = 'identify';
const CONNECT = 'connect';
const CONNECTION = 'connection';
const DISCONNECT = 'disconnect';
const UPDATE_PEER = 'update_peer';
const UPDATE_CLIENT = 'update_client';

let peers = {};
let users = {};
let usersByConnection = {};
let pUsers = {};

let port = myConfig.port;
let socket = require('socket.io')(port);
socket.on(CONNECTION, onConnection);
console.log(`Listening for connections on port: ${port}`);

let io = require('socket.io-client');
connectToPeers(config.servers);

function connectToPeers(servers){
    console.log('Attempting to connect to peers...');
    servers.forEach( peer => {
        if (peer.id !== mId) {
            let host = `http://${peer.ip}:${peer.port}`;

            console.log(`Attempt connection to peer: ${peer.id} at: ${host}`);
            let peerSocket = io.connect(host, {reconnection:true} );

            peers[peer.id] = peerSocket;

            peerSocket.on(CONNECT, function() {
                console.log(`Outbound connection to peer: ${peer.id}`);
                pUsers[peer.id] = [];
                peerSocket.on(DISCONNECT, onDisconnect);
                updatePeerWithUserList();

            });

            function onDisconnect(){
                console.log(`Peer: ${peer.id} disconnected. Will retry automatically.`);
            }

            function updatePeerWithUserList() {
                let userIds = Object.keys(users);
                if (userIds.length) { 
                    console.log(`Updating peer: ${peer.id} with user list...`);
                    let list = userIds.map(id => ({id: id, connections: users[id].length}));
                    let message = {list: list, pId:mId};
                    peerSocket.emit(UPDATE_PEER, message);
                }
            }
        }
    });
}

function onConnection(connection) {

    connection.on(IM, onIm);
    connection.on(IDENT,onIdentify);
    connection.on(DISCONNECT, onDisconnect);
    connection.on(UPDATE_PEER, onUpdatePeer);

    function onIdentify(uId) {
        let user = users[uId];

        if (user){
            user.push(connection);
        } else {
            users[uId] = [connection];
        }

        usersByConnection[connection.id] = uId;
        reportUserConnections(uId);
        updateClients();
    }

    
    function onIm(message) {

        console.log(`Received ${message.forwarded?'forwarded ':''}IM from ${message.from} to ${message.to}: ${message.text}`);

        let recipientConnections = users[message.to];

        if (recipientConnections) { 
            console.log(`Recipient ${message.to} has ${recipientConnections.length} connection${recipientConnections.length>1?'s':''} to this server, sending...`);
            recipientConnections.forEach(userConnection => userConnection.emit(IM, message));
        } else {
            console.log(`Recipient ${message.to} not connected to this server`);
        }

        let senderConnections = users[message.from];

        if (senderConnections) { 
            console.log(`Sender ${message.from} has ${senderConnections.length} connection${senderConnections.length>1?'s':''} to this server, sending...`);
            senderConnections.forEach(senderConnection => senderConnection.emit(IM, message));
        } else {
            console.log(`Sender ${message.from} not connected to this server`);
        }

        if (!message.forwarded){
            message.forwarded = true;
            config.servers.forEach( server => {
                let peer = peers[server.id];
                let users = pUsers[server.id];
                if (!!peer && !!users && users.find(u => u.id === message.to)) {
                    console.log(`Forwarding to peer: ${server.id}...`);
                    peer.emit(IM, message);
                } else if (!!peer && !!users && users.find(u => u.id === message.from)) {
                    console.log(`Forwarding to peer: ${server.id}...`);
                    peer.emit(IM, message);
                }
            });
        }
    }

    function onUpdatePeer(message) {
        let pId = message.pId;
        console.log(`Received update from peer: ${pId}`);
        if (message.list) { 
            console.log(`Replacing user list for peer: ${pId}`);
            pUsers[pId] = message.list;
        } else {
            let user = message.user;
            let users = pUsers[pId] || [];
            if (user && user.connections > 0) { 
                if (!!users && !users.find(u => u.id === user.id)) { 
                    console.log(`Adding user ${user.id} to list for peer: ${pId}`);
                    users.push(user);
                } else if (!!users && users.find(u => u.id === user.id)) {
                    console.log(`Replacing user ${user.id} in list for peer: ${pId}`);
                    pUsers[pId] = users.map(u => (u.id === user.id) ? user : u);
                } else {
                    pUsers[pId] = [user];
                }
            } else if (user && user.connections === 0) { 
                
                console.log(`Removing user ${user.id} from list for peer: ${pId}`);
                let index = users.findIndex(u => u.id === user.id);
                if (index > -1) users.splice(index,1);
            }
        }

        updateClients();
    }

    
    function onDisconnect() {
        let uId = usersByConnection[connection.id];
        if (uId) {
            delete usersByConnection[connection.id];
            let userConnections = users[uId];
            if (userConnections) {
                console.log(`User ${uId} disconnected.`);
                userConnections.forEach( (userConnection, index) => {
                    if (userConnection.id === connection.id){
                        userConnections.splice(index, 1);
                    }
                });
                if (userConnections.length > 0) {
                    console.log(`User ${uId} still has ${userConnections.length} connections.`);
                } else {
                    delete users[uId];
                }
            }
            reportUserConnections(uId);
            updateClients();
        }

        connection.removeListener(IM, onIm);
        connection.removeListener(IDENT, onIdentify);
        connection.removeListener(DISCONNECT, onDisconnect);
    }

    
    function reportUserConnections(user){
        let count = users[user] ? users[user].length : 0;
        if (count) console.log(`User: ${user} connected ${count} time${(count>1)?'s':''}.`);
        
        console.log(`Updating peers with connection count for user: ${user}...`);
        let message = {
            pId: mId,
            user: {
                id: user,
                connections: count
            }
        };
        config.servers.forEach( server => {
            let peer = peers[server.id];
            if (peer) peer.emit(UPDATE_PEER, message);
        });
    }

}

function updateClients(){
    console.log(`Updating clients with new user list...`);
    let message = {
        list: getSystemUserList()
    };
    Object.keys(users).forEach(user =>
        users[user].forEach(connection =>
            connection.emit(UPDATE_CLIENT, message)
        )
    );
}

function getSystemUserList(){
    let uHash = Object.assign({}, users);
    Object.keys(pUsers).forEach( pId => {
        pUsers[pId].forEach( user => uHash[user.id] = true);
    });
    let uniqueUsers = Object.keys(uHash);
    uniqueUsers.sort();
    return uniqueUsers;
}