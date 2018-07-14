import { connect } from 'react-redux';
import React, { Component } from 'react';
import SendButton from './send_button.js';
import { Styles, UI } from '../../constants';
import MessageInput from './message_input.js';


class MessageTransport extends Component {
    isVisible = () => ( this.props.connected && this.props.recipient !== UI.NO_RECIPIENT);

    render() {
        return this.isVisible()
            ? <div style={Styles.fieldStyle}>
                <MessageInput/>
                <SendButton socket={this.props.socket}/>
              </div>
            : null;
    }
}

const mapStateToProps = (state) => ({
    connected: state.socketState.connected,
    port: state.socketState.port,
    user: state.messageState.user,
    recipient: state.messageState.recipient
});

const mapDispatchToProps = (dispatch) => ({
    dispatch: dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(MessageTransport);