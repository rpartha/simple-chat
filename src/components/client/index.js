import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Styles, UI } from '../../constants';

import UserInput from '../user-input';
import Socket from '../../utils/socket.js';
import PortSelector from '../port-selector';
import MessageHistory from '../message-history';
import MessageTransport from '../message-transport';
import RecipientSelector from '../recipient-selector';

import Footer from '../footer';

import { messageReceived, clientUpdateReceived, recipientChanged } from '../../store/message/actions';
import { connectionChanged } from '../../store/socket/actions';
import { statusChanged } from '../../store/status/actions';

class Client extends Component {
    constructor(props) {
        super(props);
        this.socket = new Socket(
            this.onConnectionChange,
            this.onSocketError,
            this.onIncomingMessage,
            this.onUpdateClient
        );
    }

    onConnectionChange = isConnected => {
        this.props.dispatch(connectionChanged(isConnected));
        this.props.dispatch(statusChanged(isConnected ? 'Connected' : 'Disconnected'));
    };

    onSocketError = (status) => this.props.dispatch(statusChanged(status, true));
    onIncomingMessage = message => this.props.dispatch(messageReceived(message));

    onUpdateClient = message => {
        let otherUsers = message.list.filter(user => user !== this.props.user);
        let recipientLost = this.props.recipient !== UI.NO_RECIPIENT && !(message.list.find(user => user === this.props.recipient));
        let recipientFound = !!this.props.lostRecipient && !!message.list.find(user => user === this.props.lostRecipient);

        const dispatchUpdate = () => {
            this.props.dispatch(clientUpdateReceived(otherUsers, recipientLost));
        };

        if (recipientLost && !this.props.recipientLost) { 
            this.props.dispatch(statusChanged(`${this.props.recipient} ${UI.RECIPIENT_LOST}`, true));
            dispatchUpdate();
        } else if (recipientFound) { 
            this.props.dispatch(statusChanged(`${this.props.lostRecipient} ${UI.RECIPIENT_FOUND}`));
            dispatchUpdate();
            this.props.dispatch(recipientChanged(this.props.lostRecipient));
        } else {
            dispatchUpdate();
        }
    };

    render() {
        return <div style={Styles.clientStyle}>
            <UserInput/>
            <PortSelector/>
            <RecipientSelector/>
            <MessageTransport socket={this.socket}/>
            <MessageHistory/>
            <Footer socket={this.socket}/>
        </div>;
    }
}

const mapStateToProps = (state) => ({
    recipient: state.messageState.recipient,
    lostRecipient: state.messageState.lostRecipient,
    user: state.messageState.user
});

const mapDispatchToProps = (dispatch) => ({
    dispatch: dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(Client);